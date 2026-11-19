import type { GeoZone, RealmId, RealmMeta } from "./types.ts";

export const realms: readonly RealmMeta[] = [
  {
    id: "sky",
    step: 1,
    title: "第 1 站 · 地球仪与太空时钟",
    emoji: "🪐",
    subtitle: "经纬网 · 四季倾角 · 极光 · 潮汐",
    blurb: "先认识地球这颗斜着自转的蓝色星球：看懂经纬坐标和地图变形，再揭秘四季、极光、时区与月球潮汐。",
    color: "#a66cff"
  },
  {
    id: "tectonics",
    step: 2,
    title: "第 2 站 · 板块、山脉与大地骨架",
    emoji: "🌋",
    subtitle: "大陆漂移 · 喜马拉雅 · 火环 · 东非裂谷",
    blurb: "看板块怎么像拼图一样漂移、相撞抬出世界屋脊、俯冲画出火环海沟，又在东非裂出未来新海洋。",
    color: "#ff6b6b"
  },
  {
    id: "weather",
    step: 3,
    title: "第 3 站 · 风云、雨水与气候密码",
    emoji: "🌦️",
    subtitle: "雨影 · 30°沙漠 · 季风 · 厄尔尼诺 · 雪山带",
    blurb: "揭秘太阳、大海和高山怎么联手画出一边暴雨一边荒漠、30° 沙漠带、东亚季风、厄尔尼诺与赤道雪山。",
    color: "#4d96ff"
  },
  {
    id: "oceans",
    step: 4,
    title: "第 4 站 · 大洋、江河与极地冰雪",
    emoji: "🌊",
    subtitle: "北大西洋暖流 · 大河 · 珊瑚环礁 · 南北极",
    blurb: "潜入蓝色水世界：看海上暖气暖流、大河冲积三角洲、火山沉没留下的珊瑚环礁，以及南北极冰盖对决。",
    color: "#2aa89b"
  },
  {
    id: "china",
    step: 5,
    title: "第 5 站 · 走进中国：神州山河",
    emoji: "🐉",
    subtitle: "三级阶梯 · 秦岭淮河 · 地貌奇观 · 胡焕庸线",
    blurb: "把学到的地理密码用到祖国地图上：从青藏高原走下东部平原，看秦岭挡风、喀斯特溶洞与胡焕庸线。",
    color: "#ff9f43"
  },
  {
    id: "human",
    step: 6,
    title: "第 6 站 · 人类家园与环游世界",
    emoji: "🏙️",
    subtitle: "七大洲之最 · 河口大城 · 海上咽喉航道",
    blurb: "带着地球仪环游七大洲五大洋之最，发现超级大城为什么偏爱河口港湾，乘巨轮穿过三大海上钥匙。",
    color: "#3bb273"
  }
];

export function realmById(id: RealmId): RealmMeta {
  return realms.find((r) => r.id === id) ?? realms[0];
}

