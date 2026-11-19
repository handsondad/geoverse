import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { chinaGeo, worldData } from "../src/data/geo/index.ts";
import { quizStages } from "../src/data/quiz.ts";
import { realms } from "../src/data/realms.ts";
import { allStories, storiesIn } from "../src/data/stories.ts";
import { geoTalks, geoWiki } from "../src/data/talks.ts";
import { buildRoutePoints, haversineKm, project, samplePolyline, unproject } from "../src/lib/geo.ts";
import { checkAllRules } from "../tools/check-rules.mjs";
import { collectVoiceLines } from "../tools/voice/collect.mjs";
import { clipHash } from "../tools/voice/voices.mjs";

test("地理数据集：世界陆地、现代国界与中外交汇河流完整加载", () => {
  assert.ok(worldData.land.length > 100, "应包含 100+ 陆地多边形");
  assert.ok(worldData.borders.length > 50, "应包含国界线段");
  assert.ok(chinaGeo.provinces.length >= 30, "应包含中国现代省界");
  assert.ok(chinaGeo.rivers.length >= 20, "应包含长江、黄河与世界大河");
});

test("六大地球探索展厅均包含至少 3 集互动地理故事与百科/问答", () => {
  assert.equal(realms.length, 6);
  for (const realm of realms) {
    const list = storiesIn(realm.id);
    assert.ok(list.length >= 3, `${realm.title} 至少包含 3 集故事`);
    assert.ok(
      geoWiki.some((w) => w.realm === realm.id),
      `${realm.title} 应包含百宝箱条目`
    );
    assert.ok(
      geoTalks.some((t) => t.realm === realm.id),
      `${realm.title} 应包含小念问爸爸条目`
    );
  }
});

test("25 集故事的分镜、坐标、剖面动画、参考来源与测验均合法", () => {
  assert.equal(allStories.length, 25);
  const ids = new Set();
  for (const st of allStories) {
    assert.ok(!ids.has(st.id), `重复的故事 id: ${st.id}`);
    ids.add(st.id);
    assert.ok(st.dialogue.length >= 5, `${st.id} 至少 5 轮对话`);
    assert.ok(st.scenes.length >= 5, `${st.id} 至少 5 个地理分镜`);
    assert.ok(
      st.quiz.answerIndex >= 0 && st.quiz.answerIndex < st.quiz.options.length,
      `${st.id} quiz answerIndex 越界`
    );
    for (const src of st.sources ?? []) {
      assert.ok(src.title.length > 0 && /^https:\/\//.test(src.url), `${st.id} 参考来源链接必须为 https: ${src.url}`);
    }
    for (const sc of st.scenes) {
      assert.ok(sc.turn >= 0 && sc.turn < st.dialogue.length, `${st.id} scene turn 越界`);
      if (sc.kind === "diagram") assert.ok(sc.diagram, `${st.id} 缺少 diagram id`);
      for (const m of sc.markers ?? []) {
        assert.ok(m.coord[0] >= -180 && m.coord[0] <= 180, `${st.id} marker lon 越界`);
        assert.ok(m.coord[1] >= -90 && m.coord[1] <= 90, `${st.id} marker lat 越界`);
      }
    }
  }
});

test("地理投影与距离计算纯函数精确可逆", () => {
  const cam = { center: [108.94, 34.26], lonSpan: 30 };
  const [px, py] = project([108.94, 34.26], cam);
  assert.equal(px, 400);
  assert.equal(py, 280);
  const [lon, lat] = unproject(px, py, cam);
  assert.ok(Math.abs(lon - 108.94) < 1e-6);
  assert.ok(Math.abs(lat - 34.26) < 1e-6);

  const km = haversineKm([86.92, 27.99], [116.4, 39.9]);
  assert.ok(km > 2500 && km < 3400, `珠峰至北京距离应约 2900km，实测 ${km}`);

  const pts = buildRoutePoints([[86.92, 27.99], [121.47, 31.23]], cam);
  const sampled = samplePolyline(pts, 0.5);
  assert.ok(sampled.partialPath.startsWith("M"));
  assert.ok(sampled.fullPath.length > sampled.partialPath.length);
});

test("经纬寻宝挑战 5 关 20 题数据有效", () => {
  assert.equal(quizStages.length, 5);
  for (const stage of quizStages) {
    assert.ok(stage.targets.length >= 4);
    for (const tgt of stage.targets) {
      assert.ok(tgt.perfectKm < tgt.okKm);
      assert.ok(tgt.coord[0] >= -180 && tgt.coord[0] <= 180);
    }
  }
});

test("仓库规则守卫全部通过", () => {
  const { errors } = checkAllRules();
  assert.deepEqual(errors, []);
});

test("配音清单全覆盖：全站所有小念与爸爸台词均已生成 edge-tts 音频且无缺失", async () => {
  const manifestPath = path.resolve("src/catalog/voice-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.voices.nian.voice, "zh-CN-YunxiaNeural");
  assert.equal(manifest.voices.dad.voice, "zh-CN-YunxiNeural");
  assert.equal(manifest.voices.dad.rate, "-5%");

  const required = await collectVoiceLines();
  for (const { who, text } of required) {
    const key = `${who}|${text}`;
    const clip = manifest.clips[key];
    assert.ok(clip, `缺少预生成配音（将回退浏览器语音！）: ${key}`);
    assert.equal(clip.file, `${who}/${clipHash(who, text)}`, `配音已过期，请重跑 npm run voice: ${key}`);
    assert.ok(clip.seconds > 0, `${key} 时长无效`);
    const file = path.resolve("public/voice", `${clip.file}.mp3`);
    assert.ok(fs.existsSync(file), `缺失配音文件: ${file}`);
  }
});
