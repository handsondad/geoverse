# AGENTS.md — GeoVerse 地理奇遇记 Agent 协作与内容扩展指南

本文档面向参与 **GeoVerse（地理奇遇记 · 小念和爸爸的地球探索馆）** 的所有编码 Agent。修改代码、调整样式或新增地理故事前，请先阅读并遵守以下规范。

---

## 1. 产品定位与核心设计

- **「奇遇记」系列成员**：与 `bodyverse`（身体奇遇记）、`chemverse`（化学奇遇记）、`phyverse`（物理奇遇记）、`hanverse`（汉字奇遇记）共用同一对角色（小念 + 爸爸）、同一套暖色手写风视觉语言与配音音色。
- **技术栈**：React 18 + TypeScript（`strict`）+ Vite 5 + `topojson-client` + `world-atlas`。纯静态 Hash 路由，无后端，所有内容均为 `src/data/` 下的 TypeScript 数据，支持 GitHub Pages 相对路径（`base: "./"`）部署。
- **小念是男孩**，用「他」；配音统一为小念 `zh-CN-YunxiaNeural`（`+0%`）、爸爸 `zh-CN-YunxiNeural`（`-5%`）。

---

## 2. 常用命令

需要 Node.js 22.18+（测试和脚本直接通过 Node 原生 TypeScript 类型擦除运行 `.ts` 文件）。

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动 Vite 本地开发服务器 |
| `npm run typecheck` | `tsc --noEmit` 严格类型检查 |
| `npm run check` | `node tools/check-rules.mjs` 仓库规则与内容一致性校验 |
| `npm test` | 运行全部原生测试（`node --test tests/*.test.mjs`） |
| `npm run voice` | 增量采集全站台词并调用 `edge-tts` + `ffmpeg` 生成 MP3 配音与清单 |
| `npm run build` | 类型检查并构建生产包到 `dist/` |
| `npm run smoke` | 无头 Edge/Chrome 桌面 + 手机双端巡检（零报错、零溢出、零重叠、全流程交互） |

交付前需全部通过：`npm run typecheck`、`npm run check`、`npm test`、`npm run build`。修改过台词文字后必须重跑 `npm run voice` 并确认 `npm test` 通过。

---

## 3. 目录与核心模块

| 路径 | 职责 |
|---|---|
| `src/shell/App.tsx` | Hash 路由分发（按页 `React.lazy` 拆包）与声音偏好持久化（`geoverse:sound:v1`） |
| `src/pages/` | `HubPage`（首页）、`RealmPage`（六大展厅）、`StoryPage`（图文问答+地图动画）、`AtlasSandboxPage`（自由地球沙盘）、`QuizPage`（地理原理实验室 & 经纬寻宝） |
| `src/data/realms.ts` | 六大展厅元数据与常用区域多边形 `GEO_ZONES` |
| `src/data/stories-earth.ts` / `stories-world.ts` / `stories-expanded.ts` | 24 集互动地理故事（含对话、地图/剖面分镜、图解、测验、亲子提示与权威来源） |
| `src/data/atlas-presets.ts` / `quiz.ts` / `talks.ts` | 沙盘预设图层、实验室与 5 关 20 题寻宝、18 组父子问答与 24 篇百宝箱 |
| `src/components/GeoStageSvg.tsx` | 800×560 SVG 地图舞台（视口裁剪 + `useMemo` 缓存 + 跨 180° 经线包裹 + 动态防溢出胶囊/误会卡） |
| `src/components/GeoDiagramLayer.tsx` | 23 套时间驱动地理原理剖面动画（与地图舞台共用坐标系与安全区） |
| `src/components/GeoFilmPlayer.tsx` | 音画同步播放器（支持音频预加载、跨标签页与气泡互斥防串音、后台自动暂停） |
| `src/components/GeoFigure.tsx` | 对话内嵌小图（含双向零基线正负柱状图、色阶尺、阶梯剖面、地轴倾角） |
| `src/lib/geo.ts` / `narration.ts` / `quiz-score.ts` / `motion.ts` | 纯函数模块（不依赖 DOM / Vite `import.meta.env`，可直接被 Node 测试导入） |
| `src/kit/speech.ts` | 气泡单句/多句语音播放与全局音频通道互斥（`BroadcastChannel("geoverse-audio")`） |
| `tools/voice/` | 配音采集（`collect.mjs`）、口语规范化与哈希（`voices.mjs`）、批量生成（`generate.mjs`） |

---

## 4. 内容与代码硬性规矩

1. **相对导入扩展名**：Node 直接运行 `.ts` 测试，所有 `src/` 内的相对导入必须显式写出 `.ts` / `.tsx` / `.json` / `.css` 后缀（`tools/check-rules.mjs` 会拦截）。
2. **纯函数与环境隔离**：`src/lib/` 下的模块严禁直接依赖 `window`、`document` 或 `import.meta.env`，以保证 Node 单元测试可直接导入。
3. **科学准确性**：地理事实、海拔/深度/纬度数值与天文方向（如北极俯视地球自转逆时针、南北半球倾角一致）必须核对权威资料，不得臆造数字。
4. **寻宝相机边界**：所有 `quizStages` 的目标坐标在对应 `camera` 下必须落在安全点击区 `[30, 770] × [56, 530]` 内（`tests/quiz.test.mjs` 与 `check-rules.mjs` 会校验）。
5. **音频互斥**：任何新播放入口都须通过 `claimAudioChannel` 或 `stopSpeaking` 参与全局互斥，避免与 `GeoFilmPlayer` 或其他标签页串音。
6. **素材许可**：第三方地理矢量与配音许可见 `THIRD_PARTY_NOTICES.md`，新增外部素材须同步登记来源与许可。
