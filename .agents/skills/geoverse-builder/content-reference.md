# 内容与地理数据结构速查表 (`content-reference.md`)

## 1. 六大地球展厅 (`RealmId`)

- `"sky"`：🪐 第 1 站 · 地球仪与太空时钟（`#a66cff`）
- `"tectonics"`：🌋 第 2 站 · 板块、山脉与大地骨架（`#ff6b6b`）
- `"weather"`：🌦️ 第 3 站 · 风云、雨水与气候密码（`#4d96ff`）
- `"oceans"`：🌊 第 4 站 · 大洋、江河与极地冰雪（`#2aa89b`）
- `"china"`：🐉 第 5 站 · 走进中国：神州山河（`#ff9f43`）
- `"human"`：🏙️ 第 6 站 · 人类家园与环游世界（`#3bb273`）

## 2. 可用的 24 套剖面动画 (`DiagramId` in `src/components/GeoDiagramLayer.tsx`)

| `DiagramId` | 主题 |
| --- | --- |
| `pangaea` | 盘古大陆拼合与分裂漂移 |
| `subduction-uplift` | 板块俯冲与碰撞造山 |
| `ring-subduction` | 环太平洋火环与海沟俯冲 |
| `rift-ocean` | 东非大裂谷张裂演化为海洋 |
| `rain-shadow` | 迎风坡地形雨与背风坡雨影区 |
| `hadley-cell` | 哈德莱环流与南北纬 30° 沙漠带 |
| `monsoon-flip` | 东亚冬夏季风 180° 翻转 |
| `el-nino-seesaw` | 沃克环流与厄尔尼诺跷跷板 |
| `china-steps` | 中国西高东低三级阶梯剖面 |
| `qinling-barrier` | 秦岭阻挡寒潮与暖湿气流 |
| `karst-cave` | 喀斯特溶洞与地下水溶蚀 |
| `hu-line-balance` | 胡焕庸线东西人口与降水对比 |
| `ocean-conveyor` | 全球大洋温盐传送带与北大西洋暖流 |
| `river-delta` | 大河泥沙冲积三角洲生长 |
| `panama-locks` | 巴拿马运河梯级水闸升降 |
| `atoll-evolution` | 达尔文火山岛沉降与珊瑚环礁演化 |
| `earth-seasons` | 23.44° 地轴倾角与四季直射点 |
| `polar-aurora` | 太阳风沿地磁场极区激发极光 |
| `timezone-spin` | 地球自转与 24 时区 / 180° 日界线 |
| `moon-tides` | 月球引力与太阳叠加形成大小潮 |
| `mercator-distortion` | 球面投影到墨卡托平面造成的极区放大 |
| `river-city` | 河口港湾与冲击平原超级城市选址 |
| `vertical-zones` | 赤道高山从热带雨林到雪顶的垂直自然带 |
| `arctic-vs-antarctic` | 北冰洋海冰 vs 南极大陆冰盖对决 |

## 3. 预设地理区域 (`GEO_ZONES` in `src/data/realms.ts`)

`south_america_fit`、`africa_fit`、`indian_plate`、`qinghai_tibet`、`china_step2`、`china_step3`、`sahara_belt`、`amazon_rainforest`、`congo_rainforest`、`atacama_desert`、`australia_desert`、`china_jiangnan`、`east_africa_rift`、`west_pacific_warm_pool`、`east_pacific_cold_tongue`、`china_northwest_dry`、`china_southeast_dense`、`great_barrier_zone`。

## 4. `GeoFigureSpec` 对话内嵌小图

- `bars`：`{ kind: "bars", caption, items: [{ label, value, unit, color }] }`（支持正负双向零基线）
- `scale`：`{ kind: "scale", caption, stops: [{ label, note, color, hot? }] }`
- `elevation`：`{ kind: "elevation", caption, steps: [{ name, height, color, pct }] }`
- `tilt`：`{ kind: "tilt", caption, angleDeg, northNote, southNote }`

## 5. 相对导入与测试约束

- `src/` 内所有相对导入**必须写全 `.ts` / `.tsx` / `.json` / `.css` 后缀**（`tools/check-rules.mjs` 校验）。
- `src/lib/` 下纯函数不得依赖 `window` / `document` / `import.meta.env`。
- `tools/voice/collect.mjs` 负责采集全站台词；任何新增文案字段都需确保被它采集，否则 `tests/stories.test.mjs` 会报缺失音频。
