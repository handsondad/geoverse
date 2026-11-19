import type { CameraView, LonLat } from "../lib/geo.ts";

export type GeoQuizTarget = {
  id: string;
  name: string;
  place: string;
  tag: string;
  coord: LonLat;
  perfectKm: number;
  okKm: number;
  clue: string;
  dadExplain: string;
};

export type GeoQuizStage = {
  id: string;
  title: string;
  emoji: string;
  camera: CameraView;
  showChinaProvinces?: boolean;
  showTropics?: boolean;
  targets: readonly GeoQuizTarget[];
};

export function pinpointNianQuestion(index: number, name: string): string {
  return `爸爸，第 ${index + 1} 题我们要在地图上扎出「${name}」，它在哪儿呢？`;
}

export const QUIZ_WIN_LINES = {
  labCheer: "哇！自己动手调一调，地理原理全变成会动的实验啦！",
  labDad: "做完四个地球原理实验，你已经能像小气象学家和地质学家一样看懂世界啦！",
  pinpointCheer: "哈哈！地球仪全印在小念的脑瓜里啦！",
  pinpointDad: "经纬度方向全抓得稳稳的，下次旅行小念来当小领航员！"
} as const;

export const LAB_DIALOGUE = {
  seasons: {
    nian: "爸爸，我拖动太阳季节滑块，真能看见北京和悉尼为什么正好相反吗？",
    dad: "试试把月份拉到 6 月夏至和 12 月冬至！看着阳光怎么直射南北回归线，北极圈怎么亮出极昼！"
  },
  tectonics: {
    nian: "板块如果往一起撞、往底下钻，或者往两边裂开，长出来的山和海沟一样吗？",
    dad: "点一下上面三个按钮，再拉一拉地壳挤压力滑块！碰撞出雪山、俯冲出深海沟与火山、张裂出裂谷！"
  },
  rainshadow: {
    nian: "如果山越高、海风越湿，背风面的沙漠是不是会变得更干呀？",
    dad: "调高“海风湿度”和“山脉高度”试一试！迎风坡立刻下起暴雨绿油油，背风坡雨影区变得干巴巴！"
  },
  monsoon: {
    nian: "为什么夏天和冬天的风向会掉头 180 度呀？",
    dad: "因为夏天大陆升温快像吸风热炉、冬天大陆降温快成冷库！点一下夏季和冬季切换看看风往哪边吹！"
  }
} as const;

