import type { CameraView } from "../lib/geo.ts";
import { GEO_ZONES } from "./realms.ts";
import type { GeoMarker, GeoRoute, GeoZone } from "./types.ts";

export type AtlasLayerPreset = {
  id: string;
  label: string;
  badgeLabel: string;
  camera: CameraView;
  showTropics?: boolean;
  showChinaProvinces?: boolean;
  zones: readonly GeoZone[];
  routes: readonly GeoRoute[];
  markers: readonly GeoMarker[];
  dadNote: string;
};

export const WORLD_ATLAS_PRESETS: readonly AtlasLayerPreset[] = [
  {
    id: "tectonics",
    label: "🌋 板块与太平洋火环",
    badgeLabel: "火山 · 地震 · 海沟",
    camera: { center: [165, 16], lonSpan: 250 },
    zones: [GEO_ZONES.indian_plate, GEO_ZONES.qinghai_tibet],
    routes: [
      {
        id: "atlas-rof",
        color: "#ef4444",
        waypoints: [[175, -40], [124, 13], [138.7, 35.3], [160, 55], [-155, 58], [-122.19, 46.2], [-71, -33]],
        dashed: true,
        width: 3,
        startAt: 0,
        endAt: 1
      }
    ],
    markers: [
      { id: "a-everest", label: "珠穆朗玛峰", place: "+8848.86m 世界最高", coord: [86.92, 27.99], icon: "🏔️", align: "t", note: "印度板块碰撞欧亚板块隆起的地球之巅。" },
      { id: "a-mariana", label: "马里亚纳海沟", place: "-10935m 世界最深", coord: [142.2, 11.37], icon: "🕳️", align: "b", note: "太平洋板块俯冲形成的万米深海沟。" },
      { id: "a-fuji", label: "富士山", place: "3776m 三板块交界", coord: [138.73, 35.36], icon: "🗻", align: "l", note: "太平洋火环上最著名的圆锥形火山之一。" },
      { id: "a-sthelens", label: "圣海伦斯火山", place: "北美太平洋火环", coord: [-122.19, 46.2], icon: "🌋", align: "r", note: "胡安德富卡板块俯冲进北美板块下形成的活火山。" },
      { id: "a-eastafrica", label: "东非大裂谷", place: "非洲正在张裂", coord: [36.0, -1.5], icon: "♨️", align: "r", note: "未来数千万年后这里可能分裂出一片新海洋！" }
    ],
    dadNote: "看！全球 75% 的活火山都在太平洋这一圈火环上；大西洋中间则是海底生长裂谷，印度板块正顶着青藏高原长高呢！"
  },
  {
    id: "currents",
    label: "🌊 全球洋流与海上钥匙",
    badgeLabel: "暖流 · 寒流 · 运河海峡",
    camera: { center: [15, 16], lonSpan: 240 },
    showTropics: true,
    zones: [],
    routes: [
      {
        id: "atlas-gulf",
        color: "#ef4444",
        waypoints: [[-80, 26], [-72, 36], [-45, 44], [-10, 51], [15, 67]],
        traveler: "🔥",
        width: 3.5,
        startAt: 0,
        endAt: 1
      },
      {
        id: "atlas-peru",
        color: "#2563eb",
        waypoints: [[-74, -42], [-73, -24], [-80, -10], [-90.5, -0.5]],
        traveler: "❄️",
        width: 3,
        startAt: 0,
        endAt: 1
      },
      {
        id: "atlas-kuro",
        color: "#ef4444",
        waypoints: [[126, 22], [136, 33], [148, 40]],
        width: 3,
        startAt: 0,
        endAt: 1
      }
    ],
    markers: [
      { id: "a-malacca", label: "马六甲海峡", place: "最窄仅 2.8 km", coord: [103.85, 1.29], icon: "⚓", align: "b", note: "连接太平洋与印度洋最繁忙的天然海上走廊。" },
      { id: "a-suez", label: "苏伊士运河", place: "193 km 无闸直通", coord: [32.35, 30.58], icon: "🚢", align: "t", note: "省去绕行非洲好望角近一万公里的航程。" },
      { id: "a-panama", label: "巴拿马运河", place: "淡水闸门抬船 26 米", coord: [-79.7, 9.1], icon: "🚢", align: "t", note: "用加通湖淡水把万吨巨轮托过中美洲地峡。" },
      { id: "a-galapagos", label: "加拉帕戈斯群岛", place: "赤道企鹅栖息地", coord: [-90.5, -0.5], icon: "🐧", align: "l", note: "冰凉的秘鲁寒流让赤道海域也能生活着小企鹅。" },
      { id: "a-london", label: "伦敦", place: "51.5°N 暖流护航", coord: [-0.12, 51.5], icon: "🎡", align: "t", note: "靠北大西洋暖流送暖，冬天远比同纬度温暖。" }
    ],
    dadNote: "红色箭头是暖流、蓝色是寒流！暖流把热带热量送向欧洲，寒流养出了赤道企鹅；再看看三把“海上钥匙”怎样连通五大洋。"
  },
  {
    id: "climate",
    label: "🏜️ 地球气候带与极端奇观",
    badgeLabel: "雨林 · 30°沙漠 · 极光",
    camera: { center: [20, 12], lonSpan: 245 },
    showTropics: true,
    zones: [
      GEO_ZONES.amazon_rainforest,
      GEO_ZONES.congo_rainforest,
      GEO_ZONES.sahara_belt,
      GEO_ZONES.atacama_desert,
      GEO_ZONES.australia_desert,
      GEO_ZONES.china_jiangnan
    ],
    routes: [],
    markers: [
      { id: "a-mawsynram", label: "茂辛拉姆", place: "11872 mm/年 世界雨极", coord: [91.58, 25.3], icon: "🌧️", align: "r", note: "喜马拉雅前缘迎风坡把印度洋水汽全拧成暴雨。" },
      { id: "a-atacama", label: "阿塔卡马沙漠", place: "<1 mm/年 世界最干", coord: [-69.5, -23.5], icon: "🌵", align: "l", note: "安第斯山雨影区加上秘鲁寒流造就的超级干区。" },
      { id: "a-deadsea", label: "死海", place: "-430 m 陆地最低点", coord: [35.5, 31.5], icon: "🧂", align: "t", note: "含盐量极高、浮力大到人可以漂浮看报纸。" },
      { id: "a-kilimanjaro", label: "乞力马扎罗山", place: "5895 m 赤道雪冠", coord: [37.35, -3.07], icon: "🏔️", align: "r", note: "每升高 1000 米降温约 6℃，赤道山顶也戴白雪帽。" },
      { id: "a-tromso", label: "特罗姆瑟", place: "69.6°N 极昼与极光", coord: [18.95, 69.65], icon: "🌌", align: "b", note: "北极圈内的极光之都，夏天有午夜太阳。" }
    ],
    dadNote: "赤道 0° 绿油油一片全是雨林，南北纬 30° 排着一圈金黄沙漠，唯有中国江南 30°N 被季风救成了一块翡翠绿洲！"
  },
  {
    id: "records",
    label: "🏙️ 世界超级大河与河口名城",
    badgeLabel: "七大洲地标全览",
    camera: { center: [22, 18], lonSpan: 245 },
    zones: [],
    routes: [
      {
        id: "atlas-nile",
        color: "#2563eb",
        waypoints: [[32.58, 0.42], [32.55, 15.6], [31.23, 30.04], [31.1, 31.4]],
        width: 3,
        startAt: 0,
        endAt: 1
      },
      {
        id: "atlas-amz",
        color: "#0284c7",
        waypoints: [[-74.5, -9.5], [-60.02, -3.11], [-49.5, -0.5]],
        width: 3.5,
        startAt: 0,
        endAt: 1
      }
    ],
    markers: [
      { id: "a-nile", label: "开罗 · 尼罗河", place: "6650 km 世界最长河", coord: [31.23, 30.04], icon: "🔺", align: "l", note: "尼罗河穿越大沙漠喂养出埃及古文明与三角洲。" },
      { id: "a-amz", label: "亚马孙河", place: "20.9 万 m³/s 水量第一", coord: [-60.02, -3.11], icon: "🐊", align: "b", note: "地球水量最大的河流，水量超过尼罗河七十倍。" },
      { id: "a-shanghai", label: "上海 · 长江口", place: "6300 km 亚洲第一长河", coord: [121.47, 31.23], icon: "⚓", align: "r", note: "江海交汇的超级大港与长江三角洲龙头。" },
      { id: "a-nyc", label: "纽约", place: "哈德逊河口良港", coord: [-74.0, 40.71], icon: "🗽", align: "r", note: "依托深水良港与伊利运河连通北美内陆水道。" },
      { id: "a-reef", label: "澳大利亚大堡礁", place: "世界最大珊瑚礁群", coord: [147.5, -18.3], icon: "🐠", align: "r", note: "绵延两千多公里，在太空也能看见的海洋奇观。" }
    ],
    dadNote: "点开每一个闪光图钉看看：从尼罗河到长江口、从纽约港到大堡礁，大河与大海总是人类和自然最热闹的舞台。"
  }
];

