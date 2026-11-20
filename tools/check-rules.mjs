#!/usr/bin/env node
/**
 * 地理奇遇记 · 仓库规则与内容一致性守卫
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { quizStages } from "../src/data/quiz.ts";
import { realms } from "../src/data/realms.ts";
import { allStories, storiesIn } from "../src/data/stories.ts";
import { geoTalks, geoWiki } from "../src/data/talks.ts";
import { project, STAGE_H, STAGE_W } from "../src/lib/geo.ts";
import { renderStoryIndex, STORY_INDEX_PATH } from "./story-index.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "src");
const FORBIDDEN_SCOLDING = /笨蛋|蠢货|废物|真笨|白痴/;
const OBVIOUS_TYPO = /一一条|一个个个/;

function walkFiles(dir, predicate = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

export function checkAllRules() {
  const errors = [];

  const srcFiles = walkFiles(SRC_DIR, (f) => /\.(ts|tsx)$/.test(f));
  const importRe = /(?:from\s+|import\s*\(\s*)["'](\.[^"']+)["']/g;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(importRe)) {
      const spec = match[1];
      if (!/\.(ts|tsx|css|json)$/.test(spec)) {
        errors.push(`[导入后缀] ${rel(file)} 中的相对导入 "${spec}" 必须显式写明 .ts / .tsx / .json 后缀`);
        continue;
      }
      const resolved = path.resolve(path.dirname(file), spec);
      if (!fs.existsSync(resolved)) {
        errors.push(`[导入缺失] ${rel(file)} 导入了不存在的文件 "${spec}"`);
      }
    }
    if (FORBIDDEN_SCOLDING.test(content)) {
      errors.push(`[口吻守卫] ${rel(file)} 存在不适合儿童科普的贬损词汇`);
    }
    if (OBVIOUS_TYPO.test(content)) {
      errors.push(`[笔误守卫] ${rel(file)} 存在疑似叠字笔误 (${content.match(OBVIOUS_TYPO)[0]})`);
    }
  }

  const storyIds = new Set();
  for (const realm of realms) {
    const list = storiesIn(realm.id);
    if (list.length < 3) {
      errors.push(`[展厅覆盖] ${realm.title} (${realm.id}) 至少需要 3 集故事，当前 ${list.length}`);
    }
    if (!geoWiki.some((w) => w.realm === realm.id)) {
      errors.push(`[百宝箱缺失] ${realm.title} 至少需要 1 张百宝箱卡片`);
    }
    if (!geoTalks.some((t) => t.realm === realm.id)) {
      errors.push(`[问答缺失] ${realm.title} 至少需要 1 组「小念问爸爸」问答`);
    }
  }

  for (const st of allStories) {
    if (storyIds.has(st.id)) errors.push(`[重复ID] 故事 id "${st.id}" 重复`);
    storyIds.add(st.id);
    if (st.dialogue.length < 5) errors.push(`[对话长度] ${st.id} 对话轮次不足 5 轮`);
    if (st.scenes.length < 5) errors.push(`[分镜数量] ${st.id} 地理分镜不足 5 幕`);
    if (st.quiz.answerIndex < 0 || st.quiz.answerIndex >= st.quiz.options.length) {
      errors.push(`[测验答案] ${st.id} quiz.answerIndex 越界`);
    }
    if (!st.sources || st.sources.length === 0) {
      errors.push(`[参考来源] ${st.id} 必须提供至少 1 条权威参考来源 (sources)`);
    } else {
      for (const src of st.sources) {
        if (!src.title?.trim() || !/^https?:\/\//.test(src.url || "")) {
          errors.push(`[参考来源] ${st.id} 存在不合法的来源条目 (${src.title ?? "无标题"})`);
        }
      }
    }
    for (const sc of st.scenes) {
      if (sc.turn < 0 || sc.turn >= st.dialogue.length) {
        errors.push(`[分镜对齐] ${st.id} 场次 "${sc.title}" 引用了不存在的 turn=${sc.turn}`);
      }
      if (sc.kind === "diagram" && !sc.diagram) {
        errors.push(`[剖面动画] ${st.id} 场次 "${sc.title}" 标记为 diagram 但未指定 diagram id`);
      }
    }
  }

  for (const stage of quizStages) {
    for (const tgt of stage.targets) {
      const [px, py] = project(tgt.coord, stage.camera);
      if (px < 30 || px > STAGE_W - 30 || py < 56 || py > STAGE_H - 30) {
        errors.push(
          `[寻宝视口] ${stage.id}/${tgt.id}（${tgt.name}）投影坐标 [${px.toFixed(1)}, ${py.toFixed(1)}] 超出安全点击区`
        );
      }
    }
  }

  for (const w of geoWiki) {
    if (!storyIds.has(w.relatedStoryId)) {
      errors.push(`[百宝箱关联] ${w.id} 指向了不存在的 relatedStoryId "${w.relatedStoryId}"`);
    }
    if (!w.familyTip.startsWith("🏠 亲子小探秘：")) {
      errors.push(`[百宝箱格式] ${w.id} 的 familyTip 须以 "🏠 亲子小探秘：" 开头`);
    }
  }

  const skillSourceRoot = path.join(ROOT, "skills");
  if (fs.existsSync(skillSourceRoot)) {
    const sourceFiles = walkFiles(skillSourceRoot);
    for (const srcFile of sourceFiles) {
      const subRel = path.relative(skillSourceRoot, srcFile);
      const srcContent = fs.readFileSync(srcFile, "utf8").replace(/\r\n/g, "\n");
      for (const mirrorDir of [".agents/skills", ".cursor/skills"]) {
        const mirrorFile = path.join(ROOT, mirrorDir, subRel);
        if (!fs.existsSync(mirrorFile)) {
          errors.push(`[Skill镜像缺失] 缺少 ${rel(mirrorFile)}（请运行 npm run skills:sync）`);
        } else {
          const mirrorContent = fs.readFileSync(mirrorFile, "utf8").replace(/\r\n/g, "\n");
          if (mirrorContent !== srcContent) {
            errors.push(`[Skill镜像不一致] ${rel(mirrorFile)} 与 skills/ 源文件不一致（请运行 npm run skills:sync）`);
          }
        }
      }
    }
  }

  const indexOnDisk = fs.existsSync(STORY_INDEX_PATH)
    ? fs.readFileSync(STORY_INDEX_PATH, "utf8").replace(/\r\n/g, "\n")
    : "";
  if (indexOnDisk !== renderStoryIndex()) {
    errors.push(`[故事索引过期] ${rel(STORY_INDEX_PATH)} 与故事内容不一致（请运行 npm run story:index）`);
  }

  return {
    errors,
    stats: {
      realms: realms.length,
      stories: allStories.length,
      wiki: geoWiki.length,
      talks: geoTalks.length,
      pinpointStages: quizStages.length
    }
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const quiet = process.argv.includes("--quiet");
  const { errors, stats } = checkAllRules();
  if (!quiet) {
    console.log(
      `🌍 全馆盘点：${stats.realms} 大地球展厅 | ${stats.stories} 集地理动画 | ${stats.wiki} 篇百宝箱 | ${stats.talks} 组父子问答 | ${stats.pinpointStages} 关经纬寻宝`
    );
  }
  if (errors.length > 0) {
    console.error(`\n❌ 发现 ${errors.length} 项规则违规：`);
    for (const e of errors) console.error(`  • ${e}`);
    process.exit(1);
  }
  if (!quiet) console.log("✅ 全部仓库规则校验通过！");
}
