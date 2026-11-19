import type { GlobeMarkerItem } from "../components/Globe3D.tsx";
import type { LonLat } from "../lib/geo.ts";

export const GLOBE_LANDMARKS: readonly GlobeMarkerItem[] = [
  {
    id: "gl-beijing",
    label: "北京",
    icon: "🏮",
    coord: [116.4, 39.9],
    color: "#ef4444",
    place: "中国首都 · 东八区",
    note: "位于华北平原北端、胡焕庸线东南侧，是观察中国四季与时差的最佳坐标起点。",
    storyId: "globe-grid-mercator"
  },
  {
    id: "gl-everest",
    label: "珠穆朗玛峰",
    icon: "🏔️",
    coord: [86.92, 27.99],
    color: "#a66cff",
    place: "+8848.86m 世界最高峰",
    note: "印度板块撞击欧亚板块把古海底抬升出的世界屋脊，山顶岩层里仍躺着海洋贝壳化石。",
    storyId: "himalayas-everest"
  },
  {
    id: "gl-mariana",
    label: "马里亚纳海沟",
    icon: "🕳️",
    coord: [142.2, 11.37],
    color: "#2563eb",
    place: "-10935m 地球最深处",
    note: "太平洋板块俯冲钻进地幔压出的万米深渊，把整座珠穆朗玛峰放进去还多出两千多米水。",
    storyId: "ring-of-fire-trench"
  },
  {
    id: "gl-iceland",
    label: "冰岛大裂谷",
    icon: "♨️",
    coord: [-21.1, 64.2],
    color: "#f97316",
    place: "64°N 大西洋中脊露头",
    note: "北美与欧亚板块正在这里以每年约 2 厘米的速度缓缓分开，温泉和火山遍布全岛。",
    storyId: "pangaea-drift"
  },
  {
    id: "gl-tanganyika",
    label: "东非坦噶尼喀湖",
    icon: "🌋",
    coord: [29.6, -6.2],
    color: "#f59e0b",
    place: "深 1470m 裂谷湖",
    note: "嵌在三千公里东非大裂谷里的世界第二深淡水湖，见证非洲板块正在拉开诞生未来新大洋。",
    storyId: "east-africa-rift"
  },
  {
    id: "gl-mawsynram",
    label: "世界雨极茂辛拉姆",
    icon: "🌧️",
    coord: [91.58, 25.3],
    color: "#3b82f6",
    place: "年降雨 11872 mm",
    note: "印度洋西南季风撞上迎风山地陡坡，每年倾泻近 12 米深的丰沛地形雨。",
    storyId: "rain-shadow-desert"
  },
  {
    id: "gl-atacama",
    label: "阿塔卡马沙漠",
    icon: "🌵",
    coord: [-69.5, -23.5],
    color: "#ea580c",
    place: "世界最干非极地沙漠",
    note: "紧挨太平洋却被安第斯山雨影区与秘鲁寒流双重夹击，干成了地球上的“火星基地”。",
    storyId: "rain-shadow-desert"
  },
  {
    id: "gl-gbr",
    label: "澳大利亚大堡礁",
    icon: "🪸",
    coord: [147.7, -18.2],
    color: "#0ea5e9",
    place: "绵延 2300 km 珊瑚海",
    note: "太空卫星肉眼可见的世界最大珊瑚礁群，由无数造礁珊瑚虫历经万年接力建造。",
    storyId: "coral-reef-atoll"
  },
  {
    id: "gl-fundy",
    label: "加拿大芬迪湾",
    icon: "🌙",
    coord: [-64.5, 45.3],
    color: "#0284c7",
    place: "最大潮差约 16 米",
    note: "凭借喇叭口地形与 12 小时潮汐共振，涨落潮差高达五层楼，稳居世界第一。",
    storyId: "moon-tides-bay"
  },
  {
    id: "gl-london",
    label: "伦敦 · 0°经线",
    icon: "🕒",
    coord: [-0.12, 51.5],
    color: "#facc15",
    place: "51.5°N 本初子午线",
    note: "世界时区 0 点起点，靠北大西洋暖流送暖，冬天远比同纬度内陆暖和。",
    storyId: "gulf-stream-heater"
  },
  {
    id: "gl-sydney",
    label: "悉尼",
    icon: "🦘",
    coord: [151.2, -33.86],
    color: "#22c55e",
    place: "33.9°S 南半球反季名城",
    note: "位于南半球中纬度，北京 7 月盛夏吃西瓜时，悉尼正在穿毛衣过冬天。",
    storyId: "earth-tilt-seasons"
  },
  {
    id: "gl-panama",
    label: "巴拿马运河",
    icon: "🚢",
    coord: [-79.7, 9.1],
    color: "#14b8a6",
    place: "淡水船闸抬船 26m",
    note: "靠加通湖淡水把万吨巨轮托过中美洲地峡，连接太平洋与大西洋。",
    storyId: "global-straits-canals"
  },
  {
    id: "gl-kilimanjaro",
    label: "乞力马扎罗山",
    icon: "❄️",
    coord: [37.35, -3.07],
    color: "#38bdf8",
    place: "5895m 赤道雪冠",
    note: "坐落赤道附近，却因每升高 1000 米降温约 6℃，山顶常年戴着白雪帽。",
    storyId: "vertical-climate-andes"
  },
  {
    id: "gl-svalbard",
    label: "北极圈 · 斯瓦尔巴",
    icon: "🐻‍❄️",
    coord: [16.0, 78.2],
    color: "#60a5fa",
    place: "78°N 极昼极光前哨",
    note: "夏天有连续数月太阳不落的午夜太阳，冬天则能仰望漫天舞动的翠绿极光。",
    storyId: "midnight-sun-aurora"
  }
];