export const quizStages: readonly GeoQuizStage[] = [
  {
    id: "china-landmarks",
    title: "神州山河寻宝",
    emoji: "🐉",
    camera: { center: [104, 35], lonSpan: 54 },
    showChinaProvinces: true,
    targets: [
      {
        id: "q-everest",
        name: "珠穆朗玛峰",
        place: "西藏中尼边境 · 8848.86 米",
        tag: "世界最高峰",
        coord: [86.92, 27.99],
        perfectKm: 280,
        okKm: 650,
        clue: "爸爸提示：它蹲在紫色第一级阶梯“青藏高原”南边边缘、中国与尼泊尔交界处！",
        dadExplain: "正中世界之巅！珠穆朗玛峰海拔 8848.86 米，是印度板块撞出来的雪山。"
      },
      {
        id: "q-turpan",
        name: "吐鲁番艾丁湖",
        place: "新疆东部 · -154 米",
        tag: "中国陆地最低点",
        coord: [89.25, 42.66],
        perfectKm: 300,
        okKm: 700,
        clue: "爸爸提示：它在新疆天山南麓东边，靠坎儿井引雪水种葡萄，海拔比海平面低 154 米！",
        dadExplain: "太准啦！吐鲁番盆地的艾丁湖是我国最低的洼地，夏天瓜果超级甜！"
      },
      {
        id: "q-taibai",
        name: "秦岭南北分界线",
        place: "陕西中部 · 1月 0℃ 线",
        tag: "南北分界脊梁",
        coord: [107.76, 33.95],
        perfectKm: 260,
        okKm: 600,
        clue: "爸爸提示：它横在中国正中间、陕西西安南边一点点，替南方挡住了冬天寒潮！",
        dadExplain: "抓得太稳了！秦岭和东边淮河一起把中国分成了南方稻米与北方小麦。"
      },
      {
        id: "q-guilin",
        name: "桂林喀斯特山水",
        place: "广西东北部",
        tag: "溶洞峰林地貌",
        coord: [110.29, 25.27],
        perfectKm: 260,
        okKm: 600,
        clue: "爸爸提示：他在华南广西东北边，离广东不远，满山都是雨水溶出的竹笋山峰！",
        dadExplain: "扎中啦！“桂林山水甲天下”，全是石灰岩遇到雨水慢慢溶蚀雕出来的艺术品。"
      }
    ]
  },
  {
    id: "tectonic-wonders",
    title: "板块奇观大追踪",
    emoji: "🌋",
    camera: { center: [60, 26], lonSpan: 205 },
    targets: [
      {
        id: "q-mariana",
        name: "马里亚纳海沟",
        place: "西太平洋 · -10935 米",
        tag: "世界最深处",
        coord: [142.2, 11.37],
        perfectKm: 450,
        okKm: 950,
        clue: "爸爸提示：它在菲律宾东北面的西太平洋深海里，比珠峰还要深两千多米！",
        dadExplain: "神射手！挑战者深渊在 11°N, 142°E 附近，是太平洋板块钻进地下压出来的最深海沟。"
      },
      {
        id: "q-fuji",
        name: "富士山",
        place: "日本本州岛中部 · 3776m",
        tag: "火环圆锥火山",
        coord: [138.73, 35.36],
        perfectKm: 320,
        okKm: 750,
        clue: "爸爸提示：往东北看日本列岛中部、东京西南边一点点，三块板块正好挤在它脚下！",
        dadExplain: "太准啦！富士山就在太平洋火环的岛弧上，是板块俯冲烧出来的优美火山。"
      },
      {
        id: "q-eastafrica",
        name: "东非大裂谷",
        place: "非洲东部肯尼亚一带",
        tag: "正在裂开的大陆",
        coord: [36.0, -1.5],
        perfectKm: 500,
        okKm: 1100,
        clue: "爸爸提示：把眼光移到非洲东边靠赤道的地方，大湖泊连成一条长长的陆地大裂缝！",
        dadExplain: "找对啦！东非大裂谷就像地球背上正在缓缓拉开的一道拉链，未来可能变成新大海。"
      },
      {
        id: "q-iceland",
        name: "冰岛大裂谷",
        place: "北大西洋 · 64°N",
        tag: "露出海面的海底中脊",
        coord: [-21.1, 64.2],
        perfectKm: 480,
        okKm: 1050,
        clue: "爸爸提示：去左上角大西洋最北边、格陵兰东南方那座冰与火小岛上找一找！",
        dadExplain: "厉害！冰岛正骑在大西洋中脊上，全岛靠着地下火山地热烧暖气呢。"
      }
    ]
  },
  {
    id: "oceans-straits",
    title: "海洋咽喉与大河",
    emoji: "🚢",
    camera: { center: [20, 14], lonSpan: 220 },
    targets: [
      {
        id: "q-malacca",
        name: "马六甲海峡",
        place: "马来半岛与苏门答腊之间",
        tag: "亚洲海上咽喉",
        coord: [103.85, 1.29],
        perfectKm: 420,
        okKm: 900,
        clue: "爸爸提示：顺着南海往西南一直穿到赤道边上、新加坡所在的狭长水走廊！",
        dadExplain: "扎中咽喉！马六甲海峡最窄只有约 2.8 公里，是连接太平洋与印度洋的黄金通道。"
      },
      {
        id: "q-suez",
        name: "苏伊士运河",
        place: "埃及 · 连接红海与地中海",
        tag: "193 km 无闸运河",
        coord: [32.35, 30.58],
        perfectKm: 420,
        okKm: 900,
        clue: "爸爸提示：在非洲右上角、红海顶头和地中海牵手的那条细细连接处！",
        dadExplain: "太稳了！苏伊士运河帮亚欧航船省下了绕行非洲好望角将近一万公里的路程。"
      },
      {
        id: "q-panama",
        name: "巴拿马运河",
        place: "中美洲最窄地峡",
        tag: "淡水船闸水电梯",
        coord: [-79.7, 9.1],
        perfectKm: 420,
        okKm: 950,
        clue: "爸爸提示：在最左边北美洲和南美洲连接起来最细的那根“小腰”上！",
        dadExplain: "正中要害！巴拿马运河靠加通湖淡水把巨轮抬高 26 米跨过中美洲。"
      },
      {
        id: "q-amazon",
        name: "亚马孙河入海口",
        place: "巴西东北部 · 赤道 0°",
        tag: "水量世界第一大河",
        coord: [-49.5, -0.5],
        perfectKm: 520,
        okKm: 1100,
        clue: "爸爸提示：看南美洲右上角正好挨着赤道的大河口，每秒吐出 20.9 万方淡水！",
        dadExplain: "抓得超准！亚马孙河汇聚了整片热带雨林的暴雨，水量稳居全球第一。"
      }
    ]
  },
  {
    id: "climate-records",
    title: "气候与世界之最",
    emoji: "🏆",
    camera: { center: [42, 4], lonSpan: 255 },
    showTropics: true,
    targets: [
      {
        id: "q-deadsea",
        name: "死海 (-430 米)",
        place: "约旦与以色列交界",
        tag: "陆地最低点",
        coord: [35.5, 31.5],
        perfectKm: 450,
        okKm: 950,
        clue: "爸爸提示：紧挨着地中海东岸、苏伊士运河东北不远处的内陆咸水低谷！",
        dadExplain: "找到啦！死海低于海平面约 430 米，盐分极高让人可以浮在水面上看报。"
      },
      {
        id: "q-mawsynram",
        name: "世界雨极茂辛拉姆",
        place: "印度东北部 · 11872 mm",
        tag: "全球年雨量冠军",
        coord: [91.58, 25.3],
        perfectKm: 450,
        okKm: 950,
        clue: "爸爸提示：在喜马拉雅山脚南边、孟加拉湾正北方的迎风坡山地里！",
        dadExplain: "太厉害了！西南季风撞上山地一年能倒下近 12 米深的雨水！"
      },
      {
        id: "q-atacama",
        name: "阿塔卡马沙漠",
        place: "智利北部 · <1 mm/年",
        tag: "世界最干非极地沙漠",
        coord: [-69.5, -23.5],
        perfectKm: 500,
        okKm: 1100,
        clue: "爸爸提示：到南美洲西海岸、南回归线附近贴着安第斯山和太平洋的那条狭长地带！",
        dadExplain: "完美！安第斯山雨影区加上秘鲁寒流，让阿塔卡马干成了地球上的“火星基地”。"
      },
      {
        id: "q-sydney",
        name: "悉尼 (反季过圣诞)",
        place: "澳大利亚东南海岸 · 33.9°S",
        tag: "南半球四季相反名城",
        coord: [151.2, -33.86],
        perfectKm: 500,
        okKm: 1100,
        clue: "爸爸提示：往右下角找大洋洲澳大利亚东南海岸，7 月北京流汗时那里正穿毛衣！",
        dadExplain: "恭喜全通关！因为地轴倾斜 23.44°，南半球的悉尼四季正好和我们北京反着来！"
      }
    ]
  },
  {
    id: "world-new-wonders",
    title: "裂谷、环礁与大潮",
    emoji: "🪸",
    camera: { center: [42, 12], lonSpan: 255 },
    showTropics: true,
    targets: [
      {
        id: "q-tanganyika",
        name: "坦噶尼喀湖",
        place: "东非大裂谷西支 · 深 1470 米",
        tag: "世界第二深裂谷湖",
        coord: [29.6, -6.2],
        perfectKm: 480,
        okKm: 1050,
        clue: "爸爸提示：到非洲中东部靠赤道南边一点的东非大裂谷里找那条又细又长的超深大湖！",
        dadExplain: "扎得太准了！坦噶尼喀湖深达 1470 米，正是东非大陆慢慢裂开留下的深沟湖泊。"
      },
      {
        id: "q-tengchong",
        name: "云南腾冲 (胡焕庸线南端)",
        place: "中国云南西部 · 25°N",
        tag: "人口地理界线终点",
        coord: [98.49, 25.02],
        perfectKm: 420,
        okKm: 920,
        clue: "爸爸提示：在中国西南角云南最西边、快要挨着缅甸边境的地方，正是胡焕庸线的南起点！",
        dadExplain: "找到啦！从东北黑龙江黑河斜连到西南云南腾冲，把中国 93.5% 的人口划在了东南半壁。"
      },
      {
        id: "q-gbr",
        name: "澳大利亚大堡礁",
        place: "澳洲东北珊瑚海 · 2300 km",
        tag: "太空可见珊瑚奇观",
        coord: [147.7, -18.2],
        perfectKm: 520,
        okKm: 1150,
        clue: "爸爸提示：看右下角澳大利亚东北部热带海域，绵延两千多公里的碧蓝珊瑚海！",
        dadExplain: "满分！大堡礁是无数珊瑚虫接力叠出来的海洋热带雨林，从太空都能清晰看见。"
      },
      {
        id: "q-fundy",
        name: "加拿大芬迪湾",
        place: "北美东岸 · 最大潮差约 16 米",
        tag: "世界第一潮差海湾",
        coord: [-64.5, 45.3],
        perfectKm: 500,
        okKm: 1100,
        clue: "爸爸提示：把视线移到地图最左上方、北美洲东岸紧靠大西洋的加拿大喇叭口海湾！",
        dadExplain: "厉害！芬迪湾凭借喇叭口地形和 12 小时潮汐共振，涨落潮差能达到惊人的 16 米！"
      }
    ]
  }
];
