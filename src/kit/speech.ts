import { useSyncExternalStore } from "react";

export type Who = "nian" | "dad";
export type Line = { who: Who; text: string };
export type Pair = readonly [nian: string, dad: string];

export const nian = (text: string): Line => ({ who: "nian", text });
export const dad = (text: string): Line => ({ who: "dad", text });
export const pairLines = ([n, d]: Pair): Line[] => [nian(n), dad(d)];

type ClipEntry = { file: string; seconds: number };
const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "./";

/** 配音清单（约 40 KB gzip）单独成包、不挡首屏；页面一打开就开始取，需要时多半已经到了 */
let clips: Record<string, ClipEntry> | null = null;
export const voiceReady: Promise<void> = import("../catalog/voice-manifest.json")
  .then((mod) => {
    clips = (mod.default as { clips: Record<string, ClipEntry> }).clips;
  })
  .catch((error: unknown) => {
    console.warn("配音清单没能加载，改用浏览器朗读。", error);
    clips = {};
  });

export const clipOf = (who: Who, text: string): ClipEntry | undefined => clips?.[`${who}|${text.trim()}`];
export const hasClip = (who: Who, text: string): boolean => Boolean(clipOf(who, text));
export const clipUrl = (who: Who, text: string): string | undefined => {
  const clip = clipOf(who, text);
  return clip ? `${base}voice/${clip.file}.mp3` : undefined;
};

/** 同一时间只让一个播放器或气泡出声（涵盖同页组件与跨标签页） */
const SPEECH_OWNER = "geoverse-speech-kit";
const otherTabs = typeof BroadcastChannel === "undefined" ? undefined : new BroadcastChannel("geoverse-audio");
const claimListeners = new Set<(owner: string) => void>();

export function claimAudioChannel(owner: string) {
  otherTabs?.postMessage(owner);
  for (const listener of claimListeners) listener(owner);
}

export function onAudioClaimed(listener: (owner: string) => void): () => void {
  claimListeners.add(listener);
  return () => claimListeners.delete(listener);
}

otherTabs?.addEventListener("message", () => {
  stopSpeaking(false);
  for (const listener of claimListeners) listener("__other_tab__");
});

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSpeaking(false);
  });
}

const canSynth = () => typeof window !== "undefined" && "speechSynthesis" in window;

function synth(who: Who, text: string, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (!canSynth() || token !== run) return resolve();
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      const list = window.speechSynthesis.getVoices();
      const preferred =
        who === "nian"
          ? list.find((v) => /Yunxia/i.test(v.name))
          : list.find((v) => /Yunxi(?!a)/i.test(v.name));
      const zhVoice =
        preferred ??
        list.find((item) => /^zh[-_]CN/i.test(item.lang)) ??
        list.find((item) => /^zh/i.test(item.lang));
      if (zhVoice) utterance.voice = zhVoice;
      utterance.rate = preferred ? (who === "dad" ? 0.95 : 1) : 0.98;
      utterance.pitch = preferred ? 1 : who === "nian" ? 1.45 : 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

let audio: HTMLAudioElement | null = null;
/** 下一句的音频提前下载，一句接一句不卡顿 */
let upcoming: HTMLAudioElement | null = null;
let run = 0;
let speaking: Line | null = null;
const listeners = new Set<() => void>();

function setSpeaking(line: Line | null) {
  speaking = line;
  listeners.forEach((listener) => listener());
}

function preload(line: Line | undefined) {
  const url = line && clipUrl(line.who, line.text);
  if (!url || typeof Audio === "undefined") return;
  upcoming ??= new Audio();
  if (upcoming.dataset.src === url) return;
  upcoming.dataset.src = url;
  upcoming.preload = "auto";
  upcoming.src = url;
}

/** 播完（或被换掉）返回 true；浏览器拦下自动播放时返回 false，整段就此停下，不再一句句空跳 */
function play(who: Who, rawText: string, token: number): Promise<boolean> {
  const text = rawText.trim();
  const clip = clips?.[`${who}|${text}`];
  if (!clip) return synth(who, text, token).then(() => true);
  return new Promise((resolve) => {
    if (token !== run) return resolve(true);
    audio = new Audio(`${base}voice/${clip.file}.mp3`);
    audio.onended = () => resolve(true);
    audio.onerror = () => synth(who, text, token).then(() => resolve(true));
    audio.onpause = () => resolve(true);
    audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "NotAllowedError") resolve(false);
    });
  });
}

export async function say(...lines: Line[]) {
  stopSpeaking(false);
  claimAudioChannel(SPEECH_OWNER);
  const token = run;
  if (!clips) await voiceReady;
  for (const [index, line] of lines.entries()) {
    if (token !== run) return;
    setSpeaking(line);
    const playing = play(line.who, line.text, token);
    preload(lines[index + 1]);
    if (!(await playing)) break;
  }
  if (token === run) setSpeaking(null);
}

export function stopSpeaking(broadcast = false) {
  run += 1;
  if (audio) {
    audio.pause();
    audio = null;
  }
  if (canSynth()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  if (speaking) setSpeaking(null);
  if (broadcast) claimAudioChannel("__stop__");
}

onAudioClaimed((owner) => {
  if (owner !== SPEECH_OWNER) stopSpeaking(false);
});

export function useSpeaking(): Line | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => speaking,
    () => null
  );
}

export const isSpeaking = (line: Line | null, who: Who, text: string) =>
  line?.who === who && line.text === text;
