import { useEffect, useState } from "react";
import { GeoStageSvg } from "../components/GeoStageSvg.tsx";
import { CHINA_ATLAS_PRESET, WORLD_ATLAS_PRESETS } from "../data/atlas-presets.ts";
import type { GeoMarker } from "../data/types.ts";
import { DadSays, TopBar, type Settings } from "../kit/Chrome.tsx";
import { formatCoord, type CameraView } from "../lib/geo.ts";
import { stopSpeaking } from "../kit/speech.ts";

export function AtlasSandboxPage({ settings }: { settings: Settings }) {
  const [scope, setScope] = useState<"world" | "china">("world");
  const [presetIdx, setPresetIdx] = useState(0);
  const [showBorders, setShowBorders] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showTropics, setShowTropics] = useState(true);
  const [camera, setCamera] = useState<CameraView>(WORLD_ATLAS_PRESETS[0].camera);
  const [picked, setPicked] = useState<GeoMarker | null>(null);
  const [animTime, setAnimTime] = useState(0);

  const activePreset = scope === "world" ? WORLD_ATLAS_PRESETS[presetIdx] : CHINA_ATLAS_PRESET;

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setAnimTime(7.8);
      return;
    }
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setAnimTime((t) => (t + 0.12) % 8);
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  function switchScope(next: "world" | "china") {
    stopSpeaking();
    setScope(next);
    setPicked(null);
    setCamera(next === "world" ? WORLD_ATLAS_PRESETS[presetIdx].camera : CHINA_ATLAS_PRESET.camera);
  }

  function selectWorldPreset(idx: number) {
    stopSpeaking();
    setPresetIdx(idx);
    setPicked(null);
    setCamera(WORLD_ATLAS_PRESETS[idx].camera);
  }

  function zoomBy(factor: number) {
    setCamera((c) => ({
      ...c,
      lonSpan: Math.max(12, Math.min(260, c.lonSpan * factor))
    }));
  }

  function panBy(dLon: number, dLat: number) {
    setCamera((c) => ({
      ...c,
      center: [
        Math.max(-175, Math.min(175, c.center[0] + dLon * (c.lonSpan / 35))),
        Math.max(-50, Math.min(70, c.center[1] + dLat * (c.lonSpan / 45)))
      ]
    }));
  }

  return (
    <div className="page atlas-page">
      <TopBar
        emoji="🌍"
        title="自由地球大地图沙盘"
        backLabel="地球馆首页"
        onBack={() => {
          stopSpeaking();
          window.location.hash = "#/";
        }}
        settings={settings}
      />

      <div className="atlas-mode-tabs">
        <button
          type="button"
          className={`pill-btn${scope === "world" ? " is-active" : ""}`}
          onClick={() => switchScope("world")}
        >
          🌐 世界自然地理与海洋图鉴
        </button>
        <button
          type="button"
          className={`pill-btn${scope === "china" ? " is-active" : ""}`}
          onClick={() => switchScope("china")}
        >
          🐉 中国三级阶梯与山川大河
        </button>
      </div>

      <div className="atlas-layout">
        <div className="atlas-map-col">
          <div className="map-stage-frame">
            <GeoStageSvg
              camera={camera}
              localTime={animTime}
              sceneDuration={8}
              showChinaProvinces={scope === "china"}
              showTropics={scope === "world" && showTropics && Boolean(activePreset.showTropics)}
              zones={activePreset.zones}
              routes={activePreset.routes}
              markers={activePreset.markers}
              showModernBorders={showBorders}
              showRivers={showRivers}
              activeMarkerId={picked?.id ?? null}
              onSelectMarker={(m) => setPicked((cur) => (cur?.id === m.id ? null : m))}
              sceneBadge={{
                number: scope === "world" ? presetIdx + 1 : 1,
                title: activePreset.label.replace(/^[^\s]+\s/, ""),
                badgeLabel: activePreset.badgeLabel
              }}
            />

            <div className="atlas-cam-pad" aria-label="地图移动与缩放">
              <button type="button" className="pill-btn" onClick={() => zoomBy(0.75)} title="放大">
                ＋
              </button>
              <button type="button" className="pill-btn" onClick={() => zoomBy(1.33)} title="缩小">
                －
              </button>
              <button type="button" className="pill-btn" onClick={() => panBy(-5, 0)} title="往西看">
                ◀
              </button>
              <button type="button" className="pill-btn" onClick={() => panBy(5, 0)} title="往东看">
                ▶
              </button>
              <button type="button" className="pill-btn" onClick={() => panBy(0, 4)} title="往北看">
                ▲
              </button>
              <button type="button" className="pill-btn" onClick={() => panBy(0, -4)} title="往南看">
                ▼
              </button>
            </div>

            {picked && (
              <div className="map-marker-popover" role="status">
                <strong>
                  {picked.icon ?? "📍"} {picked.label}
                  {picked.place ? `（${picked.place}）` : ""} · {formatCoord(picked.coord)}
                </strong>
                {picked.note && <p>{picked.note}</p>}
                <button
                  type="button"
                  className="map-popover-close"
                  onClick={() => setPicked(null)}
                  aria-label="关闭地标小卡片"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {scope === "world" && (
            <div className="atlas-timeline card">
              <div className="atlas-timeline-head">
                <strong>🗺️ 切换世界主题图层</strong>
                <span>点击任意图钉查看经纬坐标与奇观档案</span>
              </div>
              <div className="atlas-snap-chips">
                {WORLD_ATLAS_PRESETS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`pill-btn${idx === presetIdx ? " is-active" : ""}`}
                    onClick={() => selectWorldPreset(idx)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="atlas-side-col">
          <div className="card">
            <h3>🎛️ 图层开关</h3>
            <div className="atlas-toggles">
              <button
                type="button"
                className="pill-btn"
                aria-pressed={showBorders}
                onClick={() => setShowBorders((v) => !v)}
              >
                {showBorders ? "✅ 现代国界线" : "⬜ 现代国界线"}
              </button>
              <button
                type="button"
                className="pill-btn"
                aria-pressed={showRivers}
                onClick={() => setShowRivers((v) => !v)}
              >
                {showRivers ? "✅ 世界与神州大河" : "⬜ 世界与神州大河"}
              </button>
              {scope === "world" && (
                <button
                  type="button"
                  className="pill-btn"
                  aria-pressed={showTropics}
                  onClick={() => setShowTropics((v) => !v)}
                >
                  {showTropics ? "✅ 赤道·回归线·极圈" : "⬜ 赤道·回归线·极圈"}
                </button>
              )}
            </div>

            <h4 className="atlas-sub-h">📌 快捷跳到奇观地标</h4>
            <div className="atlas-journey-list">
              {activePreset.markers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`pill-btn${picked?.id === m.id ? " is-active" : ""}`}
                  onClick={() => {
                    setPicked(m);
                    setCamera({
                      center: m.coord,
                      lonSpan: scope === "china" ? 28 : 65
                    });
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <DadSays text={activePreset.dadNote} />
        </aside>
      </div>
    </div>
  );
}
