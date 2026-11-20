#!/usr/bin/env node
/**
 * 地理奇遇记 · 新地理动画故事脚手架（给 AI Agent 与开发者）
 *
 * 用法：
 *   npm run story:new                                             # 查看全部 6 个地球展厅与示例
 *   npm run story:new -- <realm> <id> "<中文标题>" [emoji]        # 预览 GeoStory 模板
 *   npm run story:new -- <realm> <id> "<中文标题>" [emoji] --write
 *       # 生成 src/data/stories/<id>.ts 并提示如何挂载到 src/data/stories.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { realms } from "../src/data/realms.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function toIdent(id) {
  return `${id.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase())}Story`;
}

function printHelp() {
  console.log("🌍 地理奇遇记故事脚手架 (tools/new-story.mjs)\n");
  console.log("用法：");
  console.log('  npm run story:new -- <realm> <id> "<中文标题>" [emoji] [--write]\n');
  console.log("可选的 6 大地球展厅 (<realm>)：");
  for (const r of realms) {
    console.log(`  • ${r.id.padEnd(11)} ${r.emoji} ${r.title} (${r.subtitle})`);
  }
  console.log("\n示例：");
  console.log('  npm run story:new -- oceans great-barrier-reef "为什么澳大利亚东边长出一道两千多公里的珊瑚长城？" "🪸"');
  console.log('  npm run story:new -- oceans great-barrier-reef "为什么澳大利亚东边长出一道两千多公里的珊瑚长城？" "🪸" --write');
}

function renderStoryTemplate({ id, realm, title, emoji, ident }) {
  return `import type { GeoStory } from "../types.ts";

export const ${ident}: GeoStory = {
  id: "${id}",
  realm: "${realm}",
  emoji: "${emoji}",
  title: "${title}",
  subtitle: "TODO(agent): 用一句副标题点明地理现象、成因与看点",
  badge: "TODO(agent): 6字内卡片徽章",
  trigger: "TODO(agent): 小念在生活或看地球仪时发现的奇怪现象……",
  difficulty: "explorer",
  tags: ["标签一", "标签二", "标签三"],
  dialogue: [
    {
      nian: "爸爸，TODO(agent): 小念充满好奇的第一句提问？",
      dad: "TODO(agent): 爸爸先打一个生活中的比方，再引出地图上的位置或地理原因。",
      steps: [
        { icon: "🧭", label: "观察起点" },
        { icon: "🌬️", label: "关键动力" },
        { icon: "🎯", label: "地理结果" }
      ]
    },
    {
      nian: "TODO(agent): 接着爸爸刚才的话继续追问？",
      dad: "TODO(agent): 讲清地形、海流、气压或板块的下一步变化。"
    },
    {
      nian: "TODO(agent): 第三轮深入追问为什么？",
      dad: "TODO(agent): 点破反直觉的科学或地理细节。",
      factBadge: {
        icon: "🌍",
        title: "地球小知识卡",
        detail: "TODO(agent): 补充一个可核查的真实地理数值或现象。"
      }
    },
    {
      nian: "TODO(agent): 第四轮追问这对人或世界有什么影响？",
      dad: "TODO(agent): 连回气候带、城市分布或自然奇观。"
    },
    {
      nian: "我懂啦！TODO(agent): 小念用自己的话把因果链串一遍！",
      dad: "TODO(agent): 爸爸夸赞并总结全局视野。"
    }
  ],
  scenes: [
    {
      turn: 0,
      title: "1 · 发现奇观",
      badgeLabel: "第一幕",
      duration: 7,
      camera: { center: [105, 34], lonSpan: 70 },
      markers: [
        { id: "start", label: "核心地标", coord: [105, 34], icon: "${emoji}", align: "t" }
      ]
    },
    {
      turn: 1,
      title: "2 · 地球动力",
      badgeLabel: "第二幕",
      duration: 7,
      camera: { center: [105, 34], lonSpan: 60 },
      routes: [
        { id: "rt-1", label: "运动轨迹", color: "#4d96ff", waypoints: [[95, 30], [115, 35]], traveler: "💨", startAt: 0.1, endAt: 0.9 }
      ],
      markers: [
        { id: "stop2", label: "关键地点", coord: [115, 35], icon: "📍", align: "t" }
      ]
    },
    {
      turn: 2,
      title: "3 · 破除误会",
      badgeLabel: "第三幕",
      duration: 7,
      camera: { center: [105, 34], lonSpan: 55 },
      myth: {
        wrong: "常见误解：……",
        right: "其实真相：……"
      },
      markers: [
        { id: "stop3", label: "关键剖面", coord: [105, 34], icon: "✨", align: "b" }
      ]
    },
    {
      turn: 3,
      title: "4 · 改变家园",
      badgeLabel: "第四幕",
      duration: 7,
      camera: { center: [105, 34], lonSpan: 80 },
      markers: [
        { id: "stop4", label: "影响区域", coord: [105, 34], icon: "🌿", align: "t" }
      ]
    },
    {
      turn: 4,
      title: "5 · 全球视野",
      badgeLabel: "第五幕",
      duration: 6,
      camera: { center: [105, 34], lonSpan: 110 },
      markers: [
        { id: "final", label: "地球全景", coord: [105, 34], icon: "🌟", align: "t" }
      ]
    }
  ],
  quiz: {
    prompt: "TODO(agent): 设计一道紧扣地理因果的三选一巩固题？",
    options: ["正确答案", "干扰选项 A", "干扰选项 B"],
    answerIndex: 0,
    explain: "TODO(agent): 一句话讲明为什么选它。"
  },
  parentTip: "TODO(agent): 给爸妈的亲子观察或地球仪延伸提示。",
  sources: [
    { title: "NOAA / USGS / NASA 等权威来源标题", url: "https://www.noaa.gov/" }
  ]
};
`;
}

const args = process.argv.slice(2);
const write = args.includes("--write");
const pos = args.filter((a) => !a.startsWith("--"));
const [realm, id, title, emoji = "🌍"] = pos;

if (!realm || !id || !title) {
  printHelp();
  process.exit(0);
}

if (!realms.some((r) => r.id === realm)) {
  console.error(`❌ 未知展厅 "${realm}"，可用值：${realms.map((r) => r.id).join(", ")}`);
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(id)) {
  console.error("❌ 故事 id 只能使用小写字母、数字和连字符（kebab-case）。");
  process.exit(1);
}

const ident = toIdent(id);
const code = renderStoryTemplate({ id, realm, title, emoji, ident });
const targetFile = path.join(ROOT, "src", "data", "stories", `${id}.ts`);

if (!write) {
  console.log(`=== 预览生成模板 (${path.relative(ROOT, targetFile)}) ===\n`);
  console.log(code);
  console.log("加 --write 参数即可写入文件，并在 src/data/stories.ts 中导入挂载。");
} else {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  if (fs.existsSync(targetFile)) {
    console.error(`❌ 文件已存在: ${path.relative(ROOT, targetFile)}`);
    process.exit(1);
  }
  fs.writeFileSync(targetFile, code);
  console.log(`✅ 已创建 ${path.relative(ROOT, targetFile)}`);
  console.log(`\n下一步请在 src/data/stories.ts 中添加：\n  import { ${ident} } from "./stories/${id}.ts";`);
  console.log("并将其加入 allStories 数组，随后运行 npm run story:index && npm run voice && npm run check && npm test && npm run smoke。");
}
