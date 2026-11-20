---
name: geoverse-builder
description: >-
  为「地理奇遇记」(geoverse) 设计、实现与验收新的交互式地理动画故事（地图分镜 + 地理原理剖面动画）、地理百宝箱、父子科普问答与经纬寻宝挑战。凡在本仓库扩充地理故事、气候/板块/海洋/中国地理专题或调试音画舞台时调用。
---

# 地理奇遇记 · 内容扩充指南 (`geoverse-builder`)

本技能用于指导 AI Agent 以统一的「小念和爸爸」绘本品质扩充 `geoverse`。动手前请先读根目录 `AGENTS.md` 与同目录 `content-reference.md`。

---

## 1. 选题标准：什么样的地理故事才够味？

1. **地球仪与地图/剖面是主角**：让孩子「看见」现象背后的物理与空间规律——板块碰撞抬出高原、迎风湿空气遇山变成雨影沙漠、23.44° 倾角在南北回归线画四季、洋流把热带暖水送去高纬、秦岭挡住寒潮划分南北。
2. **5+ 轮追问链 + 5+ 幕音画舞台一一对应**：
   - 第 0 轮（发现）：从生活或地球仪上反直觉的现象切入，镜头定在起点或宏观视角。
   - 第 1～3 轮（拆解）：结合地图路线（`routes`）、区域多边形（`GEO_ZONES`）或原理剖面动画（`kind: "diagram"`）一步步讲透成因，可配 `steps`、`figure`（`bars` / `scale` / `elevation` / `tilt`）、`factBadge` 与舞台底部的 `myth` 误会反转卡。
   - 第 4 轮（总结）：小念用自己的话把因果链串一遍，爸爸收束回全球视野。
   - 文末附 1 道 3 选 1 的 `quiz` 巩固并颁发星星。

---

## 2. 角色口吻、科学与配音红线

- **小念（7 岁男孩）**：用「他」，好奇直爽、爱拿生活事物打比方。
- **爸爸**：温和启发、严禁贬损词（`笨蛋`、`蠢货`、`废物`、`真笨`、`白痴`）。
- **科学事实不可妥协**：海拔、深度、纬度、自转方向（北极俯视逆时针）与洋流方向必须核实权威来源（NOAA / USGS / NASA / 中国国家地理等）并写进 `sources`。
- **100% 统一神经网络配音**：小念 `zh-CN-YunxiaNeural`（`+0%`），爸爸 `zh-CN-YunxiNeural`（`-5%`）。**绝不允许出现未预生成 MP3 的台词**。新增或修改任何故事、问答、百宝箱、沙盘或寻宝文案后，必须运行 `npm run voice`。

---

## 3. 五步标准扩充流

### 第 1 步：确认展厅归属并运行脚手架

先跑 `npm run check` 查看六大展厅（`sky`、`tectonics`、`weather`、`oceans`、`china`、`human`）分布，再用脚手架生成故事文件：

```bash
npm run story:new -- <realm> <story-id> "<中文标题>" "[emoji]" --write
```

生成的 `src/data/stories/<story-id>.ts` 需在 `src/data/stories.ts` 导入并加入 `allStories` 数组。

### 第 2 步：编写 `GeoStory` 与地图/剖面分镜

- 每幕 `GeoScene` 必须指定 `turn`、`title`、`badgeLabel`、`duration`（秒）与 `camera`（`center: [lon, lat]`、`lonSpan`）。
- 若展示动态剖面原理，设 `kind: "diagram"` 并选择 `DiagramId`（详见 `content-reference.md`）；如需全新剖面，在 `src/data/types.ts` 扩展 `DiagramId` 并在 `src/components/GeoDiagramLayer.tsx` 实现对应动画分支。
- 涉及中国地理专题可设置 `showChinaProvinces: true`，涉及热带/极圈可设 `showTropics: true`。
- 对话内嵌小图 `figure` 支持 `bars`（含双向零基线正负对比）、`scale`、`elevation`、`tilt`。

### 第 3 步：按需同步扩充百宝箱 / 父子问答 / 经纬寻宝

- **地理百宝箱（`src/data/talks.ts` 的 `geoWiki`）**：`familyTip` 必须以 `"🏠 亲子小探秘："` 开头，`relatedStoryId` 必须指向真实故事 ID。
- **小念问爸爸（`src/data/talks.ts` 的 `geoTalks`）**：标注归属 `realm`，含 `turns` 与 `wrap` 总结。
- **经纬寻宝（`src/data/quiz.ts` 的 `quizStages`）**：新增或调整目标点时，投影坐标 `[px, py]` 必须落在安全点击区 `[30, 770] × [56, 530]` 内。

### 第 4 步：增量生成配音与校验

```bash
npm run voice
```

确保 `src/data/voice-manifest.json` 覆盖全站所有新增台词。

### 第 5 步：交付前必跑全套门禁

```bash
npm run typecheck
npm run check
npm test
npm run build
npm run smoke
```