export const GEO_ZONES: Record<string, GeoZone> = {
  south_america_fit: {
    id: "south_america_fit",
    label: "南美洲板块",
    color: "#3bb273",
    opacity: 0.3,
    labelAt: [-58, -14],
    rings: [
      [
        [-80, 10],
        [-50, 5],
        [-35, -6],
        [-39, -22],
        [-55, -36],
        [-68, -54],
        [-75, -44],
        [-71, -18],
        [-80, 10]
      ]
    ]
  },
  africa_fit: {
    id: "africa_fit",
    label: "非洲板块",
    color: "#f59e0b",
    opacity: 0.28,
    labelAt: [21, 5],
    rings: [
      [
        [-17, 15],
        [-6, 36],
        [32, 31],
        [51, 12],
        [40, -10],
        [28, -33],
        [18, -34],
        [12, -14],
        [9, 4],
        [-8, 5],
        [-17, 15]
      ]
    ]
  },
  indian_plate: {
    id: "indian_plate",
    label: "印度板块（向北撞击）",
    color: "#ef4444",
    opacity: 0.28,
    labelAt: [78, 19],
    rings: [
      [
        [68, 25],
        [78, 32],
        [90, 26],
        [86, 17],
        [77, 8],
        [70, 18],
        [68, 25]
      ]
    ]
  },
  qinghai_tibet: {
    id: "qinghai_tibet",
    label: "第一级 · 青藏高原 (>4000m)",
    color: "#a66cff",
    opacity: 0.35,
    labelAt: [89, 33],
    rings: [
      [
        [76, 36],
        [84, 38],
        [98, 37],
        [103, 32],
        [99, 27],
        [90, 28],
        [80, 31],
        [76, 36]
      ]
    ]
  },
  china_step2: {
    id: "china_step2",
    label: "第二级 · 高原盆地 (1000-2000m)",
    color: "#ff9f43",
    opacity: 0.26,
    labelAt: [104, 38],
    rings: [
      [
        [74, 40],
        [84, 48],
        [108, 45],
        [121, 49],
        [118, 41],
        [112, 34],
        [108, 25],
        [100, 22],
        [98, 28],
        [103, 33],
        [98, 37],
        [84, 38],
        [74, 40]
      ]
    ]
  },
  china_step3: {
    id: "china_step3",
    label: "第三级 · 东部平原丘陵 (<500m)",
    color: "#3bb273",
    opacity: 0.28,
    labelAt: [118, 33],
    rings: [
      [
        [121, 50],
        [134, 48],
        [128, 41],
        [122, 38],
        [122, 31],
        [118, 24],
        [110, 20],
        [108, 25],
        [112, 34],
        [118, 41],
        [121, 50]
      ]
    ]
  },
  sahara_belt: {
    id: "sahara_belt",
    label: "撒哈拉与阿拉伯沙漠带",
    color: "#f59e0b",
    opacity: 0.34,
    labelAt: [18, 24],
    rings: [
      [
        [-16, 28],
        [32, 30],
        [58, 26],
        [56, 15],
        [34, 15],
        [-15, 16],
        [-16, 28]
      ]
    ]
  },
  amazon_rainforest: {
    id: "amazon_rainforest",
    label: "亚马孙热带雨林",
    color: "#22c55e",
    opacity: 0.34,
    labelAt: [-61, -4],
    rings: [
      [
        [-76, 3],
        [-50, 1],
        [-49, -10],
        [-72, -13],
        [-76, 3]
      ]
    ]
  },
  congo_rainforest: {
    id: "congo_rainforest",
    label: "刚果盆地雨林",
    color: "#22c55e",
    opacity: 0.34,
    labelAt: [21, 0],
    rings: [
      [
        [11, 5],
        [29, 5],
        [29, -6],
        [12, -6],
        [11, 5]
      ]
    ]
  },
  atacama_desert: {
    id: "atacama_desert",
    label: "阿塔卡马沙漠",
    color: "#ea580c",
    opacity: 0.42,
    labelAt: [-69, -22],
    rings: [
      [
        [-71, -18],
        [-68, -18],
        [-69, -28],
        [-71, -28],
        [-71, -18]
      ]
    ]
  },
  australia_desert: {
    id: "australia_desert",
    label: "澳大利亚内陆沙漠",
    color: "#f59e0b",
    opacity: 0.32,
    labelAt: [130, -25],
    rings: [
      [
        [116, -21],
        [140, -22],
        [139, -31],
        [117, -30],
        [116, -21]
      ]
    ]
  },
  china_jiangnan: {
    id: "china_jiangnan",
    label: "江南季风绿洲 (30°N)",
    color: "#22c55e",
    opacity: 0.32,
    labelAt: [117, 29],
    rings: [
      [
        [111, 32],
        [122, 32],
        [121, 25],
        [111, 25],
        [111, 32]
      ]
    ]
  },
  east_africa_rift: {
    id: "east_africa_rift",
    label: "东非大裂谷拉张带",
    color: "#ef4444",
    opacity: 0.3,
    dashed: true,
    labelAt: [36, -3],
    rings: [
      [
        [38, 12],
        [43, 11],
        [39, -1],
        [37, -15],
        [32, -16],
        [29, -4],
        [33, 6],
        [38, 12]
      ]
    ]
  },
  west_pacific_warm_pool: {
    id: "west_pacific_warm_pool",
    label: "西太平洋暖池",
    color: "#ef4444",
    opacity: 0.32,
    labelAt: [142, 0],
    rings: [
      [
        [118, 10],
        [165, 10],
        [165, -10],
        [118, -10],
        [118, 10]
      ]
    ]
  },
  east_pacific_cold_tongue: {
    id: "east_pacific_cold_tongue",
    label: "东太平洋冷水舌",
    color: "#2563eb",
    opacity: 0.32,
    labelAt: [-110, -4],
    rings: [
      [
        [-140, 4],
        [-80, 2],
        [-80, -12],
        [-140, -10],
        [-140, 4]
      ]
    ]
  },
  china_northwest_dry: {
    id: "china_northwest_dry",
    label: "西北半壁 (56.8%土地 · 6.5%人口)",
    color: "#d97706",
    opacity: 0.25,
    dashed: true,
    labelAt: [93, 39],
    rings: [
      [
        [74, 40],
        [85, 49],
        [120, 50],
        [127.5, 50.2],
        [112, 38],
        [98.5, 25],
        [80, 31],
        [74, 40]
      ]
    ]
  },
  china_southeast_dense: {
    id: "china_southeast_dense",
    label: "东南半壁 (43.2%土地 · 93.5%人口)",
    color: "#16a34a",
    opacity: 0.26,
    labelAt: [115, 31],
    rings: [
      [
        [127.5, 50.2],
        [134, 48],
        [122, 38],
        [122, 30],
        [114, 21],
        [98.5, 25],
        [112, 38],
        [127.5, 50.2]
      ]
    ]
  },
  great_barrier_zone: {
    id: "great_barrier_zone",
    label: "大堡礁珊瑚海 (2300 km)",
    color: "#0ea5e9",
    opacity: 0.34,
    labelAt: [148, -17],
    rings: [
      [
        [142, -10],
        [153, -15],
        [154, -24],
        [149, -24],
        [142, -12],
        [142, -10]
      ]
    ]
  }
};
