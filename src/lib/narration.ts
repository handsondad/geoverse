import type { GeoScene, GeoStory } from "../data/types.ts";

export type Speaker = "nian" | "dad";
export type ClipLengthLookup = (who: Speaker, text: string) => number | undefined;

export type SpokenLine = {
  turn: number;
  who: Speaker;
  text: string;
  start: number;
  seconds: number;
};

export type NarratedTimeline = {
  scenes: GeoScene[];
  starts: number[];
  total: number;
  lines: SpokenLine[];
};

export const narrationGaps = {
  lead: 0.25,
  between: 0.3,
  tail: 0.45
};

export function estimateSeconds(text: string): number {
  const clean = text.replace(/[\s，。！？；：、“”‘’（）()]/g, "");
  return Math.max(1.8, clean.length * 0.22);
}

/**
 * 纯函数：按每轮问答的配音时长构建音画同步时间轴（不依赖浏览器或 Vite 环境，便于单测）。
 * 若未提供 lengthOf 或某句缺配音，自动回退按字数估算的时长。
 */
export function buildNarratedTimeline(
  story: GeoStory,
  lengthOf?: ClipLengthLookup
): NarratedTimeline {
  const scenes: GeoScene[] = [];
  const starts: number[] = [];
  const lines: SpokenLine[] = [];
  let cursor = 0;

  const durationOf = (who: Speaker, text: string): number => {
    const sec = lengthOf?.(who, text);
    return typeof sec === "number" && Number.isFinite(sec) && sec > 0
      ? sec
      : estimateSeconds(text);
  };

  for (let i = 0; i < story.scenes.length; i++) {
    const baseScene = story.scenes[i];
    const turn = story.dialogue[baseScene.turn];
    starts.push(cursor);

    let spokenSpan = 0;
    if (turn) {
      let tLocal = cursor + narrationGaps.lead;
      const pairs: [Speaker, string][] = [
        ["nian", turn.nian],
        ["dad", turn.dad]
      ];
      for (const [who, text] of pairs) {
        const sec = durationOf(who, text);
        lines.push({ turn: baseScene.turn, who, text, start: tLocal, seconds: sec });
        tLocal += sec + narrationGaps.between;
      }
      spokenSpan = tLocal - cursor - narrationGaps.between + narrationGaps.tail;
    }

    const duration = Math.max(baseScene.duration, spokenSpan);
    scenes.push({ ...baseScene, duration });
    cursor += duration;
  }

  const coveredTurns = new Set(story.scenes.map((s) => s.turn));
  for (let ti = 0; ti < story.dialogue.length; ti++) {
    if (coveredTurns.has(ti)) continue;
    const turn = story.dialogue[ti];
    let tLocal = cursor + narrationGaps.lead;
    for (const [who, text] of [
      ["nian", turn.nian] as const,
      ["dad", turn.dad] as const
    ]) {
      const sec = durationOf(who, text);
      lines.push({ turn: ti, who, text, start: tLocal, seconds: sec });
      tLocal += sec + narrationGaps.between;
    }
    const extra = tLocal - cursor - narrationGaps.between + narrationGaps.tail;
    if (scenes.length > 0) {
      scenes[scenes.length - 1] = {
        ...scenes[scenes.length - 1],
        duration: scenes[scenes.length - 1].duration + extra
      };
    }
    cursor += extra;
  }

  return { scenes, starts, total: cursor, lines };
}

export function sceneAtTime(scenes: readonly GeoScene[], starts: readonly number[], time: number) {
  if (scenes.length === 0) return { index: 0, local: 0, progress: 0 };
  for (let i = scenes.length - 1; i >= 0; i--) {
    if (time >= starts[i]) {
      const local = Math.max(0, Math.min(scenes[i].duration, time - starts[i]));
      const progress = scenes[i].duration > 0 ? local / scenes[i].duration : 1;
      return { index: i, local, progress };
    }
  }
  return { index: 0, local: 0, progress: 0 };
}

export function lineAtTime(
  lines: readonly SpokenLine[],
  time: number
): { line: SpokenLine; speaking: boolean } | undefined {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (time >= line.start) {
      return { line, speaking: time <= line.start + line.seconds };
    }
  }
  return undefined;
}
