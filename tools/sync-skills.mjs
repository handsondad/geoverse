#!/usr/bin/env node
/**
 * 把 skills/ 下的每个 skill 原样同步到 .agents/skills/ 和 .cursor/skills/
 * 用法：npm run skills:sync
 * 只改 skills/ 下的源目录；tools/check-rules.mjs 会检查三处是否完全一致。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "skills");
const mirrors = [".agents/skills", ".cursor/skills"];

const skills = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const mirror of mirrors) {
  mkdirSync(join(root, mirror), { recursive: true });
  for (const skill of skills) {
    const target = join(root, mirror, skill);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
    cpSync(join(source, skill), target, { recursive: true });
  }
  console.log(`已同步 ${skills.join("、")} → ${mirror}/`);
}