export const CHINA_ATLAS_PRESET: AtlasLayerPreset = {
  id: "china-geography",
  label: "🐉 中国三级阶梯与山川大河",
  badgeLabel: "西高东低 · 南北分界",
  camera: { center: [104, 35], lonSpan: 56 },
  showChinaProvinces: true,
  zones: [GEO_ZONES.qinghai_tibet, GEO_ZONES.china_step2, GEO_ZONES.china_step3],
  routes: [
    {
      id: "china-qinling",
      label: "秦岭—淮河线",
      color: "#ef4444",
      waypoints: [[104.5, 34.0], [107.8, 33.9], [111.5, 33.7], [115.0, 32.8], [119.5, 33.4]],
      dashed: true,
      width: 3,
      startAt: 0,
      endAt: 1
    }
  ],
  markers: [
    { id: "cn-everest", label: "珠穆朗玛峰", place: "8848.86 m 世界最高", coord: [86.92, 27.99], icon: "🏔️", align: "b", note: "第一级阶梯南缘的地球之巅。" },
    { id: "cn-ayding", label: "吐鲁番艾丁湖", place: "-154 m 中国最低点", coord: [89.25, 42.66], icon: "🍇", align: "t", note: "深陷天山南麓盆地，依靠坎儿井引雪水种出甜瓜果。" },
    { id: "cn-zhangye", label: "张掖丹霞", place: "河西走廊彩虹山", coord: [100.45, 38.93], icon: "🌈", align: "t", note: "古老红砂岩经过抬升与风化雕出的彩色丘陵。" },
    { id: "cn-taibai", label: "秦岭太白山", place: "中国南北分界脊梁", coord: [107.76, 33.95], icon: "⛰️", align: "t", note: "冬季挡住北方寒潮，大致重合 1月 0℃ 与 800mm 降水线。" },
    { id: "cn-guilin", label: "桂林喀斯特", place: "雨水溶出的山水画卷", coord: [110.29, 25.27], icon: "🪨", align: "b", note: "石灰岩经雨水百万年溶蚀出峰林与地下溶洞。" },
    { id: "cn-three-gorges", label: "长江三峡", place: "二三级阶梯交界", coord: [111.0, 30.8], icon: "⚡", align: "r", note: "长江切穿巫山，落差巨大，建有巨型三峡水电站。" },
    { id: "cn-mohe", label: "漠河", place: "53.5°N 中国最北白夜", coord: [122.36, 53.48], icon: "✨", align: "b", note: "夏至夜晚北天通亮，冬天偶现罕见极光。" },
    { id: "cn-shanghai", label: "上海 · 长江口", place: "第三级平原入海口", coord: [121.47, 31.23], icon: "⚓", align: "r", note: "6300 公里长江在此奔入东海。" }
  ],
  dadNote: "紫色的第一级青藏高原超过 4000 米，橙色的第二级盆地高原 1000 到 2000 米，绿色的第三级平原在 500 米以下；红色虚线就是中国南北分界“秦岭—淮河”！"
};

export const STORY_QUIZ_WIN_CHEER = "耶！地图原理一下就想通啦！";
