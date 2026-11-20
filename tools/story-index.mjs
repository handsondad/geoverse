#!/usr/bin/env node
/**
 * 生成首页与路由用的轻量故事索引 src/data/story-index.json。
 * 首屏只读这份索引（几 KB），完整的对白与动画分镜在进入故事 / 展厅 / 搜索时才按需加载。
 * 改了任何故事的 id、标题、副标题、徽章、标签或展厅后运行：npm run story:index
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allStories } from "../src/data/stories.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const STORY_INDEX_PATH = path.join(ROOT, "src", "data", "story-index.json");

export function buildStoryIndex() {
  return allStories.map(({ id, realm, title, subtitle, badge, tags }) => ({ id, realm, title, subtitle, badge, tags }));
}

export function renderStoryIndex() {
  return `${JSON.stringify(buildStoryIndex(), null, 2)}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(STORY_INDEX_PATH, renderStoryIndex(), "utf8");
  console.log(`已写入 ${path.relative(ROOT, STORY_INDEX_PATH)}（${allStories.length} 集）`);
}
