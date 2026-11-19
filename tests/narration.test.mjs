import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { allStories } from "../src/data/stories.ts";
import { buildNarratedTimeline, estimateSeconds, lineAtTime, narrationGaps, sceneAtTime } from "../src/lib/narration.ts";
import { speakable } from "../tools/voice/voices.mjs";

const manifest = JSON.parse(fs.readFileSync(path.resolve("src/catalog/voice-manifest.json"), "utf8"));

test("buildNarratedTimeline 纯函数可脱离浏览器运行并正确对齐音频时长", () => {
  const sample = allStories[0];
  const tl = buildNarratedTimeline(sample, (who, text) => manifest.clips[`${who}|${text.trim()}`]?.seconds);

  assert.equal(tl.scenes.length, sample.scenes.length);
  assert.equal(tl.starts.length, sample.scenes.length);
  assert.equal(tl.lines.length, sample.dialogue.length * 2, "每轮小念和爸爸台词都应进入时间轴");
  assert.ok(tl.total > 20, "整集有声时长应大于 20 秒");

  // 每条台词按时间顺序排列且不重叠
  for (let i = 1; i < tl.lines.length; i++) {
    const prev = tl.lines[i - 1];
    const cur = tl.lines[i];
    assert.ok(prev.start + prev.seconds <= cur.start + 1e-6, `第 ${i} 句与前一句重叠`);
  }

  // 每幕时长不短于原始设计时长
  sample.scenes.forEach((sc, idx) => {
    assert.ok(tl.scenes[idx].duration >= sc.duration, `第 ${idx + 1} 幕时长被压缩`);
  });
});

test("sceneAtTime 与 lineAtTime 边界查询精确", () => {
  const sample = allStories[0];
  const tl = buildNarratedTimeline(sample, () => 2.0);
  const firstLine = tl.lines[0];

  assert.equal(lineAtTime(tl.lines, 0), undefined);
  assert.equal(lineAtTime(tl.lines, firstLine.start + 0.5)?.speaking, true);
  assert.equal(lineAtTime(tl.lines, firstLine.start + firstLine.seconds + 0.05)?.speaking, false);

  const midScene = sceneAtTime(tl.scenes, tl.starts, tl.starts[2] + 0.5);
  assert.equal(midScene.index, 2);
  assert.ok(midScene.progress > 0 && midScene.progress < 1);
  assert.ok(estimateSeconds("你好") >= 1.8);
  assert.ok(narrationGaps.lead > 0);
});

test("全站 24 集故事全部满足有声时间轴无重叠约束", () => {
  for (const st of allStories) {
    const tl = buildNarratedTimeline(st, (who, text) => manifest.clips[`${who}|${text.trim()}`]?.seconds);
    assert.equal(tl.lines.length, st.dialogue.length * 2, `${st.id} 台词条数不匹配`);
    for (let i = 1; i < tl.lines.length; i++) {
      assert.ok(
        tl.lines[i - 1].start + tl.lines[i - 1].seconds <= tl.lines[i].start + 1e-6,
        `${st.id} 音频时间重叠`
      );
    }
  }
});

test("speakable() 正确转换地理符号、经纬度与温度单位", () => {
  assert.equal(speakable("伦敦 51.5°N，冬天 5℃"), "伦敦 北纬51.5度，冬天 5摄氏度");
  assert.equal(speakable("哈尔滨 -18℃"), "哈尔滨 零下18摄氏度");
  assert.equal(speakable("吐鲁番 -154 米，年雨量 11872 mm"), "吐鲁番 负154 米，年雨量 11872毫米");
  assert.equal(speakable("海拔 1000~2000 米，水量 20.9万 m³/s"), "海拔 1000到2000 米，水量 20.9万立方米每秒");
  assert.equal(speakable("🌍 悉尼 33.9°S，距 6650 km"), "悉尼 南纬33.9度，距 6650公里");
});
