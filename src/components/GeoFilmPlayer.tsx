import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { GeoMarker, GeoStory } from "../data/types.ts";
import { claimAudioChannel, clipOf, clipUrl, onAudioClaimed, stopSpeaking, type Who } from "../kit/speech.ts";
import { interpolateCamera } from "../lib/geo.ts";
import { maxFrameSeconds } from "../lib/motion.ts";
import { buildNarratedTimeline, lineAtTime, narrationGaps, sceneAtTime, type SpokenLine } from "../lib/narration.ts";
import { GeoStageSvg } from "./GeoStageSvg.tsx";

export type GeoFilmPlayerHandle = {
  playTurn: (turn: number) => void;
};

type Props = {
  story: GeoStory;
  sound: boolean;
  onToggleSound: () => void;
  onTurn?: (turn: number, who?: Who) => void;
};

const formatSec = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const GeoFilmPlayer = forwardRef<GeoFilmPlayerHandle, Props>(function GeoFilmPlayer(
  { story, sound, onToggleSound, onTurn },
  ref
) {
  const playerId = useId();
  const timeline = useMemo(
    () => buildNarratedTimeline(story, (who, text) => clipOf(who, text)?.seconds),
    [story]
  );
  const { scenes, starts, total, lines } = timeline;

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [showBorders, setShowBorders] = useState(true);
  const [pickedMarker, setPickedMarker] = useState<GeoMarker | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthUtterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeLineRef = useRef<SpokenLine | null>(null);
  const preloadedRef = useRef<Set<string>>(new Set());

  const { index, local } = sceneAtTime(scenes, starts, time);
  const scene = scenes[index] ?? scenes[0];
  const prevScene = index > 0 ? scenes[index - 1] : scene;
  const ended = time >= total - 0.02;

  const camera = useMemo(() => {
    if (!scene) return { center: [105, 35] as const, lonSpan: 55 };
    if (index === 0 || local >= 1.15 || scene.kind === "diagram" || prevScene.kind === "diagram") {
      return scene.camera;
    }
    return interpolateCamera(prevScene.camera, scene.camera, local / 1.15);
  }, [scene, prevScene, index, local]);

  const preloadUpcoming = useCallback(
    (fromTime: number) => {
      if (!sound) return;
      const upcoming = lines.filter((item) => item.start + item.seconds >= fromTime).slice(0, 3);
      for (const item of upcoming) {
        const url = clipUrl(item.who, item.text);
        if (!url || preloadedRef.current.has(url)) continue;
        preloadedRef.current.add(url);
        const warm = new Audio();
        warm.preload = "auto";
        warm.src = url;
      }
    },
    [lines, sound]
  );

  const stopAudio = useCallback(() => {
    activeLineRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    synthUtterRef.current = null;
  }, []);

  const startLineAudio = useCallback(
    (line: SpokenLine, offsetSec: number) => {
      if (!sound) return;
      preloadUpcoming(line.start);
      const url = clipUrl(line.who, line.text);
      activeLineRef.current = line;
      claimAudioChannel(playerId);
      if (url) {
        if (!audioRef.current) {
          audioRef.current = Object.assign(new Audio(), { preload: "auto" });
        }
        const player = audioRef.current;
        player.src = url;
        player.currentTime = Math.max(0, offsetSec);
        player.play().then(
          () => setNeedsTap(false),
          (error: unknown) => {
            if (error instanceof DOMException && error.name === "NotAllowedError") {
              setPlaying(false);
              setNeedsTap(true);
            }
          }
        );
      } else if (typeof window !== "undefined" && "speechSynthesis" in window && offsetSec < 0.8) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(line.text);
          u.lang = "zh-CN";
          const list = window.speechSynthesis.getVoices();
          const pref =
            line.who === "nian"
              ? list.find((v) => /Yunxia/i.test(v.name))
              : list.find((v) => /Yunxi/i.test(v.name));
          const zh = pref ?? list.find((v) => /^zh/i.test(v.lang));
          if (zh) u.voice = zh;
          u.rate = pref ? (line.who === "dad" ? 0.95 : 1) : 0.98;
          u.pitch = pref ? 1 : line.who === "nian" ? 1.45 : 0.9;
          synthUtterRef.current = u;
          window.speechSynthesis.speak(u);
        } catch {
          // ignore
        }
      }
    },
    [sound, preloadUpcoming, playerId]
  );

  // 同页其他音频或跨标签页出声，或切到后台时自动暂停
  useEffect(() => {
    const quiet = () => {
      stopAudio();
      setPlaying(false);
    };
    const unsub = onAudioClaimed((owner) => {
      if (owner !== playerId && (activeLineRef.current || playing)) {
        quiet();
      }
    });
    const onHidden = () => {
      if (document.hidden && (activeLineRef.current || playing)) {
        quiet();
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      unsub();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [playerId, playing, stopAudio]);

  useEffect(() => {
    stopAudio();
    setTime(0);
    setPlaying(false);
    setNeedsTap(false);
    setPickedMarker(null);
    preloadedRef.current.clear();
    if (sound) preloadUpcoming(0);
  }, [story.id, sound, preloadUpcoming, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  useEffect(() => {
    if (!sound) stopAudio();
  }, [sound, stopAudio]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, maxFrameSeconds);
      last = now;
      setTime((cur) => {
        const active = activeLineRef.current;
        const player = audioRef.current;
        if (sound && active && player && !player.paused && !player.ended) {
          if (player.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return cur;
          return Math.min(active.start + player.currentTime, total);
        }
        return Math.min(cur + dt, total);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, sound, total]);

  useEffect(() => {
    if (!playing || !sound) return;
    const found = lineAtTime(lines, time);
    if (!found?.speaking) return;
    const cur = activeLineRef.current;
    if (!cur || cur.turn !== found.line.turn || cur.who !== found.line.who) {
      startLineAudio(found.line, time - found.line.start);
    }
  }, [time, playing, sound, lines, startLineAudio]);

  useEffect(() => {
    if (ended && playing) {
      setPlaying(false);
      stopAudio();
    }
  }, [ended, playing, stopAudio]);

  const spoken = sound ? lineAtTime(lines, time) : undefined;
  const activeTurn = spoken?.line.turn ?? scene?.turn ?? 0;
  const activeWho = playing && spoken?.speaking ? spoken.line.who : undefined;

  useEffect(() => {
    onTurn?.(activeTurn, activeWho);
  }, [activeTurn, activeWho, onTurn]);

  const seekTo = useCallback(
    (nextTime: number, autoPlay?: boolean) => {
      stopAudio();
      stopSpeaking(false);
      const clamped = Math.max(0, Math.min(total, nextTime));
      setTime(clamped);
      setPickedMarker(null);
      setNeedsTap(false);
      const shouldPlay = autoPlay ?? playing;
      if (autoPlay !== undefined) setPlaying(autoPlay);
      if (shouldPlay && sound) {
        const found = lineAtTime(lines, clamped);
        if (found?.speaking) startLineAudio(found.line, clamped - found.line.start);
        else preloadUpcoming(clamped);
      }
    },
    [stopAudio, total, playing, sound, lines, startLineAudio, preloadUpcoming]
  );

  useImperativeHandle(
    ref,
    () => ({
      playTurn(turn: number) {
        const line = lines.find((l) => l.turn === turn);
        if (line) {
          seekTo(Math.max(0, line.start - narrationGaps.lead), true);
          return;
        }
        const idx = scenes.findIndex((s) => s.turn === turn);
        if (idx >= 0) seekTo(starts[idx] + 0.01, true);
      }
    }),
    [lines, scenes, starts, seekTo]
  );

  function togglePlay() {
    if (playing) {
      stopAudio();
      setPlaying(false);
    } else {
      const startAt = ended ? 0 : time;
      seekTo(startAt, true);
    }
  }

  return (
    <div className="map-player">
      <div className="map-stage-frame">
        <GeoStageSvg
          camera={camera}
          localTime={local}
          sceneDuration={scene?.duration ?? 6}
          kind={scene?.kind ?? "map"}
          diagram={scene?.diagram}
          showChinaProvinces={scene?.showChinaProvinces}
          showTropics={scene?.showTropics}
          zones={scene?.zones}
          routes={scene?.routes}
          markers={scene?.markers}
          showModernBorders={showBorders}
          activeMarkerId={pickedMarker?.id ?? null}
          onSelectMarker={(m) => setPickedMarker((cur) => (cur?.id === m.id ? null : m))}
          myth={scene?.myth}
          sceneBadge={
            scene
              ? { number: index + 1, title: scene.title, badgeLabel: scene.badgeLabel }
              : undefined
          }
        />

        {pickedMarker && (
          <div className="map-marker-popover" role="status">
            <strong>
              {pickedMarker.icon ?? "📍"} {pickedMarker.label}
              {pickedMarker.place ? `（${pickedMarker.place}）` : ""}
            </strong>
            {pickedMarker.note && <p>{pickedMarker.note}</p>}
            <button
              type="button"
              className="map-popover-close"
              onClick={() => setPickedMarker(null)}
              aria-label="关闭地标提示"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {needsTap && (
        <p className="map-tap-hint" role="status">
          🔊 浏览器拦截了自动发声，点一下「▶ 播放地理动画」即可开启小念和爸爸配音
        </p>
      )}

      <div className="map-controls">
        <button type="button" className="primary-btn map-play-btn" onClick={togglePlay}>
          {playing ? "⏸ 暂停讲解" : ended ? "🔁 再看一遍" : "▶ 播放地理动画"}
        </button>

        <input
          type="range"
          className="map-scrubber"
          min={0}
          max={Math.max(1, total)}
          step={0.1}
          value={time}
          aria-label="动画进度条"
          onChange={(e) => seekTo(Number(e.target.value))}
        />

        <span className="map-time">
          {formatSec(time)} / {formatSec(total)}
        </span>

        {scene?.kind !== "diagram" && (
          <button
            type="button"
            className="pill-btn"
            aria-pressed={showBorders}
            onClick={() => setShowBorders((v) => !v)}
            title="叠加或隐藏国界线"
          >
            {showBorders ? "🗺️ 国界：开" : "🗺️ 国界：关"}
          </button>
        )}

        <button type="button" className="pill-btn" aria-pressed={sound} onClick={onToggleSound}>
          {sound ? "🔊 配音：开" : "🔇 配音：关"}
        </button>
      </div>

      <nav className="map-scene-pills" aria-label="分幕跳转">
        {scenes.map((sc, i) => (
          <button
            key={sc.turn}
            type="button"
            className={`pill-btn map-scene-pill${i === index ? " is-active" : ""}`}
            onClick={() => seekTo(starts[i] + 0.01, true)}
          >
            {sc.title}
          </button>
        ))}
      </nav>
    </div>
  );
});
