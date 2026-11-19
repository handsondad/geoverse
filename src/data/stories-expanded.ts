import { GEO_ZONES } from "./realms.ts";
import type { GeoStory } from "./types.ts";

/** 第 1 站入门第 1 课：看懂地球仪、经纬网与地图变形 */
export const introGeoStories: readonly GeoStory[] = [
  {
    id: "globe-grid-mercator",
    realm: "sky",
    emoji: "🌐",
    title: "怎么看懂地球仪上的经纬网？为什么平面地图上的格陵兰岛看着像非洲一样大？",
    subtitle: "经纬坐标门牌号、墨卡托投影变形（非洲竟是格陵兰 14 倍！）与大圆最短航线",
    badge: "地理第 1 课 · 经纬网与地球仪",
    trigger: "小念一手转着地球仪、一手铺开世界挂图，惊讶地喊：“咦！地图上格陵兰岛跟非洲差不多大，地球仪上怎么缩成一小块啦？”",
    difficulty: "starter",
    tags: ["地球仪", "经纬网", "墨卡托投影", "大圆航线"],
    dialogue: [
      {
        nian: "爸爸你看！地球仪上横着一圈圈、竖着一道道的格子线，是不是给地球画的“棋盘”呀？",
        dad: "太形象了！横着绕地球的叫“纬线”，最中间最胖那圈是 0° 赤道，往北叫北纬、往南叫南纬；竖着连起南北极的叫“经线”，穿过伦敦格林威治的是 0° 本初子午线。两条线一交叉，就成了地球上每个地方独一无二的“门牌号”！",
        steps: [
          { icon: "➖", label: "纬线横圈定南北" },
          { icon: "↕️", label: "经线竖弧定东西" },
          { icon: "📍", label: "经纬相交找坐标" }
        ]
      },
      {
        nian: "原来经纬线是门牌号！那为什么我把圆滚滚的地球仪摊平画在挂图上，北边格陵兰岛看着跟非洲一样大呢？",
        dad: "你发现了地图史上最著名的“魔术变形”！试试把剥下来的橘子皮压平——不撕裂就必须拼命拉扯两头！1569 年墨卡托画的航海地图为了保持方向角不变，把越靠近南北极的陆地拉得越肥大，其实非洲面积有 3030 万平方公里，是格陵兰岛的将近 14 倍呢！",
        figure: {
          kind: "bars",
          caption: "真实面积大揭秘：谁才是“地图胖子”？（万平方公里）",
          items: [
            { label: "非洲真实面积", value: 3030, unit: "万km²", color: "#f59e0b" },
            { label: "中国陆地面积", value: 960, unit: "万km²", color: "#ef4444" },
            { label: "格陵兰岛真实面积", value: 217, unit: "万km²", color: "#38bdf8" }
          ]
        }
      },
      {
        nian: "哇，非洲竟然是格陵兰岛的 14 倍！既然平面地图会骗人，那飞机跨越大洋时是不是也得看地球仪找近路？",
        dad: "太聪明了！从北京飞纽约，在平面地图上看直线好像该横穿太平洋，但在圆地球仪上拉一根细绳就会发现：贴着北极边缘飞的“大圆弧线”才是最短距离，能省下上千公里油呢！",
        factBadge: {
          icon: "✈️",
          title: "地球仪上拉紧的细绳 = 球面最短航线",
          detail: "球面上两点间的最短路线是大圆劣弧；在平面地图上画出来反而像一道弯弯的彩虹拱！"
        }
      },
      {
        nian: "那我用经纬度门牌号找我们首都北京，应该怎么报坐标呀？",
        dad: "北京大约在北纬 39.9 度、东经 116.4 度（39.9°N, 116.4°E）！学会读经纬坐标，无论在 3D 地球仪还是卫星导航里，几秒钟就能精准定位地球上的任何一座雪山、海岛和城市！",
        factBadge: {
          icon: "🌐",
          title: "去 3D 交互地球仪亲手试一试",
          detail: "打开站内的「3D 逼真地球仪工作台」，亲手转动地球对比格陵兰与非洲，还能拉出北京飞纽约的大圆航线！"
        }
      },
      {
        nian: "我懂了！经纬网给地球标出门牌号，平面地图会拉大靠近两极的地方，只有圆地球仪才能看见最真实的大小和最短航线！",
        dad: "恭喜拿到地理探索第一把金钥匙！带着这双“地球仪慧眼”，咱们就可以开始环游六大地理站啦！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 给地球编上经纬门牌号",
        badgeLabel: "赤道 0° · 本初子午线",
        duration: 7,
        camera: { center: [20, 15], lonSpan: 240 },
        showTropics: true,
        markers: [
          {
            id: "greenwich-0",
            label: "格林威治 0°经线",
            place: "东西经起点",
            coord: [0, 51.5],
            icon: "🕒",
            align: "t",
            note: "穿过伦敦格林威治天文台的经线规定为 0° 本初子午线。"
          },
          {
            id: "beijing-coord",
            label: "北京 39.9°N, 116.4°E",
            place: "中国首都坐标",
            coord: [116.4, 39.9],
            icon: "🏮",
            align: "r",
            note: "北纬 39.9 度、东经 116.4 度，东半球北半球中纬度。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 揭穿地图变形：非洲 vs 格陵兰",
        badgeLabel: "真实面积差 14 倍",
        duration: 8,
        kind: "diagram",
        diagram: "mercator-distortion",
        camera: { center: [0, 25], lonSpan: 150 },
        myth: {
          wrong: "以为格陵兰岛和非洲差不多大",
          right: "平面投影拉大了高纬度，非洲真实面积是格陵兰的近 14 倍！"
        }
      },
      {
        turn: 2,
        title: "3 · 飞越北极的最短大圆航线",
        badgeLabel: "球面直飞省千里",
        duration: 7,
        camera: { center: [-155, 54], lonSpan: 175 },
        routes: [
          {
            id: "bj-nyc-arc",
            label: "北京 → 纽约极地大圆航线",
            color: "#ef4444",
            waypoints: [[116.4, 39.9], [140, 62], [-165, 76], [-110, 68], [-74, 40.7]],
            traveler: "✈️",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.92
          }
        ],
        markers: [
          {
            id: "bj-arc-pin",
            label: "北京",
            place: "39.9°N, 116.4°E",
            coord: [116.4, 39.9],
            icon: "🛫",
            align: "b",
            note: "从北京直飞纽约，往北跨过北冰洋边缘比横穿太平洋短得多！"
          },
          {
            id: "nyc-arc-pin",
            label: "纽约",
            place: "40.7°N, 74.0°W",
            coord: [-74.0, 40.7],
            icon: "🛬",
            align: "b",
            note: "两地大圆航线约 1.1 万公里，在平面地图上弯成高高北拱。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 用坐标秒定位世界奇观",
        badgeLabel: "读懂 39.9°N, 116.4°E",
        duration: 7,
        camera: { center: [105, 35], lonSpan: 56 },
        showChinaProvinces: true,
        markers: [
          {
            id: "bj-loc",
            label: "北京 (39.9°N, 116.4°E)",
            place: "华北平原北端",
            coord: [116.4, 39.9],
            icon: "📍",
            align: "r",
            note: "记住北纬 N、南纬 S、东经 E、西经 W，就能读懂全世界坐标。"
          },
          {
            id: "sh-loc",
            label: "上海 (31.2°N, 121.5°E)",
            place: "长江入海口",
            coord: [121.5, 31.2],
            icon: "🏙️",
            align: "r",
            note: "比北京更靠南 8.7 个纬度、更靠东 5.1 个经度。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 转动 3D 地球仪出发吧",
        badgeLabel: "地理探索第 1 课完成",
        duration: 6,
        camera: { center: [20, 15], lonSpan: 240 },
        showTropics: true
      }
    ],
    quiz: {
      prompt: "为什么在常见的平面世界地图上，格陵兰岛看起来和非洲差不多大？",
      options: [
        "因为格陵兰岛冬天结冰面积真的变大了 14 倍",
        "因为把圆球面强行摊平（墨卡托投影）会大幅拉宽靠近南北极的地区，其实非洲是格陵兰的近 14 倍",
        "因为画地图的人不小心把格陵兰画错了"
      ],
      answerIndex: 1,
      explain: "把球面展成平面必然变形，墨卡托投影越靠近高纬度放大越严重，转动圆地球仪才能看到各大陆真实的面积比例！"
    },
    parentTip: "可以剥开一只橘子，让孩子试着把完整橘子皮压平在桌子上——立刻就能明白为什么平面地图一定会拉伸变形，再带他打开本站的「3D 逼真地球仪」亲手转着对比格陵兰和非洲！",
    sources: [
      { title: "National Geographic Education · Selecting a Map Projection", url: "https://education.nationalgeographic.org/resource/selecting-map-projection/" },
      { title: "Britannica Kids · Why Does Greenland Look So Big on Some Maps?", url: "https://kids.britannica.com/scholars/article/Why-Does-Greenland-Look-So-Big-on-Some-Maps/702394" }
    ]
  }
];

/** 权威资料核验扩充的 6 集地理动画故事（覆盖六大展厅，并补齐挑战 difficulty="master" 阶梯） */
export const expandedGeoStories: readonly GeoStory[] = [
  // ==================== 1. tectonics ====================
  {
    id: "east-africa-rift",
    realm: "tectonics",
    emoji: "🌋",
    title: "非洲真的会裂成两半，中间长出一片新海洋吗？",
    subtitle: "三千公里东非大裂谷、坦噶尼喀深湖与红海的“年轻大洋”现场",
    badge: "东非大裂谷 · 新海洋诞生",
    trigger: "小念在卫星地图上发现非洲东边有一道长长的“拉链”疤痕，里面嵌着一串又细又深的湖泊！",
    difficulty: "master",
    tags: ["东非大裂谷", "板块张裂", "红海", "坦噶尼喀湖"],
    dialogue: [
      {
        nian: "爸爸你看非洲东边！为什么从红海一路往南，大地上像被拉链划开了一道三千公里长的大裂口？",
        dad: "那正是地球陆地上最壮观的“东非大裂谷”！下面滚烫的地幔柱把非洲地壳顶得变薄，又往东西两边慢慢拉开，努比亚板块和索马里板块正像掰开的饼干一样分家呢。",
        steps: [
          { icon: "🔥", label: "地幔热流拱起地壳" },
          { icon: "⚡", label: "陆地拉薄断裂下陷" },
          { icon: "🌊", label: "海水灌入诞生新大洋" }
        ]
      },
      {
        nian: "两个板块分家速度有多快？我们明天醒来非洲就会裂开吗？",
        dad: "哈哈，别担心！卫星测出东非大裂谷每年只拉开大约 1 到 5 毫米，还没你剪指甲长得快。但地质时间有几千万年，只要一直拉下去，未来真的会把非洲之角拆成一座海上大岛！",
        factBadge: {
          icon: "🛰️",
          title: "阿法尔三联点：大洋诞生的排练场",
          detail: "埃塞俄比亚的阿法尔洼地正处在红海、亚丁湾与东非裂谷三条裂缝交汇处，常出现岩浆裂缝。"
        }
      },
      {
        nian: "裂谷里这一长串细长的湖泊，也是地面裂开后陷下去装满水变成的吗？",
        dad: "太聪明了！大裂谷塌陷出的深沟接满雨水，造出了非洲最深的坦噶尼喀湖。它足足有 670 公里长、最深处达到 1470 米，是世界第二深淡水湖，装了全球约六分之一的淡水！",
        figure: {
          kind: "bars",
          caption: "世界最深湖泊大比拼（最大水深，米）",
          items: [
            { label: "贝加尔湖(裂谷湖)", value: 1642, unit: "m", color: "#2563eb" },
            { label: "坦噶尼喀湖(东非)", value: 1470, unit: "m", color: "#2aa89b" },
            { label: "里海(内陆咸海)", value: 1025, unit: "m", color: "#ff9f43" }
          ]
        }
      },
      {
        nian: "既然坦噶尼喀湖这么深，那它北边细细长长的红海，是不是已经裂开让海水灌进去啦？",
        dad: "正中靶心！阿拉伯板块和非洲板块早在几千万年前就先裂开了一步，印度洋海水一涌而入，红海其实就是一座正在长大的“宝宝版大西洋”！",
        factBadge: {
          icon: "🌊",
          title: "红海正在一点点变宽",
          detail: "红海海底中间已经长出了新的玄武岩洋壳，证明东非大裂谷的未来正是另一片广阔大洋。"
        }
      },
      {
        nian: "我懂了！东非大裂谷就像大西洋的童年，板块拉张先出深谷裂谷湖，等海水灌进去就会长出新海洋！",
        dad: "总结得像地质学家一样清楚！地球的大陆和海洋永远在轮流出生、长大与重逢。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 非洲大地上的拉链",
        badgeLabel: "3000公里东非大裂谷",
        duration: 7,
        camera: { center: [36, 2], lonSpan: 48 },
        zones: [GEO_ZONES.east_africa_rift],
        routes: [
          {
            id: "ear-line",
            color: "#ef4444",
            waypoints: [[41, 12], [38.5, 7], [36, -1.5], [35, -10], [34.5, -18]],
            traveler: "🌋",
            dashed: true,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "afar-tri",
            label: "阿法尔三角",
            place: "三大裂谷交汇处",
            coord: [41.0, 11.8],
            icon: "♨️",
            align: "r",
            note: "红海、亚丁湾与东非大裂谷在这里交汇，岩浆活动十分活跃。"
          },
          {
            id: "kenya-rift",
            label: "东非大裂谷",
            place: "每年拉开约 1~5 毫米",
            coord: [36.0, -1.5],
            icon: "🌋",
            align: "l",
            note: "索马里板块正缓慢向东漂离非洲大陆主体的努比亚板块。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 从裂谷到新大洋动画",
        badgeLabel: "陆地裂开 → 海水灌入",
        duration: 8,
        kind: "diagram",
        diagram: "rift-ocean",
        camera: { center: [36, 2], lonSpan: 48 },
        myth: {
          wrong: "以为大洋一开始就那么宽",
          right: "大洋都是从大陆裂谷一点点拉宽、灌入海水长大的！"
        }
      },
      {
        turn: 2,
        title: "3 · 1470米深的坦噶尼喀湖",
        badgeLabel: "世界第二深淡水湖",
        duration: 7,
        camera: { center: [32, -5], lonSpan: 24 },
        markers: [
          {
            id: "tanganyika",
            label: "坦噶尼喀湖",
            place: "长670km · 深1470m",
            coord: [29.6, -6.2],
            icon: "💧",
            align: "l",
            note: "嵌在东非大裂谷西支深沟里的超深湖泊，蕴藏全球约 17% 的淡水。"
          },
          {
            id: "victoria-lake",
            label: "维多利亚湖",
            place: "东非最大淡水湖",
            coord: [33.0, -1.2],
            icon: "🌊",
            align: "r",
            note: "夹在东西两支裂谷之间的浅盆大湖，也是白尼罗河的重要水源。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 正在长大的红海",
        badgeLabel: "宝宝版年轻大洋",
        duration: 7,
        camera: { center: [40, 18], lonSpan: 34 },
        routes: [
          {
            id: "red-sea-open",
            color: "#0ea5e9",
            waypoints: [[34, 27], [38.5, 20], [43.3, 12.6], [49, 13.5]],
            traveler: "🌊",
            width: 3.5,
            startAt: 0.1,
            endAt: 0.88
          }
        ],
        markers: [
          {
            id: "red-sea-pin",
            label: "红海",
            place: "非洲与阿拉伯板块裂缝",
            coord: [38.5, 20.0],
            icon: "🌊",
            align: "l",
            note: "地壳彻底裂透后印度洋海水涌入，形成了年轻而狭长的红海。"
          },
          {
            id: "aden-gulf",
            label: "亚丁湾",
            place: "通向印度洋的裂口",
            coord: [47.5, 13.0],
            icon: "⚓",
            align: "b",
            note: "海水正沿着亚丁湾与红海向阿法尔洼地一步步逼近。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 看见未来的新大洋",
        badgeLabel: "威尔逊旋回现场",
        duration: 6,
        camera: { center: [38, 4], lonSpan: 64 },
        zones: [GEO_ZONES.east_africa_rift]
      }
    ],
    quiz: {
      prompt: "地质学家为什么把“红海”看作东非大裂谷的未来模样？",
      options: [
        "因为红海的水是红色的",
        "因为红海也是板块拉张裂开后、被海水灌入形成的年轻海洋",
        "因为红海比马里亚纳海沟还深"
      ],
      answerIndex: 1,
      explain: "阿拉伯板块与非洲板块率先裂开并涌入海水形成了红海，向我们展示了裂谷演变成大洋的真实过程！"
    },
    parentTip: "可以拿一块软橡皮泥从两边慢慢往外拉：中间会先变薄下陷出一条深沟（裂谷），再继续拉就会彻底断开，孩子一眼就能懂大陆怎么裂出新海洋。",
    sources: [
      { title: "USGS · Seismicity of the Earth: East African Rift System", url: "https://pubs.usgs.gov/of/2010/1083/p/pdf/ofr2010-1083p.pdf" },
      { title: "NASA Earth Observatory · A Tale of Contrasting Rift Valley Lakes", url: "https://science.nasa.gov/earth/earth-observatory/a-tale-of-contrasting-rift-valley-lakes-145194/" }
    ]
  },

  // ==================== 2. weather ====================
  {
    id: "el-nino-pacific",
    realm: "weather",
    emoji: "🌊",
    title: "太平洋海水才变暖两三度，怎么能让半个地球的天气都乱套？",
    subtitle: "赤道信风、“暖水跷跷板”、厄尔尼诺与拉尼娜的全球蝴蝶效应",
    badge: "厄尔尼诺 · 海气跷跷板",
    trigger: "新闻里说今年是“厄尔尼诺年”，澳大利亚闹干旱、秘鲁却发大水，小念奇怪太平洋发烧怎么管这么宽。",
    difficulty: "master",
    tags: ["厄尔尼诺", "拉尼娜", "太平洋信风", "极端天气"],
    dialogue: [
      {
        nian: "爸爸，天气预报老说“厄尔尼诺”来了，太平洋海水才高两三度，怎么连陆地上的旱涝都跟着变呀？",
        dad: "因为热带太平洋大得像半个地球！平时沿着赤道从东往西吹的“信风”，会把晒热的海水全推到西边的印尼附近，把那里的海平面都堆高出将近半米呢！",
        steps: [
          { icon: "🌬️", label: "正常年份信风向西吹" },
          { icon: "🔥", label: "暖水堆在西太平洋" },
          { icon: "🌧️", label: "暖海蒸发催生暴雨云" }
        ]
      },
      {
        nian: "西边的海平面都被信风堆高半米啦？那东边的秘鲁海边不会少了很多暖水吗？",
        dad: "问到点子上了！秘鲁表层暖水被吹走后，海底冰凉又富含养分的冷水立刻冒上来补位，养肥了超级大渔场。可一旦每隔几年信风突然偷懒变弱，西边堆高的大片暖水就会“哗啦”倒流回东边！",
        figure: {
          kind: "bars",
          caption: "正常年份赤道太平洋东西两侧暖水层厚度对比（米）",
          items: [
            { label: "西太平洋(印尼侧)", value: 150, unit: "m", color: "#ef4444" },
            { label: "东太平洋(秘鲁侧)", value: 30, unit: "m", color: "#3b82f6" }
          ]
        }
      },
      {
        nian: "西边暖水倒流回东边，这就是厄尔尼诺吗？那原先在西边下的大雨也会跟着搬家？",
        dad: "完全正确！哪里的海水热，哪里就拼命蒸发长出大积雨云。暖水搬家到中东太平洋后，原本湿润的印尼和澳大利亚变得干巴巴容易起山火，原本干旱的秘鲁沿海却迎来暴雨，冷水鱼也饿得游走了！",
        factBadge: {
          icon: "🐟",
          title: "“厄尔尼诺”原本是秘鲁渔民取的名字",
          detail: "因为暖水常在圣诞节前后赶跑冷水鱼群，西班牙语里叫它“圣婴”（El Niño）。"
        }
      },
      {
        nian: "既然暖水搬家向东跑叫厄尔尼诺，那如果信风哪一年吹得特别起劲，是不是也有个反过来的名字？",
        dad: "有呀！那叫“拉尼娜”，意思是“小女孩”。拉尼娜年信风猛吹，把暖水更狠地压向西太平洋，东边冷水更凉，大气环流被拨向另一头，常常带来更猛的台风或寒潮。",
        factBadge: {
          icon: "⚖️",
          title: "太平洋上的“暖水跷跷板”",
          detail: "厄尔尼诺（东暖）和拉尼娜（东冷）像秋千一样交替摆动，合称 ENSO 现象。"
        }
      },
      {
        nian: "我懂了！海洋和风一直在玩跷跷板，信风一变弱暖水就向东倒流，把整片雨云和全球天气都带偏了！",
        dad: "讲得太透彻了！别小看海水两三度的冷暖变化，太平洋轻轻打个喷嚏，全世界的天气都会跟着晃一晃。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 正常年份：信风把暖水推向西",
        badgeLabel: "西暖东冷的太平洋",
        duration: 7,
        camera: { center: [-170, 0], lonSpan: 175 },
        showTropics: true,
        zones: [GEO_ZONES.west_pacific_warm_pool, GEO_ZONES.east_pacific_cold_tongue],
        routes: [
          {
            id: "trade-winds-normal",
            color: "#0ea5e9",
            waypoints: [[-95, -2], [-140, -2], [175, -2], [135, -2]],
            traveler: "🌬️",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "indo-warm",
            label: "印尼暖池",
            place: "海面高出约 46 厘米",
            coord: [128, -2],
            icon: "🌧️",
            align: "l",
            note: "正常年份信风把表层暖水推到这里，暖水层厚约 150 米，降水丰沛。"
          },
          {
            id: "peru-cold",
            label: "秘鲁冷水渔场",
            place: "深海冷水上涌",
            coord: [-81, -8],
            icon: "🐟",
            align: "r",
            note: "深层营养冷水上涌养活了大量鳀鱼与海鸟。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 太平洋暖水跷跷板动画",
        badgeLabel: "正常态 ↔ 厄尔尼诺态",
        duration: 8,
        kind: "diagram",
        diagram: "el-nino-seesaw",
        camera: { center: [-170, 0], lonSpan: 175 },
        myth: {
          wrong: "以为海水变暖两三度没啥大影响",
          right: "整个热带太平洋变暖两三度，会移走大片雨带扰乱全球天气！"
        }
      },
      {
        turn: 2,
        title: "3 · 厄尔尼诺：暖水东流雨带搬家",
        badgeLabel: "西旱东涝大反转",
        duration: 7,
        camera: { center: [-170, -4], lonSpan: 175 },
        routes: [
          {
            id: "elnino-slosh",
            color: "#ef4444",
            waypoints: [[135, 0], [175, 0], [-140, 0], [-85, -4]],
            traveler: "🔥",
            width: 4,
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "aus-drought",
            label: "澳洲与印尼偏旱",
            place: "暖水撤离雨水减少",
            coord: [134, -20],
            icon: "☀️",
            align: "b",
            note: "暖水东移后，西太平洋下沉气流增强，干旱和山火风险上升。"
          },
          {
            id: "peru-flood",
            label: "秘鲁沿岸暴雨",
            place: "异常暖水压住冷水",
            coord: [-80, -6],
            icon: "⛈️",
            align: "r",
            note: "暖海面带来强对流暴雨，深海冷水上涌受阻，渔业减产。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 拉尼娜：信风加倍向西吹",
        badgeLabel: "东冷更冷 · 西暖更暖",
        duration: 7,
        camera: { center: [-170, 0], lonSpan: 175 },
        zones: [GEO_ZONES.west_pacific_warm_pool, GEO_ZONES.east_pacific_cold_tongue],
        routes: [
          {
            id: "lanina-wind",
            color: "#2563eb",
            waypoints: [[-85, 0], [-135, 0], [175, 0], [125, 0]],
            traveler: "💨",
            width: 4,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "wp-storm",
            label: "西太平洋暴雨更旺",
            place: "暖水池进一步加深",
            coord: [130, 6],
            icon: "🌀",
            align: "t",
            note: "拉尼娜年西太平洋海温偏高，水汽和台风活动常常更活跃。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 海气联手指挥全球天气",
        badgeLabel: "ENSO 气候摆钟",
        duration: 6,
        camera: { center: [-165, 2], lonSpan: 220 },
        showTropics: true
      }
    ],
    quiz: {
      prompt: "发生厄尔尼诺现象时，赤道太平洋的信风和暖水会发生什么变化？",
      options: [
        "信风突然变强，把暖水吹进北冰洋",
        "信风减弱，西太平洋堆积的暖水向中东太平洋倒流",
        "太平洋的海水全部结冰"
      ],
      answerIndex: 1,
      explain: "厄尔尼诺期间赤道信风减弱，原本堆在西太平洋的温暖表层海水向东回流，带动降雨带东移并抑制秘鲁冷水上涌。"
    },
    parentTip: "可以在长方形透明水盆里倒点水，用吸管顺着水面朝一头轻轻吹气：水面会在下风头堆高；一松口停吹，水立刻哗地涌回另一头——这就是厄尔尼诺“暖水回流”的缩小版！",
    sources: [
      { title: "NOAA Climate.gov · El Niño and La Niña FAQ", url: "https://www.climate.gov/news-features/understanding-climate/el-nino-and-la-nina-frequently-asked-questions" },
      { title: "NOAA JetStream · Effects of ENSO in the Pacific", url: "https://www.noaa.gov/jetstream/tropical/enso/enso-patterns" }
    ]
  },

  // ==================== 3. china ====================
  {
    id: "hu-huanyong-line",
    realm: "china",
    emoji: "🗺️",
    title: "地图上一条斜线，为什么把中国九成多的人口都划在了东南边？",
    subtitle: "黑河—腾冲“胡焕庸线”、400 毫米等降水量线与农耕游牧分界",
    badge: "胡焕庸线 · 400mm降水线",
    trigger: "小念看夜晚的中国卫星灯光图：东南边亮成一片星海，西北边却只有零星光点，中间像被尺子斜着切了一刀！",
    difficulty: "explorer",
    tags: ["胡焕庸线", "400毫米降水线", "黑河腾冲", "中国人口"],
    dialogue: [
      {
        nian: "爸爸你看夜景卫星图！为什么中国东南半边亮闪闪的全是城市灯光，西北半边却黑漆漆的像隔了一道斜线？",
        dad: "你一眼就认出了大名鼎鼎的“胡焕庸线”！1935 年地理学家胡焕庸从东北黑龙江黑河画直线连到西南云南腾冲，发现东南 43% 左右的土地竟住着超过九成的中国人！",
        steps: [
          { icon: "📍", label: "北起黑龙江黑河" },
          { icon: "📏", label: "45° 斜穿中国版图" },
          { icon: "📍", label: "南到云南腾冲" }
        ]
      },
      {
        nian: "九成多的人都挤在胡焕庸线东南边！九十年过去了，这个比例还没有变吗？",
        dad: "几乎稳如泰山！根据 2020 年第七次全国人口普查，东南半壁 43.2% 的国土仍然住着 93.5% 的人口，西北半壁 56.8% 的辽阔大地只住着 6.5% 的人口，全国 18 座千万人口大城全在东南边！",
        figure: {
          kind: "bars",
          caption: "胡焕庸线东南半壁 vs 西北半壁对比（七普数据，%）",
          items: [
            { label: "东南·人口占比", value: 93.5, unit: "%", color: "#16a34a" },
            { label: "东南·国土占比", value: 43.2, unit: "%", color: "#6bcb77" },
            { label: "西北·国土占比", value: 56.8, unit: "%", color: "#f59e0b" },
            { label: "西北·人口占比", value: 6.5, unit: "%", color: "#ea580c" }
          ]
        }
      },
      {
        nian: "西北半壁土地那么宽敞，为什么大家不搬过去住，是不是那里的水太少了？",
        dad: "一针见血！胡焕庸线其实和一条看不见的天然气候线高度重合——中国 400 毫米年等降水量线！东南边受夏季风照顾，雨水足、平原多，适合种庄稼养大城；西北边深居内陆又有高山挡风，雨水稀少，多是草原、戈壁和雪山高原。",
        factBadge: {
          icon: "🌧️",
          title: "400 毫米等降水量线：农耕与游牧分界",
          detail: "年降水多于 400 毫米才能稳定发展旱作农耕，少于 400 毫米则主要适合草原畜牧与绿洲农业。"
        }
      },
      {
        nian: "那在 400 毫米线以西的西北大地上，城市和人是不是全靠雪山融水找地方住？",
        dad: "没错！你看甘肃的河西走廊和新疆的天山脚下，丝绸之路上的兰州、武威、敦煌、乌鲁木齐，就像串在雪水河流边的一颗颗翡翠绿洲，所以夜景灯光在西北总排成一条条亮线！",
        factBadge: {
          icon: "🏔️",
          title: "绿洲撑起西北明珠",
          detail: "祁连山和天山的冰川融水浇灌出河西走廊与天山北坡，孕育了千年丝路重镇。"
        }
      },
      {
        nian: "我懂了！东南靠 400 毫米雨水平原养大城，西北靠雪水绿洲串丝路，胡焕庸线原来是大自然画出的密码！",
        dad: "太棒了！读懂了胡焕庸线和秦岭—淮河线，你就掌握了看懂中国人口、农业和气候的两把金钥匙。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 黑河到腾冲的45°斜线",
        badgeLabel: "1935年胡焕庸线",
        duration: 7,
        camera: { center: [105, 39], lonSpan: 62 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.china_northwest_dry, GEO_ZONES.china_southeast_dense],
        routes: [
          {
            id: "hu-line-route",
            label: "黑河—腾冲线",
            color: "#dc2626",
            waypoints: [[127.5, 50.25], [116, 41], [108, 34], [98.5, 25.02]],
            traveler: "📏",
            dashed: true,
            width: 3.5,
            startAt: 0.08,
            endAt: 0.88
          }
        ],
        markers: [
          {
            id: "heihe",
            label: "黑龙江黑河",
            place: "胡焕庸线东北起点",
            coord: [127.53, 50.25],
            icon: "📍",
            align: "r",
            note: "位于东北中俄边境黑龙江畔，是胡焕庸线的北端起点。"
          },
          {
            id: "tengchong",
            label: "云南腾冲",
            place: "胡焕庸线西南终点",
            coord: [98.49, 25.02],
            icon: "📍",
            align: "l",
            note: "位于云南西部横断山南端，是胡焕庸线的南端终点。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 人口与国土的天平动画",
        badgeLabel: "43%土地 ⇄ 93.5%人口",
        duration: 8,
        kind: "diagram",
        diagram: "hu-line-balance",
        camera: { center: [105, 36], lonSpan: 56 },
        myth: {
          wrong: "以为全国人口差不多平均分布",
          right: "九成多人口集中在胡焕庸线东南 43% 的湿润平原丘陵区！"
        }
      },
      {
        turn: 2,
        title: "3 · 400mm等雨线贴合秘密",
        badgeLabel: "季风区 vs 非季风区",
        duration: 7,
        camera: { center: [106, 36], lonSpan: 52 },
        showChinaProvinces: true,
        routes: [
          {
            id: "isohyet-400",
            color: "#2563eb",
            waypoints: [[121, 49], [115, 41], [104, 36], [91, 29.6]],
            traveler: "🌧️",
            width: 3.5,
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "lanzhou-hu",
            label: "兰州",
            place: "紧挨400mm降水线",
            coord: [103.83, 36.06],
            icon: "🌉",
            align: "b",
            note: "黄河穿城而过，恰好处在中国半湿润与半干旱的过渡带上。"
          },
          {
            id: "beijing-hu",
            label: "北京",
            place: "东南季风农耕区",
            coord: [116.4, 39.9],
            icon: "🏙️",
            align: "r",
            note: "位于胡焕庸线东侧，降水较充沛、地形平坦。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 西北绿洲串起丝绸之路",
        badgeLabel: "祁连与天山雪水",
        duration: 7,
        camera: { center: [94, 40], lonSpan: 34 },
        showChinaProvinces: true,
        routes: [
          {
            id: "hexi-oasis",
            color: "#16a34a",
            waypoints: [[103.83, 36.06], [100.45, 38.93], [94.66, 40.14], [87.62, 43.82]],
            traveler: "🐪",
            width: 3,
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "dunhuang",
            label: "敦煌绿洲",
            place: "祁连雪水滋润",
            coord: [94.66, 40.14],
            icon: "🏜️",
            align: "b",
            note: "河西走廊西端绿洲明珠，靠雪山融水在沙漠边缘繁衍生息。"
          },
          {
            id: "urumqi",
            label: "乌鲁木齐",
            place: "天山北坡绿洲城",
            coord: [87.62, 43.82],
            icon: "🏔️",
            align: "t",
            note: "天山冰雪融水孕育出西北重要都市。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 读懂山河与家园的格局",
        badgeLabel: "人地和谐大地图",
        duration: 6,
        camera: { center: [105, 36], lonSpan: 56 },
        showChinaProvinces: true,
        zones: [GEO_ZONES.china_northwest_dry, GEO_ZONES.china_southeast_dense]
      }
    ],
    quiz: {
      prompt: "胡焕庸线（黑河—腾冲线）两侧人口相差悬殊，它和哪一条自然地理界线最贴近？",
      options: [
        "赤道 0 度纬线",
        "中国 400 毫米年等降水量线",
        "180 度国际日界线"
      ],
      answerIndex: 1,
      explain: "胡焕庸线与 400 毫米年等降水量线高度贴合：东南侧雨热充沛、平原广阔适合农耕聚居，西北侧干旱高寒以牧业与绿洲为主。"
    },
    parentTip: "可以在中国地图上用细绳把黑龙江黑河和云南腾冲连起来，和孩子一起数一数你们去过或听说过的城市，看看它们有几座落在线的东南边！",
    sources: [
      { title: "《地理学报》· 基于“七普”的“胡焕庸线”两侧人口集疏新态势", url: "https://www.geog.com.cn/article/2022/0375-5444/0375-5444-77-12-3023.shtml" },
      { title: "中国天气网 · 一条神奇的线：400 毫米等降水量线", url: "https://m.weather.com.cn/isohyet/" }
    ]
  },

  // ==================== 4. oceans ====================
  {
    id: "coral-reef-atoll",
    realm: "oceans",
    emoji: "🪸",
    title: "大洋深处几千米的海底，怎么会长出一圈圈像戒指一样的珊瑚环礁？",
    subtitle: "达尔文环礁演化学说、2300 公里大堡礁与珊瑚虫共生奥秘",
    badge: "珊瑚环礁 · 海底火山戒指",
    trigger: "小念看到马尔代夫的航拍照片惊呆了：深蓝大海里飘着一串圆圆的碧绿花环，中间像游泳池一样！",
    difficulty: "master",
    tags: ["珊瑚环礁", "达尔文", "大堡礁", "马尔代夫"],
    dialogue: [
      {
        nian: "爸爸你看马尔代夫的航拍！深蓝大海中间怎么会长出一圈圈绿松石一样的圆戒指，中间还空着一汪浅水？",
        dad: "那是大自然的超级建筑奇迹——珊瑚环礁！可造礁珊瑚其实怕深怕黑，只能住在阳光能照到的浅水里，大洋底部深达几千米，它们根本没法从深海底直接往上盖房！",
        steps: [
          { icon: "🌋", label: "海底火山露出海面" },
          { icon: "🪸", label: "珊瑚绕岸长成裙边" },
          { icon: "💍", label: "火山沉没留出环礁" }
        ]
      },
      {
        nian: "珊瑚怕深怕黑住不了深海底，那它们是怎么在几千米深的大洋中间盖起花环的呀？",
        dad: "180 多年前生物学家达尔文猜出了惊人真相：先有一座海底火山喷出海面变成小岛，珊瑚贴着岛边浅水长成“岸礁”；后来火山冷却慢慢下沉，珊瑚拼命往上追着阳光长成“堡礁”，等火山彻底沉进海底，水面就只剩下一圈戒指般的“环礁”啦！",
        factBadge: {
          icon: "⏱️",
          title: "一枚环礁需要造几百万年",
          detail: "块状造礁珊瑚每年只长 0.3 到 2 厘米，一座完整环礁往往需要数十万到 3000 万年才成型！"
        }
      },
      {
        nian: "原来达尔文发现戒指下面藏着沉下去的火山！那澳大利亚的大堡礁为什么能大到连太空都看得见？",
        dad: "因为澳大利亚东北岸恰好踩在温暖清澈的热带浅海大陆架上，无数珊瑚虫一代代用碳酸钙骨骼堆出绵延约 2300 公里的大堡礁，连绕地球飞的卫星都能拍到它亮闪闪的碧蓝条带！",
        figure: {
          kind: "scale",
          caption: "达尔文珊瑚礁演化三部曲（从岸边到深海戒指）",
          stops: [
            { label: "① 岸礁", note: "紧贴火山岛边生长", color: "#f97316" },
            { label: "② 堡礁", note: "火山下沉隔出潟湖", color: "#0ea5e9" },
            { label: "③ 环礁", note: "火山消失只剩圆环", color: "#14b8a6", hot: true }
          ]
        }
      },
      {
        nian: "珊瑚虫是动物还是石头呀？为什么有时候新闻里会说珊瑚“变白生病”了？",
        dad: "珊瑚虫是小小的海洋动物，它身体里住着五颜六色的好朋友“虫黄藻”，帮它晒太阳造食物。可如果海水变暖太快，珊瑚虫压力一大把虫黄藻赶跑了，露出雪白的石灰骨骼，就会发生危险的“珊瑚白化”！",
        factBadge: {
          icon: "🌡️",
          title: "珊瑚只爱 20~30℃ 的干净浅海",
          detail: "绝大多数造礁珊瑚分布在南北纬 30° 之间的温暖清澈海域，被称为“海洋热带雨林”。"
        }
      },
      {
        nian: "我懂了！珊瑚环礁是下沉的火山岛和追着阳光向上长的珊瑚虫合作了几百万年留下的翡翠戒指！",
        dad: "说得太美了！保护海洋清澈和减缓全球变暖，才能让这片“海洋雨林”一直五彩斑斓。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 印度洋上的翡翠戒指群",
        badgeLabel: "马尔代夫珊瑚环礁",
        duration: 7,
        camera: { center: [75, 4], lonSpan: 34 },
        showTropics: true,
        markers: [
          {
            id: "maldives",
            label: "马尔代夫环礁群",
            place: "26组天然珊瑚环礁",
            coord: [73.5, 4.2],
            icon: "💍",
            align: "l",
            note: "由上千座珊瑚岛组成，平均海拔只有一两米，是典型大洋环礁国度。"
          },
          {
            id: "srilanka-ref",
            label: "热带印度洋",
            place: "温暖清澈浅水带",
            coord: [80.7, 7.8],
            icon: "🌊",
            align: "r",
            note: "位于南北纬 30° 之间，阳光充足、水温适宜珊瑚生长。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 达尔文环礁演进动画",
        badgeLabel: "火山下沉 · 珊瑚追光",
        duration: 8,
        kind: "diagram",
        diagram: "atoll-evolution",
        camera: { center: [75, 4], lonSpan: 34 },
        myth: {
          wrong: "以为珊瑚是海底长出的彩色植物",
          right: "珊瑚是海洋动物，靠与藻类共生在火山岛沉没后叠出环礁！"
        }
      },
      {
        turn: 2,
        title: "3 · 太空可见的大堡礁",
        badgeLabel: "绵延 2300 公里",
        duration: 7,
        camera: { center: [148, -18], lonSpan: 32 },
        zones: [GEO_ZONES.great_barrier_zone],
        markers: [
          {
            id: "gbr-north",
            label: "澳大利亚大堡礁",
            place: "世界最大珊瑚礁群",
            coord: [147.7, -18.2],
            icon: "🪸",
            align: "r",
            note: "绵延约 2300 公里，白色的碳酸钙礁盘让卫星从太空都能看见亮蓝海面。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 南北纬30°的海洋雨林",
        badgeLabel: "守护珊瑚防白化",
        duration: 7,
        camera: { center: [120, 4], lonSpan: 130 },
        showTropics: true,
        zones: [GEO_ZONES.great_barrier_zone],
        markers: [
          {
            id: "nansha-atoll",
            label: "中国南海珊瑚礁",
            place: "热带环礁与礁盘",
            coord: [114.3, 10.2],
            icon: "🏝️",
            align: "t",
            note: "南海永暑礁、美济礁等都是典型的热带珊瑚环礁地貌。"
          },
          {
            id: "maldives-2",
            label: "马尔代夫",
            place: "印度洋环礁",
            coord: [73.5, 4.2],
            icon: "💍",
            align: "l",
            note: "海水变暖和海平面上升正威胁着全球低洼珊瑚环礁。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 大海用百万年雕出的花环",
        badgeLabel: "海洋热带雨林",
        duration: 6,
        camera: { center: [115, -4], lonSpan: 135 },
        showTropics: true,
        zones: [GEO_ZONES.great_barrier_zone]
      }
    ],
    quiz: {
      prompt: "按照达尔文的珊瑚礁学说，大洋中环形“环礁”中央那片浅蓝潟湖原本是什么？",
      options: [
        "陨石砸出来的大坑",
        "一座后来慢慢冷却沉入海底的火山岛",
        "被鲸鱼游出来的圆圈"
      ],
      answerIndex: 1,
      explain: "珊瑚原本绕着火山岛边缘生长，当火山岛下沉消失在海面以下，向上追光的珊瑚就留下了中间空心的环形礁盘。"
    },
    parentTip: "可以在脸盆水里倒扣一只小碗当火山岛，碗边绕一圈彩色橡皮泥当珊瑚；慢慢把碗往下按沉，让橡皮泥保持贴近水面，就能直观演示岸礁→堡礁→环礁的演变！",
    sources: [
      { title: "NOAA National Ocean Service · How Do Coral Reefs Form?", url: "https://oceanservice.noaa.gov/education/tutorial_corals/coral04_reefs.html" },
      { title: "USGS · Coral Reef Facts", url: "https://www.usgs.gov/centers/pcmsc/coral-reef-facts" },
      { title: "NOAA NESDIS · The Great Barrier Reef", url: "https://www.nesdis.noaa.gov/news/the-great-barrier-reef" }
    ]
  },

  // ==================== 5. sky ====================
  {
    id: "moon-tides-bay",
    realm: "sky",
    emoji: "🌙",
    title: "大海里的潮水每天准时涨落两次，真是月亮在天上拉着它吗？",
    subtitle: "月球引潮力、双侧潮汐隆起、初一十五大潮与芬迪湾 16 米潮差",
    badge: "月球潮汐 · 芬迪湾大潮",
    trigger: "小念在海边堆好的沙堡，下午吃个冰激凌回来就被涨上来的海水冲平了，他纳闷大海怎么像会呼吸一样！",
    difficulty: "starter",
    tags: ["潮汐", "月亮引力", "芬迪湾", "钱塘江大潮"],
    dialogue: [
      {
        nian: "爸爸，我上午在沙滩堆的城堡，怎么到了傍晚海水自己涨上来把它吞掉了？是谁在推海水呀？",
        dad: "是天上的月亮！虽然太阳比月亮大得多，但月亮离地球近得多，所以月亮拉扯地球海水的“引潮力”比太阳还要强两倍多，就像一只看不见的太空磁铁轻轻拽着大海！",
        steps: [
          { icon: "🌙", label: "月亮引力拉起近侧海水" },
          { icon: "🌍", label: "远侧滞后形成第二个水包" },
          { icon: "🔄", label: "地球自转每天经过两次" }
        ]
      },
      {
        nian: "月亮只挂在地球的一边，那为什么大海一天要涨两次潮，每隔六小时就换一次涨落呢？",
        dad: "超棒的追问！靠近月亮那一面海水受力最大，鼓出一个大水包；地球正背面离月亮最远、受力最小，海水被“甩”在后面，也鼓出第二个水包！地球像橄榄球一样穿着两个水包每天转一圈，海边自然就遇到两次涨潮和两次落潮啦！",
        factBadge: {
          icon: "⏱️",
          title: "每天约两次涨潮、两次落潮",
          detail: "一次高潮到下一次低潮大约相隔 6 小时，因为月亮自己也在公转，每天涨潮时间还会推迟约 50 分钟。"
        }
      },
      {
        nian: "那月亮和太阳如果一块儿帮忙拉海水，潮水是不是会涨得比平时更高？",
        dad: "答对了！每逢农历初一新月和十五满月，太阳、月亮和地球排成一条直线，两股引力联手拉出最高的“大潮”；到了初七、二十二上下弦月排成直角，引力互相抵消，就是温柔的“小潮”！",
        figure: {
          kind: "bars",
          caption: "世界典型海域最大潮差大比拼（涨落高度差，米）",
          items: [
            { label: "加拿大芬迪湾(世界第一)", value: 16, unit: "m", color: "#2563eb" },
            { label: "中国杭州湾/钱塘江口", value: 9, unit: "m", color: "#ff9f43" },
            { label: "大洋中部平均潮差", value: 1, unit: "m", color: "#64748b" }
          ]
        }
      },
      {
        nian: "哇！同样是太阳月亮拉出的大潮，怎么大洋平均才涨 1 米，加拿大芬迪湾却能涨出 16 米高呀？",
        dad: "全靠“喇叭口地形”帮倒忙式放大！芬迪湾外面宽、里面窄又浅，潮水挤进漏斗无处可躲只能拼命堆高，而且海湾来回晃荡的节奏恰好和 12 小时潮汐共振；咱们中国的杭州湾也是大喇叭口，才有了举世闻名的钱塘江大潮！",
        factBadge: {
          icon: "🌊",
          title: "退潮能走海底，涨潮可停大船",
          detail: "芬迪湾退潮时海床露出像操场，6 小时后海水可暴涨超 15 米，每次进出水量超全球河流总和！"
        }
      },
      {
        nian: "我懂了！月亮引潮力把地球海水拉成两头鼓的水包，初一十五加上太阳成大潮，喇叭口海湾还能把潮水堆成墙！",
        dad: "完全掌握！下次再去海边玩沙堡，记得先查查潮汐表，离高潮线远一点，还要注意观潮安全哦！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 月亮每天牵着大海呼吸",
        badgeLabel: "地球上的双侧潮汐",
        duration: 7,
        camera: { center: [-64, 45], lonSpan: 34 },
        markers: [
          {
            id: "fundy-bay",
            label: "加拿大芬迪湾",
            place: "世界最大潮差 ~16m",
            coord: [-64.5, 45.3],
            icon: "🌊",
            align: "r",
            note: "世界潮差冠军！最高涨落差约 16 米，相当于五层楼高。"
          },
          {
            id: "atlantic-open",
            label: "大西洋开阔海域",
            place: "平均潮差仅约 1~2m",
            coord: [-56.0, 41.0],
            icon: "⚓",
            align: "b",
            note: "开阔大洋潮差很小，涌入喇叭形海湾才被急剧放大。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 月亮拉出双侧水包动画",
        badgeLabel: "为什么一天涨两次潮",
        duration: 8,
        kind: "diagram",
        diagram: "moon-tides",
        camera: { center: [-64, 45], lonSpan: 34 },
        myth: {
          wrong: "以为只有对着月亮那面才涨潮",
          right: "引力差让面对和背对月亮的两侧同时鼓起水包，每天涨潮两次！"
        }
      },
      {
        turn: 2,
        title: "3 · 初一十五日月联手大潮",
        badgeLabel: "大潮 vs 小潮规律",
        duration: 7,
        camera: { center: [121, 30.2], lonSpan: 18 },
        showChinaProvinces: true,
        routes: [
          {
            id: "qiantang-bore",
            color: "#2563eb",
            waypoints: [[122.8, 30.2], [121.6, 30.35], [120.7, 30.35], [120.2, 30.25]],
            traveler: "🌊",
            width: 4,
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "qiantang",
            label: "钱塘江海宁观潮点",
            place: "农历八月十八大潮",
            coord: [120.68, 30.38],
            icon: "🌊",
            align: "t",
            note: "杭州湾外宽百公里、内窄数公里，把东海大潮挤成奔腾一线潮。"
          },
          {
            id: "hangzhou-bay",
            label: "喇叭口杭州湾",
            place: "地形急剧聚水抬高",
            coord: [121.5, 30.3],
            icon: "📢",
            align: "b",
            note: "典型喇叭口海湾加上江底沙坎阻挡，造就天下奇观钱塘潮。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 跨越东西半球的超级海湾",
        badgeLabel: "芬迪湾 & 杭州湾",
        duration: 7,
        camera: { center: [28, 36], lonSpan: 245 },
        markers: [
          {
            id: "fundy-global",
            label: "芬迪湾 (16m)",
            place: "加拿大东岸",
            coord: [-64.5, 45.3],
            icon: "🏆",
            align: "r",
            note: "世界最大潮差海湾，潮汐共振周期接近 12 小时。"
          },
          {
            id: "qiantang-global",
            label: "杭州湾 (9m)",
            place: "中国东海之滨",
            coord: [120.7, 30.35],
            icon: "🌊",
            align: "l",
            note: "中国著名涌潮海湾，以壮观的“一线潮”“交叉潮”闻名。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 天上月亮与海边沙堡的约定",
        badgeLabel: "宇宙牵动海洋",
        duration: 6,
        camera: { center: [121, 30.2], lonSpan: 34 },
        showChinaProvinces: true
      }
    ],
    quiz: {
      prompt: "为什么地球上大多数海边一天会出现两次涨潮？",
      options: [
        "因为月亮每天绕地球转两整圈",
        "因为月球引潮力在地球面对和背对月亮的两侧各拉出一个水包，地球每天自转穿过它们各一次",
        "因为太阳中午把海水晒膨胀了"
      ],
      answerIndex: 1,
      explain: "地球面对月亮一侧引力最强、背对一侧引力最弱形成对称的两个潮汐水包，地球 24 小时自转一圈便经过两次高潮！"
    },
    parentTip: "观潮或赶海一定要提前查当地潮汐时刻表，切勿越过警戒线在江堤滩涂逗留；平时可以和孩子观察月相（新月、满月、半月），对照当天的潮高变化！",
    sources: [
      { title: "NOAA JetStream · Tides", url: "https://www.noaa.gov/jetstream/ocean/tides" },
      { title: "NOAA · Bay of Fundy: The Highest Tides in the World", url: "https://www.noaa.gov/ocean/fundy-max" }
    ]
  },

  // ==================== 4. oceans (polar ice) ====================
  {
    id: "polar-arctic-antarctic",
    realm: "oceans",
    emoji: "🐧",
    title: "同样是冰天雪地，为什么北极熊和企鹅永远见不到面，南极还比北极冷得多？",
    subtitle: "北冰洋薄海冰 vs 4.9 公里南极冰盖高原、-89.2℃ 极寒与中国秦岭站",
    badge: "南北极对决 · -89.2℃",
    trigger: "小念在绘本里画了一只北极熊和一只企鹅一起堆雪人，爸爸笑着说它们俩住得隔着整个地球呢！",
    difficulty: "explorer",
    tags: ["南极洲", "北冰洋", "企鹅与北极熊", "秦岭站"],
    dialogue: [
      {
        nian: "爸爸，我画的北极熊和企鹅拉手堆雪人不对吗？它们不是都住在冰天雪地的极地吗？",
        dad: "画得真可爱，不过它们天生一个在最北头的北极，一个在最南头的南极！企鹅祖先在南半球演化、不会飞，跨不过热腾腾的赤道海洋；北极熊则守在北冰洋海冰上，所以俩人永远见不到面！",
        steps: [
          { icon: "🐻‍❄️", label: "北极：陆地围着冰封大洋" },
          { icon: "☀️", label: "赤道热带形成天然屏障" },
          { icon: "🐧", label: "南极：大洋围着冰盖高原" }
        ]
      },
      {
        nian: "一个在最北一个在最南！可既然都在极圈里晒太阳一样斜，为什么都说南极比北极冷得多呀？",
        dad: "因为地底下的底子完全相反！北极是片被陆地围住的北冰洋，海冰才厚两到四米，底下的海水像大暖水袋透出热量；南极却是一整块大洋围住的高原大陆，上面盖着平均两千多米、最厚达 4.9 公里的超级冰盖！",
        figure: {
          kind: "bars",
          caption: "北极与南极极端低温与海拔特征对比",
          items: [
            { label: "北极海冰冬季常见低温", value: -40, unit: "℃", color: "#38bdf8" },
            { label: "南极东方站地球极寒纪录", value: -89.2, unit: "℃", color: "#1d4ed8" }
          ]
        }
      },
      {
        nian: "冰盖最厚竟然有 4.9 公里！高出海平面这么多，是不是就像站在大雪山顶上才特别冷？",
        dad: "一听就通！南极平均海拔超过 2000 米，是七大洲里最高的大洲，海拔越高越冷，加上洁白冰雪把大部分阳光反射回太空。1983 年南极海拔 3420 米的东方站测出零下 89.2℃，创下地球实测最低温纪录！",
        factBadge: {
          icon: "🧊",
          title: "地球最大的淡水“超级冰库”",
          detail: "南极冰盖面积约 1400 万平方公里，若全部融化，全球海平面大约会上升 58 米！"
        }
      },
      {
        nian: "零下 89.2℃ 也太冷了！那南极洲不属于任何一个国家，人类还在那里建房子搞科研吗？",
        dad: "对！根据《南极条约》，南极属于全人类和平科研。中国已经在南极建起了五座科考站，2024 年最新开站的“秦岭站”就在面向太平洋的罗斯海恩克斯堡岛上，科学家在那里监测气候、海冰和星空！",
        factBadge: {
          icon: "🇨🇳",
          title: "中国南极“五朵金花”科考站",
          detail: "长城站、中山站、昆仑站、泰山站，以及 2024 年建成开站的罗斯海秦岭站！"
        }
      },
      {
        nian: "我明白了！北极是陆地围海洋所以暖和些，南极是高高厚厚的冰盖高原大陆，北极熊在北、企鹅在南各自守着极地家园！",
        dad: "太赞了！南北极是地球的两台超级“大空调”，守护极地冰雪就是守护我们全人类的气候平衡。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 一北一南隔着赤道遥望",
        badgeLabel: "北极熊 ⇄ 企鹅",
        duration: 7,
        camera: { center: [20, 10], lonSpan: 245 },
        showTropics: true,
        markers: [
          {
            id: "svalbard-bear",
            label: "斯瓦尔巴群岛",
            place: "78°N 北极熊家园",
            coord: [16.0, 78.2],
            icon: "🐻‍❄️",
            align: "r",
            note: "北冰洋边缘群岛，北极熊依托海冰捕猎生活。"
          },
          {
            id: "antarctic-peninsula",
            label: "南极边缘海域",
            place: "南半球企鹅乐园",
            coord: [-60.0, -56.0],
            icon: "🐧",
            align: "r",
            note: "企鹅演化于南半球寒冷海域，跨不过炎热的赤道大洋。"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 北冰洋海冰 vs 南极高原冰盖",
        badgeLabel: "剖面揭秘为何南极更冷",
        duration: 8,
        kind: "diagram",
        diagram: "arctic-vs-antarctic",
        camera: { center: [20, 10], lonSpan: 245 },
        myth: {
          wrong: "以为北极熊每天都能吃企鹅",
          right: "北极熊住北冰洋、企鹅住南半球，且南极高原冰盖比北极冷得多！"
        }
      },
      {
        turn: 2,
        title: "3 · -89.2℃ 地球极寒之巅",
        badgeLabel: "高海拔冰盖超级冰库",
        duration: 7,
        camera: { center: [80, -35], lonSpan: 150 },
        markers: [
          {
            id: "south-indian",
            label: "南极方向 · 东方站",
            place: "77.5°S · 海拔 3420m",
            coord: [106.8, -55.0],
            icon: "🥶",
            align: "t",
            note: "东方站位于东南极内陆高冰原（77.5°S），1983 年 7 月测得 -89.2℃ 世界最低气温纪录。"
          }
        ]
      },
      {
        turn: 3,
        title: "4 · 和平科研与南极科考航线",
        badgeLabel: "雪龙号奔赴秦岭站",
        duration: 7,
        camera: { center: [135, -10], lonSpan: 120 },
        routes: [
          {
            id: "xuelong-route",
            color: "#ef4444",
            waypoints: [[121.5, 31.2], [132, 10], [150, -25], [164, -56]],
            traveler: "🚢",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          {
            id: "shanghai-polar",
            label: "上海极地码头",
            place: "雪龙号出发母港",
            coord: [121.5, 31.2],
            icon: "⚓",
            align: "l",
            note: "中国极地科考破冰船从这里起航，一路南下穿越西风带驶向南极。"
          },
          {
            id: "ross-sea-dir",
            label: "驶向罗斯海秦岭站",
            place: "74.9°S · 2024年开站",
            coord: [163.7, -56.0],
            icon: "🇨🇳",
            align: "l",
            note: "中国第 5 座南极科考站秦岭站建在南极罗斯海恩克斯堡岛上。"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 守护地球两端的冰雪空调",
        badgeLabel: "南北极气候平衡",
        duration: 6,
        camera: { center: [30, 6], lonSpan: 240 },
        showTropics: true
      }
    ],
    quiz: {
      prompt: "为什么南极比北极寒冷得多，还测出了地球最低气温 -89.2℃？",
      options: [
        "因为南极离太阳比北极远一倍",
        "因为南极是平均海拔超 2000 米的冰盖高原大陆，而北极是下方有海水保温的北冰洋",
        "因为北极有很多北极熊在散热"
      ],
      answerIndex: 1,
      explain: "北极是陆地环绕的冰封海洋，海水能起到调温作用；南极是覆盖着数千米厚冰盖的高海拔大陆，散热极快且强烈反射阳光，因此冷得多！"
    },
    parentTip: "可以在地球仪上分别把北极和南极正对着孩子看：北极中间是蓝色的北冰洋、周围一圈陆地；南极中间是白色的南极洲、周围一整圈蓝色大洋——一对比就终身难忘！",
    sources: [
      { title: "NSIDC · Quick Facts on Ice Sheets", url: "https://nsidc.org/learn/parts-cryosphere/ice-sheets" },
      { title: "NOAA Climate.gov · Antarctica is colder than the Arctic", url: "https://www.climate.gov/news-features/features/antarctica-colder-arctic-it%E2%80%99s-still-losing-ice" },
      { title: "WMO · World Lowest Temperature Record (-89.2°C, Vostok)", url: "https://wmo.int/asu-map?map=Temp_020" }
    ]
  }
];
