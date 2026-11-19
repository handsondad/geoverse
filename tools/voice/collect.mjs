import { CHINA_ATLAS_PRESET, STORY_QUIZ_WIN_CHEER, WORLD_ATLAS_PRESETS } from "../../src/data/atlas-presets.ts";
import { LAB_DIALOGUE, pinpointNianQuestion, QUIZ_WIN_LINES, quizStages } from "../../src/data/quiz.ts";
import { allStories } from "../../src/data/stories.ts";
import { geoTalks, geoWiki, hubChats, realmChats } from "../../src/data/talks.ts";

export async function collectVoiceLines() {
  const seen = new Map();
  const add = (who, raw) => {
    const text = String(raw ?? "").trim();
    if (!text) return;
    const key = `${who}|${text}`;
    if (!seen.has(key)) seen.set(key, { who, text });
  };

  for (const [n, d] of hubChats) {
    add("nian", n);
    add("dad", d);
  }
  for (const [n, d] of Object.values(realmChats)) {
    add("nian", n);
    add("dad", d);
  }
  for (const st of allStories) {
    for (const turn of st.dialogue) {
      add("nian", turn.nian);
      add("dad", turn.dad);
    }
    add("dad", st.quiz.explain);
  }
  add("nian", STORY_QUIZ_WIN_CHEER);

  for (const t of geoTalks) {
    for (const turn of t.turns) {
      add("nian", turn.nian);
      add("dad", turn.dad);
    }
    add("nian", t.wrap);
  }
  for (const w of geoWiki) {
    add("dad", `${w.place}的秘密：${w.title}。${w.story} ${w.familyTip}`);
  }
  for (const q of quizStages) {
    q.targets.forEach((tgt, idx) => {
      add("nian", pinpointNianQuestion(idx, tgt.name));
      add("dad", tgt.clue);
      add("dad", tgt.dadExplain);
    });
  }
  for (const lab of Object.values(LAB_DIALOGUE)) {
    add("nian", lab.nian);
    add("dad", lab.dad);
  }
  add("nian", QUIZ_WIN_LINES.labCheer);
  add("dad", QUIZ_WIN_LINES.labDad);
  add("nian", QUIZ_WIN_LINES.pinpointCheer);
  add("dad", QUIZ_WIN_LINES.pinpointDad);

  add("dad", CHINA_ATLAS_PRESET.dadNote);
  for (const preset of WORLD_ATLAS_PRESETS) {
    add("dad", preset.dadNote);
  }

  return [...seen.values()];
}
