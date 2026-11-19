import { GEO_ZONES } from "./realms.ts";
import type { GeoStory } from "./types.ts";

export const earthStories: readonly GeoStory[] = [
  // ==================== 1. tectonics ====================
  {
    id: "pangaea-drift",
    realm: "tectonics",
    emoji: "🧩",
    title: "为什么南美洲和非洲像两块掰开的拼图？",
    subtitle: "魏格纳的拼图发现、2.5 亿年前盘古大陆与大西洋中脊海底扩张",
    badge: "板块漂移 · 2.5亿年前至今",
    trigger: "小念盯着世界地图看得出神，突然拿手指把南美洲往非洲西海岸推了过去。",
    difficulty: "starter",
    tags: ["大陆漂移", "盘古大陆", "大西洋", "板块拼图"],
    dialogue: [
      {
        nian: "爸爸你看！南美洲东边凸出来的尖尖，正好能塞进非洲西边凹进去的拐弯里，它们以前是不是粘在一起？",
        dad: "你的眼睛跟一百多年前的德国科学家魏格纳一模一样尖！1912 年他在地图前也看出了这个巧合，发现不仅轮廓像拼图，大洋两岸的古老岩石和同一种不会游泳的爬行动物化石也严丝合缝！",
        steps: [
          { icon: "🧩", label: "海岸线凹凸吻合" },
          { icon: "🪨", label: "古岩层年龄相同" },
          { icon: "🦴", label: "同款陆地化石隔海呼应" }
        ]
      },
      {
        nian: "哇！那两块那么重的大陆，怎么会自己长腿分开呢？",
        dad: "不是大陆在海水里漂，而是地球表面分成好几块巨大的岩石板块，它们浮在下面滚烫缓慢流动的地幔上。大约 2.5 亿年前所有大陆还抱成一团，叫“盘古大陆”，后来被底下涌上来的岩浆慢慢顶开啦！",
        factBadge: {
          icon: "🌋",
          title: "大西洋还在悄悄变宽",
          detail: "每年以大约 2~3 厘米的速度张开，差不多就是你指甲一年长长的长度！"
        }
      },
      {
        nian: "岩浆是在大西洋正中间把它们推开的吗？",
        dad: "对！大西洋海底正中间有一条一万多公里长的超级海底山脉，叫“大西洋中脊”。滚烫岩浆不断从裂缝里冒出来变成新海底，像传送带一样把南美洲和非洲推向两边。",
        figure: {
          kind: "bars",
          caption: "各大洋最宽处大比拼（公里）",
          items: [
            { label: "太平洋", value: 19000, unit: "km", color: "#4d96ff" },
            { label: "印度洋", value: 10000, unit: "km", color: "#2aa89b" },
            { label: "大西洋(正变宽)", value: 6500, unit: "km", color: "#ff9f43" }
          ]
        }
      },
      {
        nian: "那现在冰岛为什么有那么多温泉和火山，它也在裂缝上吗？",
        dad: "答对啦！大西洋中脊大部分躲在深海里，偏偏在冰岛露出了海面！所以冰岛一边在“长个子”，一边满地都是热气腾腾的地热温泉。",
        factBadge: {
          icon: "♨️",
          title: "冰岛一半踩在北美板块、一半踩在欧亚板块",
          detail: "在冰岛的辛格韦德利大裂谷，游人甚至能伸开手臂同时摸到两大板块！"
        }
      },
      {
        nian: "我明白了！地球表面是一套会自己移动的大拼图，大西洋就是被岩浆推开的裂缝！",
        dad: "太棒了！记住这个秘密，下次看世界地图，你就会发现山脉、海沟和火山全都在讲板块动起来的故事。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 南美与非洲拼图",
        badgeLabel: "海岸线惊人吻合",
        duration: 7,
        camera: { center: [-15, -6], lonSpan: 110 },
        zones: [GEO_ZONES.south_america_fit, GEO_ZONES.africa_fit],
        markers: [
          { id: "brazil", label: "巴西凸角", place: "南美东岸", coord: [-35, -7], icon: "🧩", align: "l" },
          { id: "guinea", label: "几内亚湾凹角", place: "非洲西岸", coord: [8, 4], icon: "🧩", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 盘古大陆裂开啦",
        badgeLabel: "2.5亿年前 → 今天",
        duration: 7,
        kind: "diagram",
        diagram: "pangaea",
        camera: { center: [-15, -6], lonSpan: 110 },
        myth: {
          wrong: "以为大陆是一直固定不动、天生长成现在这样",
          right: "板块每年像指甲生长一样慢移，几亿年就能把一个超级大陆拆成七大洲！"
        }
      },
      {
        turn: 2,
        title: "3 · 大西洋海底传送带",
        badgeLabel: "海底扩张",
        duration: 7,
        camera: { center: [-24, 15], lonSpan: 115 },
        routes: [
          {
            id: "mid-atlantic-ridge",
            label: "大西洋中脊",
            color: "#ef4444",
            waypoints: [[-18, 65], [-28, 40], [-36, 15], [-18, -10], [-14, -40]],
            traveler: "🌋",
            dashed: true,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "ridge-mid", label: "大西洋中脊", place: "海底火山带", coord: [-28, 28], icon: "🌋", align: "r" }
        ]
      },
      {
        turn: 3,
        title: "4 · 露出海面的冰岛裂缝",
        badgeLabel: "64°N 冰与火之岛",
        duration: 7,
        camera: { center: [-18, 64], lonSpan: 32 },
        markers: [
          {
            id: "iceland",
            label: "冰岛大裂谷",
            place: "北美与欧亚板块交界",
            coord: [-21.1, 64.2],
            icon: "♨️",
            align: "b",
            note: "这里地面每年悄悄拉开约 2 厘米，温泉和火山遍布全岛！"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 会跳舞的地球拼图",
        badgeLabel: "板块构造学说",
        duration: 6,
        camera: { center: [0, 15], lonSpan: 240 },
        zones: [GEO_ZONES.south_america_fit, GEO_ZONES.africa_fit]
      }
    ],
    quiz: {
      prompt: "为什么大西洋两岸的南美洲和非洲正在一年年慢慢远离彼此？",
      options: [
        "大西洋的海水把它们冲走了",
        "大西洋中脊不断涌出岩浆造出新海底，把板块推向两边",
        "地球自转把非洲甩到了东边"
      ],
      answerIndex: 1,
      explain: "大西洋海底正中的大西洋中脊不断有岩浆涌出冷却成新地壳，像传送带一样把两侧板块每年推开几厘米！"
    },
    parentTip: "家长可以拿两本合在一起的厚书在桌面上慢慢拉开，让孩子从书缝下面往上顶出一张彩纸，直观模拟海底扩张。"
  },
  {
    id: "himalayas-everest",
    realm: "tectonics",
    emoji: "🏔️",
    title: "喜马拉雅山顶为什么会躺着海底贝壳？",
    subtitle: "印度板块北撞欧亚板块、8848.86 米珠穆朗玛峰与青藏高原的诞生",
    badge: "造山运动 · 每年长高",
    trigger: "小念看纪录片时惊呼：科学家竟然在雪山岩石里敲出了海螺和鱼龙化石！",
    difficulty: "starter",
    tags: ["喜马拉雅", "珠穆朗玛峰", "青藏高原", "海陆变迁"],
    dialogue: [
      {
        nian: "爸爸，珠穆朗玛峰那么高那么冷，山石头里怎么会藏着海底小贝壳的化石呀？",
        dad: "因为几千万年前，喜马拉雅山的位置根本不是山，而是一片波浪滔天的古海洋！",
        steps: [
          { icon: "🐚", label: "古特提斯海" },
          { icon: "💥", label: "印度板块撞上来" },
          { icon: "🏔️", label: "海底被拱成雪山" }
        ]
      },
      {
        nian: "海底怎么可能自己跑到八千多米的天上去呢？",
        dad: "你看地图！以前住在南半球海洋里的印度板块，像一艘开足马力的巨轮一路往北冲，大约五千万年前狠狠撞上了庞大的欧亚大陆，夹在中间的海底岩层被挤得皱巴巴往上拱起，变成了喜马拉雅山和青藏高原！",
        figure: {
          kind: "elevation",
          caption: "海底化石如何一步步登上地球之巅",
          steps: [
            { name: "古海底", height: "-2000m", color: "#4d96ff", pct: 25 },
            { name: "挤压抬升", height: "+3000m", color: "#ff9f43", pct: 55 },
            { name: "青藏高原", height: "+4500m", color: "#a66cff", pct: 75 },
            { name: "珠穆朗玛", height: "8848.86m", color: "#ff6b6b", pct: 100 }
          ]
        }
      },
      {
        nian: "8848.86 米！那珠穆朗玛峰现在是不是早就停住不长了？",
        dad: "还没停呢！印度板块现在依然在以每年大约 5 厘米的速度往欧亚板块底下挤，所以珠峰每年还会悄悄长高几毫米，青藏高原也还在慢慢“长胖”呢！",
        factBadge: {
          icon: "📏",
          title: "2020年中尼联合测高：8848.86 米",
          detail: "珠穆朗玛峰位于中国和尼泊尔边境，是地球海拔最高的山峰。"
        }
      },
      {
        nian: "怪不得爸爸常说没有哪块陆地是一成不变的，海也能变成山！",
        dad: "中国古代有句话叫“沧海桑田”，就是大海变成农田、海底升成雪山！不仅喜马拉雅山，连我国新疆塔里木盆地地下也找到过古代海洋的痕迹呢。"
      },
      {
        nian: "我懂了！印度板块像推土机一样把古海洋挤皱抬高，才把海底贝壳送上了珠峰之巅！",
        dad: "太棒的比喻！下次爬山看到石头纹路像千层饼一样歪歪扭扭，你就知道那是地壳被挤皱的签名啦。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 远道而来的印度板块",
        badgeLabel: "印度洋 → 亚欧大陆",
        duration: 7,
        camera: { center: [82, 22], lonSpan: 55 },
        zones: [GEO_ZONES.indian_plate, GEO_ZONES.qinghai_tibet],
        routes: [
          {
            id: "india-push",
            label: "印度板块北移",
            color: "#ef4444",
            waypoints: [[77, 8], [79, 18], [83, 27]],
            traveler: "🧭",
            startAt: 0.1,
            endAt: 0.88
          }
        ],
        markers: [
          { id: "everest-1", label: "珠穆朗玛峰", place: "8848.86m", coord: [86.92, 27.99], icon: "🏔️", align: "t" }
        ]
      },
      {
        turn: 1,
        title: "2 · 板块挤压造山剖面",
        badgeLabel: "5000万年前剧烈碰撞",
        duration: 8,
        kind: "diagram",
        diagram: "subduction-uplift",
        camera: { center: [86, 28], lonSpan: 35 },
        myth: {
          wrong: "以为山峰是被地下的火山一口气顶起来的",
          right: "喜马拉雅山主要是两大洲板块面对面挤压，把古海底褶皱拱起来的！"
        }
      },
      {
        turn: 2,
        title: "3 · 地球第三极青藏高原",
        badgeLabel: "平均海拔超 4000 米",
        duration: 7,
        camera: { center: [88, 32], lonSpan: 36 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.qinghai_tibet],
        markers: [
          {
            id: "everest",
            label: "珠穆朗玛峰",
            place: "海拔 8848.86 米",
            coord: [86.92, 27.99],
            icon: "🏔️",
            align: "b",
            note: "每年仍在缓慢抬升，峰顶岩层属于曾经的古海洋灰岩。"
          },
          {
            id: "lhasa",
            label: "拉萨",
            place: "日光城 · 海拔 3650m",
            coord: [91.13, 29.65],
            icon: "☀️",
            align: "r"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 沧海桑田的中国西北",
        badgeLabel: "古海变高原与盆地",
        duration: 6,
        camera: { center: [88, 36], lonSpan: 44 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.qinghai_tibet],
        markers: [
          { id: "tarim", label: "塔里木盆地", coord: [83, 39], icon: "🏜️", align: "t" },
          { id: "everest-3", label: "喜马拉雅山脉", coord: [86.92, 27.99], icon: "🐚", align: "b" }
        ]
      },
      {
        turn: 4,
        title: "5 · 俯瞰雪域屋脊",
        badgeLabel: "印度板块仍在北推",
        duration: 6,
        camera: { center: [85, 29], lonSpan: 48 },
        zones: [GEO_ZONES.indian_plate, GEO_ZONES.qinghai_tibet],
        markers: [{ id: "everest-end", label: "珠峰 8848.86m", coord: [86.92, 27.99], icon: "🏔️", align: "t" }]
      }
    ],
    quiz: {
      prompt: "喜马拉雅山顶发现海洋贝壳化石，说明了什么地理现象？",
      options: [
        "古代人类把贝壳背到了山顶",
        "这里曾经是一片古海洋，后来因为板块挤压才抬升成雪山",
        "大洪水曾淹没过珠穆朗玛峰"
      ],
      answerIndex: 1,
      explain: "印度板块向北撞击欧亚板块，把原本处于古特提斯海的海底岩层挤压抬升成了世界最高的山脉，这就是“沧海桑田”！"
    },
    parentTip: "在桌面放两条毛巾，让孩子双手从两端往中间用力推，毛巾立刻就会皱起一座“喜马拉雅山”！"
  },
  {
    id: "ring-of-fire-trench",
    realm: "tectonics",
    emoji: "🌋",
    title: "为什么火山和地震最爱沿着太平洋画圆圈？",
    subtitle: "太平洋火环带、75% 活火山与世界最深处 -10935 米马里亚纳海沟",
    badge: "太平洋火环 · 深海沟",
    trigger: "小念在地球仪上标记最近的新闻火山和地震，居然连成了一个大大的马蹄形圆圈。",
    difficulty: "explorer",
    tags: ["环太平洋火山带", "马里亚纳海沟", "富士山", "地震"],
    dialogue: [
      {
        nian: "爸爸你看！日本富士山、菲律宾火山、新西兰还有美洲西海岸，怎么围着太平洋画了一个大圆圈呀？",
        dad: "科学家给它起了一个特别威风的名字，叫“环太平洋火山地震带”，也叫“太平洋火环”！地球上约 75% 的活火山和大约 90% 的地震，都排队站在这个圈上。",
        steps: [
          { icon: "🌊", label: "大洋板块沉重下潜" },
          { icon: "🕳️", label: "压出最深海底海沟" },
          { icon: "🌋", label: "岩石熔化喷出火山" }
        ]
      },
      {
        nian: "为什么太平洋边上这么热闹，大西洋中间反而温柔一些？",
        dad: "因为太平洋板块又重又冷，它像潜水艇一样斜着扎进周围大陆板块的肚子底下！这一扎下去，既撕出了深得吓人的海沟，又把地壳带进地下深处熔化成岩浆，岩浆再找裂缝喷出来就成了火山岛链。",
        figure: {
          kind: "bars",
          caption: "世界屋脊 vs 地球最深海沟（米）",
          items: [
            { label: "珠穆朗玛峰(高)", value: 8849, unit: "m", color: "#ff9f43" },
            { label: "马里亚纳海沟(深)", value: 10935, unit: "m", color: "#1d4ed8" }
          ]
        }
      },
      {
        nian: "哇，马里亚纳海沟有 10935 米深！把整座珠穆朗玛峰放进去都会被海水淹没吗？",
        dad: "对！峰顶上面还剩两千多米深的海水呢！在挑战者深渊底部，海水压力是海平面的 1000 多倍，常年漆黑冰冷，却依然生活着会发光的小鱼和透明小虾。",
        factBadge: {
          icon: "🤿",
          title: "中国“奋斗者”号曾下潜至 10909 米",
          detail: "马里亚纳海沟位于西太平洋菲律宾东北方，是地球固体表面最深的地方。"
        }
      },
      {
        nian: "那日本为什么那么多温泉和地震？是因为站在三个板块交界处吗？",
        dad: "真聪明！日本就在太平洋板块、菲律宾海板块和欧亚板块挤在一起的地方，富士山就是板块俯冲造出来的圆锥形火山，所以日本一边常有地震，一边满地都是温泉。",
        factBadge: {
          icon: "🗻",
          title: "富士山海拔 3776 米",
          detail: "它是一座休眠活火山，三块板块交界的“三叉路口”正压在它脚下。"
        }
      },
      {
        nian: "我懂了！太平洋板块往四周大陆底下钻，钻出了最深海沟，也点亮了一整圈火山！",
        dad: "总结得真棒！海沟和火山看着是一对冤家，其实都是板块俯冲生出来的双胞胎。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 环太平洋火环画圆",
        badgeLabel: "75% 活火山集中带",
        duration: 7,
        camera: { center: [195, 14], lonSpan: 175 },
        routes: [
          {
            id: "ring-of-fire",
            label: "太平洋火环",
            color: "#ef4444",
            waypoints: [
              [175, -40],
              [147, -6],
              [124, 13],
              [138.7, 35.3],
              [160, 55],
              [-155, 58],
              [-122.19, 46.2],
              [-98, 19],
              [-71, -33]
            ],
            traveler: "🌋",
            dashed: true,
            startAt: 0.05,
            endAt: 0.92
          }
        ],
        markers: [
          { id: "fuji", label: "富士山", coord: [138.73, 35.36], icon: "🗻", align: "l" },
          { id: "sthelens", label: "圣海伦斯火山", coord: [-122.19, 46.2], icon: "🌋", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 俯冲带：海沟与火山",
        badgeLabel: "板块潜入地幔",
        duration: 8,
        kind: "diagram",
        diagram: "ring-subduction",
        camera: { center: [142, 18], lonSpan: 50 }
      },
      {
        turn: 2,
        title: "3 · 潜入地球最深海沟",
        badgeLabel: "挑战者深渊 -10935m",
        duration: 7,
        camera: { center: [142, 14], lonSpan: 36 },
        markers: [
          {
            id: "mariana",
            label: "马里亚纳海沟",
            place: "深 -10,935 米",
            coord: [142.2, 11.37],
            icon: "🕳️",
            align: "b",
            note: "地球海洋最深处，把珠穆朗玛峰放进去还多出 2000 多米海水！"
          }
        ],
        myth: {
          wrong: "以为海底是一片平平整整的大沙盘",
          right: "海底既有比喜马拉雅还长的山脉，也有能吞下珠峰的 10935 米深渊！"
        }
      },
      {
        turn: 3,
        title: "4 · 三板块交叉口的富士山",
        badgeLabel: "岛弧火山与温泉",
        duration: 6,
        camera: { center: [138, 35], lonSpan: 24 },
        markers: [
          { id: "fuji-zoom", label: "富士山 3776m", coord: [138.73, 35.36], icon: "🗻", align: "l" },
          { id: "tokyo", label: "东京湾", coord: [139.77, 35.68], icon: "🏙️", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 太平洋上的火焰项链",
        badgeLabel: "板块边缘的威力",
        duration: 6,
        camera: { center: [165, 18], lonSpan: 155 },
        markers: [
          { id: "mariana-end", label: "马里亚纳海沟", coord: [142.2, 11.37], icon: "🕳️", align: "l" },
          { id: "fuji-end", label: "富士山", coord: [138.73, 35.36], icon: "🗻", align: "t" }
        ]
      }
    ],
    quiz: {
      prompt: "地球表面最深的地方“马里亚纳海沟（-10935米）”是怎么形成的？",
      options: [
        "被远古陨石砸出来的坑",
        "沉重的太平洋大洋板块俯冲钻进相邻板块下方压出来的深沟",
        "海水漩涡常年冲刷出来的"
      ],
      answerIndex: 1,
      explain: "密度较大的太平洋板块斜插进菲律宾海等板块下方，形成了深邃的马里亚纳海沟，同时在另一侧催生出火山岛弧。"
    },
    parentTip: "可以在地图上带孩子数一数太平洋周围的岛弧（千岛群岛、日本列岛、菲律宾群岛），看看它们是不是都像一条条弯弯的项链。"
  },

  // ==================== 2. weather ====================
  {
    id: "rain-shadow-desert",
    realm: "weather",
    emoji: "🌧️",
    title: "为什么山这边大雨倾盆，翻过山就成干旱沙漠？",
    subtitle: "地形雨与雨影效应、世界雨极茂辛拉姆 11872 毫米与最干阿塔卡马沙漠",
    badge: "地形雨 · 雨影效应",
    trigger: "小念看世界降水量之最：印度有个村子一年下近 12 米雨，隔一座山却滴雨难求！",
    difficulty: "starter",
    tags: ["地形雨", "雨影效应", "茂辛拉姆", "阿塔卡马"],
    dialogue: [
      {
        nian: "爸爸，印度东北部那个叫茂辛拉姆的地方，一年降雨 11872 毫米！那不就是四层楼那么高的水吗？",
        dad: "没错，它就是世界著名的“雨极”！印度洋吹来的暖湿气流一头撞上梅加拉亚山地，被陡坡猛推上高空冷却，把肚子里的水全倒了下来。",
        steps: [
          { icon: "💨", label: "湿润海风撞上高山" },
          { icon: "☁️", label: "爬坡变冷凝结暴雨" },
          { icon: "🏜️", label: "翻山变成干燥热风" }
        ]
      },
      {
        nian: "那风翻过山顶去到另一边的时候，水不是都下光了吗？",
        dad: "太敏锐啦！气流翻过山脊往山下沉的时候，越来越干、越来越暖，再也挤不出雨滴了。山背风面这一大块干巴巴的地方，地理上就叫“雨影区”！",
        figure: {
          kind: "bars",
          caption: "地球最湿 vs 最干地方的年平均降水量（毫米）",
          items: [
            { label: "茂辛拉姆(印度)", value: 11872, unit: "mm", color: "#2563eb" },
            { label: "北京年均", value: 600, unit: "mm", color: "#3bb273" },
            { label: "阿塔卡马(智利)", value: 1, unit: "mm", color: "#ea580c" }
          ]
        }
      },
      {
        nian: "世界最干的阿塔卡马沙漠，是不是也躲在大山后面？",
        dad: "对！南美洲智利的阿塔卡马沙漠东边挡着高耸入云的安第斯山脉，阻断了亚马孙湿气；西边又贴着冰冷的秘鲁寒流不爱蒸发，两边夹击让这里几十年都不一定下一场透雨！",
        factBadge: {
          icon: "🔭",
          title: "干到几乎没云，反而成了天文学家天堂",
          detail: "阿塔卡马高原全年晴夜极多，建有世界上最厉害的射电望远镜阵列。"
        }
      },
      {
        nian: "那我们中国也有“雨影效应”吗？比如青藏高原北边？",
        dad: "你猜得太准了！高大的喜马拉雅山和青藏高原把印度洋水汽挡在南边，所以翻过山后的新疆塔克拉玛干沙漠和柴达木盆地就变得非常干燥。",
        factBadge: {
          icon: "🏔️",
          title: "台湾“火烧寮”也是中国著名的地形雨冠军",
          detail: "三面环山面向太平洋开口，迎风坡一年降雨量常超过 6000 毫米。"
        }
      },
      {
        nian: "我懂了！山像一把巨大的“拧水机”，把海风里的水全拧在迎风坡，背风坡只剩干燥的风！",
        dad: "“拧水机”这个词太妙了！以后看地图遇到贴着高山的沙漠，你一眼就能认出谁是“雨影区”。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 世界雨极茂辛拉姆",
        badgeLabel: "年降雨 11872 mm",
        duration: 7,
        camera: { center: [90, 23], lonSpan: 34 },
        zones: [GEO_ZONES.qinghai_tibet],
        routes: [
          {
            id: "bengal-moist",
            label: "印度洋暖湿水汽",
            color: "#2563eb",
            waypoints: [[88, 12], [90, 19], [91.58, 25.3]],
            traveler: "🌧️",
            startAt: 0.1,
            endAt: 0.88
          }
        ],
        markers: [
          {
            id: "mawsynram",
            label: "茂辛拉姆",
            place: "世界雨极 11872mm",
            coord: [91.58, 25.3],
            icon: "🌧️",
            align: "r",
            note: "坐落在迎风坡山地前缘，夏季西南季风送来惊人降水。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 地形雨与雨影动画",
        badgeLabel: "迎风坡湿 · 背风坡干",
        duration: 8,
        kind: "diagram",
        diagram: "rain-shadow",
        camera: { center: [91, 25], lonSpan: 24 }
      },
      {
        turn: 2,
        title: "3 · 安第斯山后的阿塔卡马",
        badgeLabel: "地球最干非极地沙漠",
        duration: 7,
        camera: { center: [-66, -20], lonSpan: 45 },
        zones: [GEO_ZONES.atacama_desert, GEO_ZONES.amazon_rainforest],
        markers: [
          {
            id: "atacama",
            label: "阿塔卡马沙漠",
            place: "智利北部 <1mm/年",
            coord: [-69.5, -23.5],
            icon: "🌵",
            align: "l",
            note: "安第斯山挡住东来水汽，秘鲁寒流又抑制西侧海水蒸发。"
          }
        ],
        myth: {
          wrong: "以为离海很近的地方就一定会经常下雨",
          right: "阿塔卡马紧挨太平洋，却因为寒流与高山双重夹击成了世界最干之地！"
        }
      },
      {
        turn: 3,
        title: "4 · 高原挡出中国西北干区",
        badgeLabel: "青藏高原北侧雨影",
        duration: 7,
        camera: { center: [88, 34], lonSpan: 46 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.qinghai_tibet],
        markers: [
          { id: "taklamakan", label: "塔克拉玛干沙漠", coord: [83, 39], icon: "🏜️", align: "t" },
          { id: "himalaya-wall", label: "喜马拉雅山挡水墙", coord: [86.9, 28.0], icon: "🏔️", align: "b" }
        ]
      },
      {
        turn: 4,
        title: "5 · 一山之隔的旱涝秘密",
        badgeLabel: "看山脉找雨水",
        duration: 6,
        camera: { center: [89, 28], lonSpan: 40 },
        zones: [GEO_ZONES.qinghai_tibet],
        markers: [
          { id: "mawsynram-end", label: "迎风坡雨极", coord: [91.58, 25.3], icon: "🌧️", align: "b" },
          { id: "tibet-dry", label: "山北干旱区", coord: [83, 39], icon: "🏜️", align: "t" }
        ]
      }
    ],
    quiz: {
      prompt: "暖湿海风遇到高山时，哪一侧通常雨水最多、哪一侧容易变干旱？",
      options: [
        "迎风坡雨水多，背风坡（雨影区）干燥",
        "迎风坡干燥，背风坡雨水多",
        "山脚两边雨水一样多，只有山顶下雨"
      ],
      answerIndex: 0,
      explain: "暖湿空气沿着迎风坡爬升遇冷成云致雨，翻过山顶到背风坡时水汽所剩无几又下沉增温，于是形成“雨影区”！"
    },
    parentTip: "烧开水时拿一个冰凉的金属盘子斜放在水壶口上方，孩子能亲眼看到水蒸气“爬坡遇冷”变成雨滴落下来。"
  },
  {
    id: "desert-belt-30deg",
    realm: "weather",
    emoji: "🏜️",
    title: "为什么地球上最大的沙漠总爱排在南北纬 30 度？",
    subtitle: "赤道雨林上升气流、副热带下沉空气环流与撒哈拉、澳洲大沙漠",
    badge: "30° 黄金干带",
    trigger: "小念拿尺子在世界地图上比划，发现撒哈拉、阿拉伯和澳大利亚沙漠竟然排成两道整齐的横带！",
    difficulty: "explorer",
    tags: ["沙漠带", "赤道雨林", "大气环流", "撒哈拉"],
    dialogue: [
      {
        nian: "爸爸太奇怪了！赤道那么晒、那么热，不应该全是沙漠吗？为什么赤道反而是绿油油的热带雨林，沙漠却跑到南北纬 30 度去了？",
        dad: "哈哈，这个问题问到大气科学的命脉了！赤道太阳直射确实最热，可热带海洋蒸发出的潮湿热空气像热气球一样呼呼往上升，升到高空变凉，每天下午噼里啪啦下起大暴雨，把赤道浇成了亚马孙和刚果雨林！",
        steps: [
          { icon: "☀️", label: "赤道热湿空气上升" },
          { icon: "🌧️", label: "升空降温下暴雨成雨林" },
          { icon: "⬇️", label: "干空气在 30° 沉回地面" }
        ]
      },
      {
        nian: "那升上高空拧干水分的空气跑到哪儿去了？",
        dad: "它们在高空向北、向南分头散开，飞到南北纬大约 30 度上空时变得又冷又重，沉回地面！空气往下沉时会被压得越来越暖、越来越干，把云彩全吹散，下面自然就烤出了大沙漠。",
        factBadge: {
          icon: "🔄",
          title: "科学家叫它“哈德莱环流圈”",
          detail: "赤道上升—高空分流—南北纬30°下沉—吹回赤道，构成地球最庞大的空气传送带。"
        }
      },
      {
        nian: "让我找找地图！北纬 30 度附近有撒哈拉沙漠、阿拉伯沙漠，南纬 30 度附近有澳大利亚沙漠和纳米布沙漠！",
        dad: "你全点中了！世界最大的撒哈拉沙漠面积差不多跟整个中国一样大，全靠这条终年受高压下沉气流控制的“副热带无雨带”撑着。",
        figure: {
          kind: "scale",
          caption: "地球从赤道往两极的自然带“条纹规律”",
          stops: [
            { label: "0° 赤道", note: "热空气上升·雨林", color: "#16a34a" },
            { label: "30° 南北纬", note: "干空气下沉·沙漠", color: "#ea580c", hot: true },
            { label: "60° 温带", note: "暖冷交汇·多雨林", color: "#3b82f6" },
            { label: "90° 极地", note: "冷空气沉·冰原", color: "#64748b" }
          ]
        }
      },
      {
        nian: "等一下爸爸！中国江南、杭州、成都也在北纬 30 度呀，为什么我们不是沙漠而是绿洲呢？",
        dad: "哇，这就是下一集要揭秘的大奇迹！因为中国东面紧挨着世界最大的太平洋，每年夏天有庞大的“季风”救星，硬生生打破了 30 度沙漠带的魔咒！"
      },
      {
        nian: "我懂了！赤道忙着上升下雨，南北纬 30 度忙着下沉吹干空气，地球的天气其实是一个循环圈！",
        dad: "讲得太清楚了！你已经学会用全球大气环流看世界地图啦。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 赤道 0° 绿色雨林带",
        badgeLabel: "上升气流 → 天天暴雨",
        duration: 7,
        showTropics: true,
        camera: { center: [-18, 0], lonSpan: 155 },
        zones: [GEO_ZONES.amazon_rainforest, GEO_ZONES.congo_rainforest],
        markers: [
          { id: "amazon-m", label: "亚马孙雨林", coord: [-62, -3], icon: "🌴", align: "t" },
          { id: "congo-m", label: "刚果雨林", coord: [21, 0], icon: "🌴", align: "t" }
        ],
        myth: {
          wrong: "以为赤道阳光最毒，所以赤道应该是一圈大沙漠",
          right: "赤道热湿空气强烈上升造就热带雨林，真正干热的大沙漠在南北纬 30°！"
        }
      },
      {
        turn: 1,
        title: "2 · 哈德莱大气环流圈",
        badgeLabel: "0°上升 · 30°下沉",
        duration: 8,
        kind: "diagram",
        diagram: "hadley-cell",
        camera: { center: [0, 10], lonSpan: 120 }
      },
      {
        turn: 2,
        title: "3 · 全球 30° 沙漠排排队",
        badgeLabel: "撒哈拉 · 阿拉伯 · 澳洲",
        duration: 7,
        showTropics: true,
        camera: { center: [48, 8], lonSpan: 185 },
        zones: [GEO_ZONES.sahara_belt, GEO_ZONES.australia_desert, GEO_ZONES.atacama_desert],
        markers: [
          { id: "sahara-m", label: "撒哈拉沙漠", place: "北纬 20°~30°", coord: [14, 24], icon: "🏜️", align: "t" },
          { id: "arabia-m", label: "阿拉伯沙漠", coord: [46, 22], icon: "🐪", align: "b" },
          { id: "aus-m", label: "澳大利亚沙漠", place: "南纬 25°", coord: [128, -25], icon: "🦘", align: "t" }
        ]
      },
      {
        turn: 3,
        title: "4 · 北纬 30° 上的中国绿洲",
        badgeLabel: "同纬度对比",
        duration: 7,
        showTropics: true,
        camera: { center: [65, 28], lonSpan: 130 },
        zones: [GEO_ZONES.sahara_belt, GEO_ZONES.china_jiangnan],
        markers: [
          { id: "cairo-lat", label: "埃及沙漠 30°N", coord: [30, 29], icon: "🏜️", align: "l" },
          { id: "hangzhou-lat", label: "杭州江南 30°N", coord: [120.15, 30.28], icon: "🍵", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 会呼吸的地球环流",
        badgeLabel: "纬度决定干与湿",
        duration: 6,
        showTropics: true,
        camera: { center: [25, 10], lonSpan: 190 },
        zones: [GEO_ZONES.amazon_rainforest, GEO_ZONES.congo_rainforest, GEO_ZONES.sahara_belt, GEO_ZONES.china_jiangnan]
      }
    ],
    quiz: {
      prompt: "为什么地球上许多大沙漠集中在南北纬 30 度附近，而不是在赤道？",
      options: [
        "赤道上升的空气变干后在南北纬 30 度下沉，云被驱散难以成雨",
        "南北纬 30 度的阳光比赤道还要毒辣很多",
        "因为那里的石头全都是沙子变的"
      ],
      answerIndex: 0,
      explain: "赤道受热空气上升降下暴雨后，高空干燥气流向南北移动并在大约南北纬 30 度处下沉增温，形成副热带高气压沙漠带！"
    },
    parentTip: "可以拿地球仪让孩子找一找北回归线（23.4°N）和北纬30°穿过了哪些地方，对比撒哈拉与中国江南的反差。"
  },
  {
    id: "monsoon-miracle",
    realm: "weather",
    emoji: "🌬️",
    title: "为什么中国江南是鱼米之乡，同纬度的撒哈拉却是大沙漠？",
    subtitle: "海陆热力差异、夏季东南季风送水汽与冬季西北风切换",
    badge: "东亚季风 · 回归线绿洲",
    trigger: "小念沿着北纬 30° 往东划，惊讶地发现沙漠一路从非洲延伸到西亚，进到中国突然变成了水墨画般的江南水乡！",
    difficulty: "explorer",
    tags: ["东亚季风", "江南", "海陆热力", "北回归线绿洲"],
    dialogue: [
      {
        nian: "爸爸，刚刚看到北纬 30 度几乎全是沙漠，怎么偏偏到了我们中国长江中下游，到处是稻田、茶园和小桥流水呀？",
        dad: "中国真是个地理幸运儿！因为东边是世界最大的太平洋，西边是世界最大的亚欧大陆，它们两个脾气不一样——夏天陆地晒得比海水烫得多，热空气往上一升，就把太平洋湿润的空气呼呼吸进中国！",
        steps: [
          { icon: "🔥", label: "夏天大陆升温比海快" },
          { icon: "🌀", label: "海洋湿风吸进内陆" },
          { icon: "🌾", label: "北纬 30° 长成鱼米之乡" }
        ]
      },
      {
        nian: "那到了冬天呢？太平洋是不是反过来比大陆暖和？",
        dad: "对极了！海水像大热水袋一样降温慢，冬天亚欧大陆北边冻成了大冷库，冷空气就从西北方呼呼吹向东南方大海。这种随着夏天、冬天调转方向的大风，就叫“季风”！",
        factBadge: {
          icon: "🌬️",
          title: "雨热同期：庄稼最喜欢的天气",
          detail: "中国夏天又热又多雨，正好赶上水稻和玉米拼命长个子的时候。"
        }
      },
      {
        nian: "原来“梅雨”和夏天的台风雷阵雨，都是太平洋季风送来的水呀！",
        dad: "不止太平洋呢，西南方还有来自印度洋的西南季风，两路水汽合在一起，把中国南方、台湾、珠江三角洲和江南全都浇得绿油油的！"
      },
      {
        nian: "那如果青藏高原没有这么高，季风还会这样吹吗？",
        dad: "你问到科学家最新研究的核心了！高高耸立的青藏高原像一块巨大的“高空大暖炉”和挡风板，把东亚夏季风拽得更北、更旺，让连陕西关中和华北平原都能享受到宝贵的夏雨！"
      },
      {
        nian: "我懂啦！是太平洋的东南季风和印度洋的西南季风，救活了北纬 30 度的中国江南！",
        dad: "记牢啦：世界同纬度大多黄沙漫漫，唯有东亚季风区稻花飘香、生机勃勃。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 同纬度的绿色奇迹",
        badgeLabel: "北纬 30° 超级对比",
        duration: 7,
        showTropics: true,
        camera: { center: [70, 28], lonSpan: 125 },
        zones: [GEO_ZONES.sahara_belt, GEO_ZONES.china_jiangnan],
        routes: [
          {
            id: "summer-se-monsoon",
            label: "夏季东南季风",
            color: "#22c55e",
            waypoints: [[132, 18], [122, 26], [116, 31], [112, 35]],
            traveler: "🌧️",
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "suzhou", label: "江南水乡 31°N", coord: [120.6, 31.3], icon: "🌾", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 夏冬季风大反转",
        badgeLabel: "海陆热力性质差异",
        duration: 8,
        kind: "diagram",
        diagram: "monsoon-flip",
        camera: { center: [115, 30], lonSpan: 50 }
      },
      {
        turn: 2,
        title: "3 · 太平洋与印度洋双水汽",
        badgeLabel: "雨热同期的礼物",
        duration: 7,
        camera: { center: [108, 25], lonSpan: 60 },
        showChinaProvinces: true,
        routes: [
          {
            id: "se-wind",
            label: "东南季风",
            color: "#16a34a",
            waypoints: [[126, 18], [119, 25], [116, 32], [116, 40]],
            traveler: "🌊",
            startAt: 0.05,
            endAt: 0.9
          },
          {
            id: "sw-wind",
            label: "西南季风",
            color: "#0ea5e9",
            waypoints: [[86, 12], [95, 21], [103, 25], [108, 30]],
            traveler: "🌧️",
            startAt: 0.12,
            endAt: 0.92
          }
        ],
        markers: [
          { id: "guangzhou-m", label: "珠三角", coord: [113.26, 23.13], icon: "🌴", align: "b" },
          { id: "shanghai-m", label: "长三角", coord: [121.47, 31.23], icon: "🌾", align: "r" }
        ]
      },
      {
        turn: 3,
        title: "4 · 青藏高原助推季风北上",
        badgeLabel: "地形放大器",
        duration: 7,
        camera: { center: [102, 32], lonSpan: 55 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.qinghai_tibet, GEO_ZONES.china_jiangnan],
        markers: [
          { id: "tibet-heat", label: "青藏高原大暖炉", coord: [89, 33], icon: "🏔️", align: "t" },
          { id: "beijing-rain", label: "华北夏雨", coord: [116.4, 39.9], icon: "🌦️", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 东方绿洲的密码",
        badgeLabel: "海陆相邻 + 季风",
        duration: 6,
        camera: { center: [110, 30], lonSpan: 58 },
        zones: [GEO_ZONES.china_jiangnan],
        markers: [{ id: "hangzhou-end", label: "北纬30°江南绿洲", coord: [120.15, 30.28], icon: "🍵", align: "r" }]
      }
    ],
    quiz: {
      prompt: "中国江南和撒哈拉都在北纬 30 度左右，为什么江南却湿润多雨、盛产水稻？",
      options: [
        "因为中国这里海陆热力差异巨大，夏季有温暖湿润的海洋季风吹来大量水汽",
        "因为中国南方没有山脉",
        "因为撒哈拉海拔比中国高太多"
      ],
      answerIndex: 0,
      explain: "东濒太平洋、背靠亚欧大陆，加上青藏高原的抬升热力作用，造就了强盛的东亚季风，给北纬 30° 的中国送来丰沛夏雨！"
    },
    parentTip: "可以问问孩子：夏天去海边玩，中午踩沙子和踩海水哪个烫？冬天呢？这就是“海陆热力差异”的直接体验！"
  },

  // ==================== 3. china ====================
  {
    id: "china-three-steps",
    realm: "china",
    emoji: "🪜",
    title: "为什么中国的大江大河几乎全往东边流？",
    subtitle: "中国西高东低三级阶梯（>4000米 / 1000-2000米 / <500米）与大江奔海",
    badge: "中国地形 · 三级阶梯",
    trigger: "小念看中国地形图，发现长江、黄河、珠江全都像商量好一样，从西往东奔向大海。",
    difficulty: "starter",
    tags: ["三级阶梯", "青藏高原", "长江", "黄河"],
    dialogue: [
      {
        nian: "爸爸，中国地图上怎么除了西北的几条河，长江、黄河、淮河、珠江全都朝东边的大海流呀？",
        dad: "你把中国地形从西到东切开看就会立刻明白——中国地形就像三层大台阶，西边高高耸起，东边低平宽阔！水往低处流，大河自然一路奔向东边的太平洋啦。",
        steps: [
          { icon: "🏔️", label: "第一级 >4000米" },
          { icon: "🏜️", label: "第二级 1000~2000米" },
          { icon: "🌾", label: "第三级 <500米" }
        ]
      },
      {
        nian: "哇，真的像三层巨人楼梯！第一级台阶是谁？",
        dad: "第一级就是被称为“世界屋脊”和“中华水塔”的青藏高原，平均海拔超过 4000 米！昆仑山、祁连山、横断山脉就是第一级台阶的边边，长江和黄河就从这里出发。",
        figure: {
          kind: "elevation",
          caption: "中国地势三级阶梯示意图（西 → 东）",
          steps: [
            { name: "第一级·青藏高原", height: ">4000m", color: "#a66cff", pct: 100 },
            { name: "第二级·盆地高原", height: "1000-2000m", color: "#ff9f43", pct: 55 },
            { name: "第三级·东部平原", height: "<500m", color: "#3bb273", pct: 24 }
          ]
        }
      },
      {
        nian: "下了一层楼走到第二级，又有哪些高原和盆地呀？",
        dad: "第二级海拔降到 1000 到 2000 米，里面装着大名鼎鼎的四大盆地中的三个（塔里木、准噶尔、四川盆地）和三大高原（内蒙古、黄土、云贵高原）！穿过太行山和巫山，就走下最后一级台阶了。",
        factBadge: {
          icon: "⚡",
          title: "阶梯交界处藏着超级水电站",
          detail: "江水从高台阶摔到低台阶落差巨大，三峡、白鹤滩水电站都建在阶梯交界处！"
        }
      },
      {
        nian: "第三级台阶是不是就是我们住得最多人的东部平原？",
        dad: "对！海拔大多在 500 米以下，东北平原、华北平原、长江中下游平原全在这里，土地又平又肥，大海的湿润水汽也正好能顺着低平的东大门长驱直入！",
        factBadge: {
          icon: "🌾",
          title: "西高东低帮了海风大忙",
          detail: "正因为东边低平、西边高，夏天海风才能一路吹进中国腹地带来雨水。"
        }
      },
      {
        nian: "我明白了！中国就像面朝大海的三级大阶梯，水往东流，海风顺着台阶往西爬！",
        dad: "背得太顺口了：第一级青藏最高，第二级盆地高原，第三级平原入海！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 中国地势三级阶梯图",
        badgeLabel: "西高东低三层台阶",
        duration: 7,
        camera: { center: [104, 35], lonSpan: 56 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.qinghai_tibet, GEO_ZONES.china_step2, GEO_ZONES.china_step3],
        markers: [
          { id: "sanjiangyuan", label: "三江源（中华水塔）", coord: [95.5, 34.0], icon: "💧", align: "t" },
          { id: "shanghai-est", label: "长江入海口", coord: [121.6, 31.3], icon: "🌊", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 西高东低剖面流水",
        badgeLabel: "4000m → 1500m → 500m",
        duration: 8,
        kind: "diagram",
        diagram: "china-steps",
        camera: { center: [104, 35], lonSpan: 56 }
      },
      {
        turn: 2,
        title: "3 · 阶梯交界的峡谷水电",
        badgeLabel: "三峡落差出电能",
        duration: 7,
        camera: { center: [108, 31], lonSpan: 34 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.china_step2, GEO_ZONES.china_step3],
        markers: [
          { id: "sichuan-basin", label: "四川盆地", coord: [105.5, 30.5], icon: "🐼", align: "l" },
          { id: "three-gorges", label: "长江三峡", place: "二三级阶梯分界", coord: [111.0, 30.8], icon: "⚡", align: "r" }
        ]
      },
      {
        turn: 3,
        title: "4 · 富饶的东部大平原",
        badgeLabel: "第三级 <500 米",
        duration: 7,
        camera: { center: [118, 35], lonSpan: 30 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.china_step3],
        markers: [
          { id: "ne-plain", label: "东北平原", coord: [125.3, 44.5], icon: "🌽", align: "r" },
          { id: "nc-plain", label: "华北平原", coord: [116.2, 37.5], icon: "🌾", align: "l" },
          { id: "yz-plain", label: "长江中下游平原", coord: [117.5, 31.0], icon: "🐟", align: "b" }
        ]
      },
      {
        turn: 4,
        title: "5 · 一江春水向东流",
        badgeLabel: "阶梯地形造就山河",
        duration: 6,
        camera: { center: [105, 34], lonSpan: 54 },
        zones: [GEO_ZONES.qinghai_tibet, GEO_ZONES.china_step2, GEO_ZONES.china_step3]
      }
    ],
    quiz: {
      prompt: "如果中国地形反过来变成“东高西低”，会发生什么变化？",
      options: [
        "长江、黄河会往西边流，而且太平洋夏季水汽更难吹进内陆",
        "海水会自己倒流到青藏高原",
        "什么都不会变，河流照样往东流"
      ],
      answerIndex: 0,
      explain: "水往低处流！东高西低不仅会让大河倒流向西，还会把东部变成高墙挡住太平洋湿润夏季风，内陆会干得多。"
    },
    parentTip: "可以用三本厚薄不同的书叠成阶梯，在上面铺一条蓝色丝带代表长江，让孩子直观理解“落差越大水流越急”。"
  },
  {
    id: "qinling-huaihe-line",
    realm: "china",
    emoji: "⛰️",
    title: "秦岭和淮河是怎么把中国分成“南船北马”的？",
    subtitle: "1月0℃等温线、800毫米降水线、南北饮食与建筑密码",
    badge: "中国南北分界线",
    trigger: "小念好奇：为什么南方朋友爱吃米饭、冬天河不结冰，北方家里却常吃面条、冬天要供暖？",
    difficulty: "starter",
    tags: ["秦岭淮河", "南北分界线", "1月0度", "800毫米"],
    dialogue: [
      {
        nian: "爸爸，我听说中国有一条神奇的“南北分界线”，难道地上真的画了一根大白线吗？",
        dad: "地上当然没有白线，但它是一座东西横跨一千多公里的超级大山——秦岭，再连着向东流的淮河！老天爷就顺着这条秦岭—淮河一线，悄悄划出了南方和北方。",
        steps: [
          { icon: "⛰️", label: "秦岭横亘东西挡寒潮" },
          { icon: "🌡️", label: "1月平均 0℃ 等温线" },
          { icon: "🌧️", label: "年降水量 800mm 界线" }
        ]
      },
      {
        nian: "为什么一条山和一条河就能管这么宽呀？",
        dad: "因为秦岭平均两千多米高，像一堵超级挡风墙！冬天北方吹来的刺骨寒潮一撞上秦岭就被挡回大半，所以秦岭—淮河以南 1 月平均气温在 0℃ 以上，河水不结冰，还能常绿；以北在 0℃ 以下，冬天河流会结冰，人们也要烧暖气。",
        figure: {
          kind: "scale",
          caption: "秦岭—淮河一线两侧大不同",
          stops: [
            { label: "北方(以北)", note: "1月<0℃ · 河结冰", color: "#3b82f6" },
            { label: "分界带", note: "0℃ · 800mm线", color: "#ff9f43", hot: true },
            { label: "南方(以南)", note: "1月>0℃ · 不结冰", color: "#22c55e" }
          ]
        }
      },
      {
        nian: "难怪！连房子屋顶、庄稼吃饭也跟着这条线分开吗？",
        dad: "太对了！这条线还正好重合 800 毫米等降水量线：南边雨水多（>800mm），房顶要修得又尖又陡好排水，农田蓄水种水稻吃大米；北边雨水少一些（<800mm），屋顶较平缓，旱地种小麦，大家最爱吃面条、饺子和馒头！",
        factBadge: {
          icon: "🍊",
          title: "橘生淮南则为橘，生于淮北则为枳",
          detail: "两千多年前《晏子春秋》就发现，过了淮河温度变冷，甜橘子就长不好啦！"
        }
      },
      {
        nian: "“南船北马”是不是也是这条线造出来的？",
        dad: "是呀！南方河湖密布又不结冰，出门坐船最方便；北方平原宽阔，古时候骑马赶车跑得最快。其实南北分界并不是一条细线，而是横跨陕西、河南、湖北、安徽、江苏的一条过渡带。"
      },
      {
        nian: "我懂了！秦岭挡住冷空气，又迎住南来水汽，一条秦岭—淮河就把中国南北的温度、雨水和饭碗都分得明明白白！",
        dad: "下次坐高铁跨越陕西宝鸡到汉中，或者跨过淮河，别忘了看窗外树木从落叶变成四季常绿的那一瞬间哦！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 秦岭与淮河牵手画线",
        badgeLabel: "南北分界带",
        duration: 7,
        camera: { center: [112, 33.5], lonSpan: 24 },
        showChinaProvinces: true,
        routes: [
          {
            id: "qinling-huaihe",
            label: "秦岭—淮河分界线",
            color: "#ff6b6b",
            waypoints: [[104.5, 34.0], [107.8, 33.9], [111.5, 33.7], [115.0, 32.8], [119.5, 33.4]],
            traveler: "⛰️",
            dashed: true,
            width: 4,
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "taibai", label: "秦岭太白山", place: "3771m", coord: [107.76, 33.95], icon: "⛰️", align: "t" },
          { id: "bengbu", label: "淮河中游", coord: [117.38, 32.92], icon: "🌊", align: "b" }
        ]
      },
      {
        turn: 1,
        title: "2 · 秦岭挡寒潮大剖面",
        badgeLabel: "1月 0℃ 等温线",
        duration: 8,
        kind: "diagram",
        diagram: "qinling-barrier",
        camera: { center: [110, 33], lonSpan: 24 }
      },
      {
        turn: 2,
        title: "3 · 800mm 降水与米面之分",
        badgeLabel: "北麦面食 · 南稻米饭",
        duration: 7,
        camera: { center: [113, 33], lonSpan: 26 },
        showChinaProvinces: true,
        markers: [
          { id: "xian-wheat", label: "西安 · 面食与小麦", coord: [108.94, 34.26], icon: "🍜", align: "t" },
          { id: "hanzhong-rice", label: "汉中 · 稻田与柑橘", coord: [107.02, 33.07], icon: "🍚", align: "b" },
          { id: "nanjing-rice", label: "江南 · 四季常绿", coord: [118.78, 32.06], icon: "🍊", align: "r" }
        ],
        myth: {
          wrong: "以为中国南北分界线是按长江来划分的",
          right: "自然地理的南北分界是更靠北的“秦岭—淮河”一线，不是长江！"
        }
      },
      {
        turn: 3,
        title: "4 · 南船北马的交通智慧",
        badgeLabel: "自然塑就生活",
        duration: 6,
        camera: { center: [115, 33], lonSpan: 26 },
        showChinaProvinces: true,
        markers: [
          { id: "north-horse", label: "北方旱路平原", coord: [114.5, 36.6], icon: "🐎", align: "t" },
          { id: "south-boat", label: "江南水乡河网", coord: [120.2, 30.8], icon: "⛵", align: "b" }
        ]
      },
      {
        turn: 4,
        title: "5 · 山河绘出的地理密码",
        badgeLabel: "秦岭—淮河全线",
        duration: 6,
        camera: { center: [112, 33.5], lonSpan: 28 },
        showChinaProvinces: true,
        routes: [
          {
            id: "qinling-huaihe-end",
            color: "#ff6b6b",
            waypoints: [[104.5, 34.0], [107.8, 33.9], [115.0, 32.8], [119.5, 33.4]],
            startAt: 0,
            endAt: 1
          }
        ]
      }
    ],
    quiz: {
      prompt: "中国自然地理上“南方和北方”最重要的分界线是哪一条？",
      options: [
        "黄河一线",
        "秦岭—淮河一线（约 1月 0℃ 等温线和 800mm 等降水量线）",
        "长江一线"
      ],
      answerIndex: 1,
      explain: "秦岭阻挡冬季寒潮、拦截夏季水汽，与东侧淮河共同构成 1 月 0℃ 等温线和 800mm 降水线，区分了南方与北方。"
    },
    parentTip: "吃饭时可以跟孩子聊聊“今天吃米还是吃面”，再一起找找老家在秦岭—淮河的南边还是北边。"
  },
  {
    id: "china-landforms",
    realm: "china",
    emoji: "🪨",
    title: "喀斯特、丹霞、黄土高原和吐鲁番盆地是怎么长出来的？",
    subtitle: "桂林溶洞、张掖彩色丘陵、风吹出的黄土与 -154 米中国最低点艾丁湖",
    badge: "中国四大神奇地貌",
    trigger: "小念翻旅游画册看花眼了：怎么有的山像竹笋，有的山像彩虹，新疆居然还有比海平面还低的湖？",
    difficulty: "explorer",
    tags: ["喀斯特", "丹霞", "黄土高原", "吐鲁番盆地"],
    dialogue: [
      {
        nian: "爸爸，桂林山水为什么尖尖的一座座像绿竹笋，山肚子里还藏着能划船的溶洞？",
        dad: "那是大自然用了几百万年“滴水穿石”雕出来的喀斯特地貌！雨水吸收二氧化碳变成弱酸性，把地面整块的石灰岩慢慢溶掉，地面留下一座座孤峰，地下就溶出了钟乳石溶洞和地下河。",
        steps: [
          { icon: "💧", label: "雨水溶解石灰岩" },
          { icon: "⛰️", label: "地上冒出桂林峰林" },
          { icon: "🪨", label: "地下长出钟乳石溶洞" }
        ]
      },
      {
        nian: "那甘肃张掖像打翻颜料盘一样红橙黄绿的山，也是雨水溶出来的吗？",
        dad: "不是哦，张掖丹霞是“水晒出来的彩石饼”！古老的湖盆里一层层积下了含铁的红砂岩和矿物质，抬升成山后再被风吹雨淋削出陡壁，阳光一照就像彩虹落在了地上。",
        factBadge: {
          icon: "🌈",
          title: "中国已有多个丹霞和喀斯特列入世界自然遗产",
          detail: "从广东丹霞山、甘肃张掖到桂林山水、云南石林，都是地球雕塑大师的作品。"
        }
      },
      {
        nian: "我听说黄土高原上的土，居然全是西北风从沙漠里吹过来的，是真的吗？",
        dad: "真的！几百万年来，强盛的西北风卷起中亚和蒙古沙漠的细尘往东南吹，撞上秦岭和太行山就停下脚步落了下来，日积月累堆出厚厚几十到两百米的黄土！后来大雨又把土坡冲成一道道沟壑。",
        figure: {
          kind: "bars",
          caption: "中国陆地最低点与周边盆地海拔对比（米）",
          items: [
            { label: "成都(四川盆地)", value: 500, unit: "m", color: "#3bb273" },
            { label: "吐鲁番艾丁湖", value: -154, unit: "m", color: "#ff6b6b" }
          ]
        }
      },
      {
        nian: "哇，吐鲁番盆地的艾丁湖海拔竟然是负 154 米！大海的水不会倒灌进去吗？",
        dad: "不会呀，因为新疆四周绕着天山等高大山脉，离大海几千公里呢！吐鲁番是一个陷落下去的封闭内陆盆地，热空气窝在里面出不去，所以夏天又特别热，还能种出超甜的葡萄和哈密瓜！",
        factBadge: {
          icon: "🍇",
          title: "坎儿井：沙漠盆地的地下暗渠",
          detail: "人们把天山融雪引到地下暗渠里流进吐鲁番绿洲，这样就不会被烈日晒干啦！"
        }
      },
      {
        nian: "太酷了！水能溶出喀斯特，风能吹出黄土高原，地壳下陷还能造出超甜瓜果的吐鲁番盆地！",
        dad: "风、水、太阳和地壳运动就像大自然手里的四把刻刀，把神州大地雕得千姿百态。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 水溶出来的喀斯特溶洞",
        badgeLabel: "化学溶蚀雕塑",
        duration: 8,
        kind: "diagram",
        diagram: "karst-cave",
        camera: { center: [110, 25], lonSpan: 24 }
      },
      {
        turn: 1,
        title: "2 · 桂林峰林与张掖彩虹山",
        badgeLabel: "南喀斯特 · 北丹霞",
        duration: 7,
        camera: { center: [106, 32], lonSpan: 38 },
        showChinaProvinces: true,
        markers: [
          { id: "guilin", label: "桂林喀斯特", coord: [110.29, 25.27], icon: "⛰️", align: "r" },
          { id: "shilin", label: "云南石林", coord: [103.32, 24.81], icon: "🪨", align: "l" },
          { id: "zhangye", label: "张掖彩色丹霞", coord: [100.45, 38.93], icon: "🌈", align: "t" }
        ]
      },
      {
        turn: 2,
        title: "3 · 风吹出的黄土高原",
        badgeLabel: "风力搬运堆积",
        duration: 7,
        camera: { center: [105, 37], lonSpan: 34 },
        showChinaProvinces: true,
        routes: [
          {
            id: "loess-wind",
            label: "西北风搬运尘土",
            color: "#d97706",
            waypoints: [[95, 43], [103, 39], [109, 36]],
            traveler: "💨",
            dashed: true,
            startAt: 0.1,
            endAt: 0.88
          }
        ],
        markers: [
          { id: "yanan", label: "黄土高原核心区", coord: [109.48, 36.59], icon: "🏜️", align: "r" }
        ],
        myth: {
          wrong: "以为黄土高原的土是黄河水冲出来的",
          right: "黄土高原是几百万年西北风吹来的尘沙堆积而成的！"
        }
      },
      {
        turn: 3,
        title: "4 · 中国最低点：艾丁湖",
        badgeLabel: "海拔 -154 米",
        duration: 7,
        camera: { center: [89, 42.5], lonSpan: 22 },
        showChinaProvinces: true,
        markers: [
          {
            id: "ayding",
            label: "吐鲁番艾丁湖",
            place: "海拔 -154m",
            coord: [89.25, 42.66],
            icon: "🍇",
            align: "b",
            note: "仅次于死海和阿萨勒湖的世界陆地低洼地之一，靠坎儿井引天山雪水灌溉。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 大自然的四把刻刀",
        badgeLabel: "中国地貌巡礼",
        duration: 6,
        camera: { center: [103, 35], lonSpan: 48 },
        showChinaProvinces: true,
        markers: [
          { id: "ayding-end", label: "吐鲁番 -154m", coord: [89.25, 42.66], icon: "🍇", align: "t" },
          { id: "zhangye-end", label: "张掖丹霞", coord: [100.45, 38.93], icon: "🌈", align: "t" },
          { id: "yanan-end", label: "黄土高原", coord: [109.48, 36.59], icon: "💨", align: "r" },
          { id: "guilin-end", label: "桂林喀斯特", coord: [110.29, 25.27], icon: "⛰️", align: "b" }
        ]
      }
    ],
    quiz: {
      prompt: "中国海拔最低（-154 米）且靠“坎儿井”引天山雪水种出甜葡萄的地方在哪里？",
      options: [
        "四川盆地",
        "新疆吐鲁番盆地艾丁湖",
        "云南石林"
      ],
      answerIndex: 1,
      explain: "吐鲁番盆地中的艾丁湖湖面低于海平面约 154 米，是中国陆地最低点，坎儿井把天山雪水藏进地下暗渠防蒸发。"
    },
    parentTip: "用吸管轻轻吹面粉堆到一本书边上，积起来的小粉堆就是风力堆积形成“黄土高原”的微缩版！"
  }
];