export type FlightCity = {
  id: string;
  name: string;
  emoji: string;
  coord: LonLat;
  utcOffset: number;
};

export const FLIGHT_CITIES: readonly FlightCity[] = [
  { id: "beijing", name: "北京", emoji: "🏮", coord: [116.4, 39.9], utcOffset: 8 },
  { id: "newyork", name: "纽约", emoji: "🗽", coord: [-74.0, 40.7], utcOffset: -5 },
  { id: "tokyo", name: "东京", emoji: "🗼", coord: [139.69, 35.68], utcOffset: 9 },
  { id: "sanfrancisco", name: "旧金山", emoji: "🌉", coord: [-122.42, 37.77], utcOffset: -8 },
  { id: "london", name: "伦敦", emoji: "🎡", coord: [-0.12, 51.5], utcOffset: 0 },
  { id: "sydney", name: "悉尼", emoji: "🦘", coord: [151.2, -33.86], utcOffset: 10 },
  { id: "cairo", name: "开罗", emoji: "🐫", coord: [31.23, 30.04], utcOffset: 2 },
  { id: "rio", name: "里约热内卢", emoji: "🌴", coord: [-43.17, -22.91], utcOffset: -3 }
];

export const PRESET_FLIGHTS: readonly {
  id: string;
  label: string;
  from: string;
  to: string;
  tip: string;
}[] = [
  {
    id: "bj-nyc",
    label: "✈️ 北京 ↔ 纽约（贴北极直飞！）",
    from: "beijing",
    to: "newyork",
    tip: "在圆地球仪上拉紧细绳，最短的大圆航线居然贴着北冰洋边缘飞，比横穿太平洋省下上千公里！"
  },
  {
    id: "tyo-sfo",
    label: "📅 东京 → 旧金山（跨日界线回到昨天！）",
    from: "tokyo",
    to: "sanfrancisco",
    tip: "向东飞越 180° 国际日界线日期要减一天，经常出现“早上起飞，落地变成昨天夜里”的奇妙体验！"
  },
  {
    id: "bj-lon",
    label: "🕒 北京 ↔ 伦敦（亚欧 8 小时时差）",
    from: "beijing",
    to: "london",
    tip: "穿过西伯利亚与乌拉尔山，两地相差 8 个时区，北京吃晚饭时伦敦刚吃午饭！"
  },
  {
    id: "bj-syd",
    label: "☀️ 北京 ↔ 悉尼（跨越赤道反转四季）",
    from: "beijing",
    to: "sydney",
    tip: "几乎顺着同一条经度带直飞南半球，时差只有 2 小时，季节却正好完全相反！"
  }
];
