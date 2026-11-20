import { GEO_ZONES } from "./realms.ts";
import type { GeoStory } from "./types.ts";

export const worldGeoStories: readonly GeoStory[] = [
  // ==================== 4. oceans ====================
  {
    id: "gulf-stream-heater",
    realm: "oceans",
    emoji: "🌊",
    title: "为什么英国比中国黑龙江还靠北，冬天却很少冰天雪地？",
    subtitle: "墨西哥湾暖流与北大西洋暖流“海上大暖气”、拉布拉多寒流对比",
    badge: "全球洋流 · 海水暖气",
    trigger: "小念一查纬度吓了一跳：伦敦居然比哈尔滨还靠北，可英超足球场冬天还是绿草如茵！",
    difficulty: "explorer",
    tags: ["洋流", "北大西洋暖流", "英国", "寒流暖流"],
    dialogue: [
      {
        nian: "爸爸你看纬度线！英国伦敦在北纬 51.5 度，比我们黑龙江哈尔滨（45.8°）还靠北，为什么英国冬天很少零下二三十度呀？",
        dad: "哈，这是因为大西洋里装了一根全天候运行的“海底大暖气”——墨西哥湾暖流和它往东北延伸的北大西洋暖流！它日夜不停地把加勒比海的热带暖水一路送到英国和挪威海岸。",
        steps: [
          { icon: "☀️", label: "热带海面吸足阳光" },
          { icon: "🌊", label: "暖流跨过北大西洋" },
          { icon: "🌬️", label: "西风把暖湿空气吹上欧洲" }
        ]
      },
      {
        nian: "一条洋流真能暖和整个欧洲吗？它的水流有多大呀？",
        dad: "太庞大了！墨西哥湾暖流每秒运送的水量比全世界所有河流加起来还要多好几十倍，它送去的热量相当于好几百万座发电站同时供暖，连北极圈里的俄罗斯港口摩尔曼斯克都能全年不结冰呢！",
        figure: {
          kind: "bars",
          caption: "同纬度冬天 1 月平均气温大对比（℃）",
          items: [
            { label: "伦敦 51.5°N (暖流)", value: 5, unit: "℃", color: "#ef4444" },
            { label: "哈尔滨 45.8°N (季风)", value: -18, unit: "℃", color: "#3b82f6" }
          ]
        }
      },
      {
        nian: "那大海里既有暖流，是不是也有专门吹冷风的“寒流”？",
        dad: "有呀！大西洋另一边贴着加拿大拉布拉多半岛南下的“拉布拉多寒流”就是一股冰水，它甚至会把格陵兰的冰山顺水漂到航道里；还有日本北海道附近暖流和千岛寒流相撞，经常形成大渔场和浓雾！",
        factBadge: {
          icon: "🐟",
          title: "寒暖流交汇的地方往往鱼最多",
          detail: "冷暖海水一翻搅，海底营养全浮上来喂饱小鱼小虾，北海道和纽芬兰都是超级渔场！"
        }
      },
      {
        nian: "哎呀，我还看到赤道边上的加拉帕戈斯群岛居然有企鹅，也是寒流送去的吗？",
        dad: "真会联想！南美洲西岸的“秘鲁寒流”一路把南极冷水送向赤道，让赤道上的加拉帕戈斯小企鹅照样舒舒服服游泳捕鱼！",
        factBadge: {
          icon: "🐧",
          title: "赤道也能见到野生企鹅",
          detail: "加拉帕戈斯企鹅住在赤道 0° 附近，全靠冰凉的秘鲁寒流给海域降温。"
        }
      },
      {
        nian: "我懂了！大洋里的洋流就像地球的供暖和空调管，有的把热带热量送向北方，有的把极地凉水带到赤道！",
        dad: "太贴切了！海洋比大气更善于存热量，是地球最稳重的“调温大师”。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 跨越北大西洋的超级暖气",
        badgeLabel: "51.5°N 的温暖冬天",
        duration: 7,
        camera: { center: [-30, 42], lonSpan: 95 },
        routes: [
          {
            id: "gulf-stream",
            label: "墨西哥湾—北大西洋暖流",
            color: "#ef4444",
            waypoints: [[-80, 26], [-72, 36], [-45, 44], [-10, 51], [15, 67]],
            traveler: "🔥",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "london-lat", label: "伦敦 51.5°N", place: "1月均温 +5℃", coord: [-0.12, 51.5], icon: "🎡", align: "r" },
          { id: "murmansk", label: "摩尔曼斯克", place: "69°N 不冻港", coord: [33.08, 68.97], icon: "⚓", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 全球大洋传送带动画",
        badgeLabel: "暖流送热 · 冷水回流",
        duration: 8,
        kind: "diagram",
        diagram: "ocean-conveyor",
        camera: { center: [-35, 42], lonSpan: 85 }
      },
      {
        turn: 2,
        title: "3 · 寒暖流相撞出大渔场",
        badgeLabel: "冷水 vs 暖水",
        duration: 7,
        camera: { center: [148, 42], lonSpan: 48 },
        routes: [
          {
            id: "kuroshio",
            label: "日本暖流(黑潮)",
            color: "#ef4444",
            waypoints: [[126, 24], [136, 33], [146, 39]],
            traveler: "🌊",
            startAt: 0.08,
            endAt: 0.85
          },
          {
            id: "oyashio",
            label: "千岛寒流(亲潮)",
            color: "#2563eb",
            waypoints: [[158, 52], [150, 45], [144, 41]],
            traveler: "❄️",
            startAt: 0.12,
            endAt: 0.88
          }
        ],
        markers: [
          { id: "hokkaido", label: "北海道超级渔场", coord: [144, 42], icon: "🐟", align: "r" }
        ]
      },
      {
        turn: 3,
        title: "4 · 秘鲁寒流护送赤道企鹅",
        badgeLabel: "0° 赤道冷水区",
        duration: 7,
        showTropics: true,
        camera: { center: [-82, -16], lonSpan: 55 },
        routes: [
          {
            id: "peru-current",
            label: "秘鲁寒流",
            color: "#2563eb",
            waypoints: [[-74, -42], [-73, -24], [-80, -10], [-90.5, -0.5]],
            traveler: "🐧",
            startAt: 0.1,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "galapagos", label: "加拉帕戈斯群岛", place: "赤道企鹅之家", coord: [-90.5, -0.5], icon: "🐧", align: "l" }
        ],
        myth: {
          wrong: "以为同纬度的地方温度一定差不多",
          right: "靠暖流还是靠寒流、吹海风还是陆风，能让同纬度冬天差出二十多度！"
        }
      },
      {
        turn: 4,
        title: "5 · 地球的海上冷暖水管",
        badgeLabel: "全球海洋调节气候",
        duration: 6,
        camera: { center: [-20, 28], lonSpan: 130 },
        markers: [
          { id: "london-end", label: "暖流送暖欧洲", coord: [-0.12, 51.5], icon: "🔥", align: "t" },
          { id: "galapagos-end", label: "寒流养赤道企鹅", coord: [-90.5, -0.5], icon: "🐧", align: "l" }
        ]
      }
    ],
    quiz: {
      prompt: "英国伦敦纬度比中国哈尔滨还靠北，为什么冬天却温暖得多、很少冰天雪地？",
      options: [
        "英国地下全是火山温泉",
        "受到北大西洋暖流和温和西风的持续送暖",
        "因为英国靠近赤道"
      ],
      answerIndex: 1,
      explain: "墨西哥湾暖流与北大西洋暖流把低纬度的暖水一路送到西欧沿海，配合盛行西风把暖湿空气吹向陆地，让英国冬天格外温和！"
    },
    parentTip: "可以在透明碗里放室温水，一边轻轻放一块蓝色冰块、另一边倒一点染红的热水，孩子能亲眼看见冷沉暖浮形成对流洋流。",
    sources: [
      { title: "NOAA National Ocean Service · What Is the Gulf Stream?", url: "https://oceanservice.noaa.gov/facts/gulfstreamspeed.html" },
      { title: "NOAA Ocean Service · Global Ocean Conveyor Belt", url: "https://oceanservice.noaa.gov/education/tutorial_currents/05conveyor1.html" }
    ]
  },
  {
    id: "nile-amazon-rivers",
    realm: "oceans",
    emoji: "🐊",
    title: "尼罗河最长还是亚马孙河最大？河流怎么画出三角洲？",
    subtitle: "尼罗河 6650 公里 vs 亚马孙河 20.9 万 m³/s、河曲牛轭湖与冲积三角洲",
    badge: "世界超级大河",
    trigger: "小念拿两本百科书犯迷糊：一本说尼罗河世界第一，另一本说亚马孙河世界第一，到底谁厉害？",
    difficulty: "starter",
    tags: ["尼罗河", "亚马孙河", "长江", "三角洲"],
    dialogue: [
      {
        nian: "爸爸，尼罗河和亚马孙河到底谁才是“世界第一大河”呀？它们怎么打起来了？",
        dad: "哈哈，因为比的项目不一样！如果用尺子量“长度”，非洲的尼罗河全长约 6650 公里，是世界最长的河；如果比“水量有多大”，南美洲的亚马孙河每秒喷进大西洋 20.9 万立方米水，比 70 多条尼罗河加起来还猛，稳居世界第一大河！",
        figure: {
          kind: "bars",
          caption: "世界四大长河里程比拼（公里）",
          items: [
            { label: "尼罗河(最长)", value: 6650, unit: "km", color: "#f59e0b" },
            { label: "亚马孙河(最大)", value: 6400, unit: "km", color: "#22c55e" },
            { label: "长江(中国第一)", value: 6300, unit: "km", color: "#4d96ff" },
            { label: "黄河(母亲河)", value: 5464, unit: "km", color: "#d97706" }
          ]
        }
      },
      {
        nian: "哇，我们的长江 6300 公里也排世界第三长呀！可为什么河流流到平原以后总爱扭来扭去像蛇一样？",
        dad: "因为上游山里坡陡，河水急着往下冲；到了平坦的中下游，河水慢下来，稍微碰到一块硬土就会拐个弯，越拐越弯就成了“九曲回肠”！有时候拐弯太急自己抄近道截断，还会剩下一个弯月亮似的“牛轭湖”呢。",
        steps: [
          { icon: "⛰️", label: "上游冲出 V 形峡谷" },
          { icon: "〰️", label: "中游弯成九曲回肠" },
          { icon: "🔺", label: "下游入海堆成三角洲" }
        ]
      },
      {
        nian: "那河口为什么经常长出一块三角形的肥沃土地，叫“三角洲”呀？",
        dad: "江河一路上搬运了无数细泥沙，一冲进平缓的大海就减速刹车，泥沙全沉在河门口。几千年下来，泥沙堆成一张大扇子或三角形的“Δ”，这就是养活无数人的尼罗河三角洲、长江三角洲和珠江三角洲！",
        factBadge: {
          icon: "🔺",
          title: "“三角洲”这个词正是古希腊人看尼罗河口起的",
          detail: "尼罗河入海处像希腊字母 Δ（Delta），后来全世界的冲积河口都叫 Delta！"
        }
      },
      {
        nian: "奇怪，同样流量巨大的亚马孙河，入海口为什么没长出像尼罗河那样大大的三角洲呢？",
        dad: "问得好！因为亚马孙河入海口面对着狂暴的大西洋潮汐和强劲洋流，泥沙刚到门口就被海浪冲刷带走啦，所以变成了宽喇叭形的河口！"
      },
      {
        nian: "我懂啦！尼罗河赢在长度，亚马孙河赢在水量，大河用泥沙给地球铺出了最肥沃的三角洲！",
        dad: "记牢啦：长度王尼罗河、水量王亚马孙河、亚洲第一长河是我们中国的长江！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 6650 km 的非洲尼罗河",
        badgeLabel: "穿过撒哈拉的生命带",
        duration: 7,
        camera: { center: [31, 16], lonSpan: 45 },
        zones: [GEO_ZONES.sahara_belt],
        routes: [
          {
            id: "nile-flow",
            label: "尼罗河自南向北流",
            color: "#2563eb",
            waypoints: [[32.58, 0.42], [31.6, 4.85], [32.55, 15.6], [31.23, 30.04], [31.1, 31.4]],
            traveler: "⛵",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "victoria", label: "维多利亚湖源头", coord: [32.58, 0.42], icon: "💧", align: "b" },
          { id: "cairo-nile", label: "开罗 · 尼罗河三角洲", coord: [31.23, 30.04], icon: "🔺", align: "l" }
        ]
      },
      {
        turn: 1,
        title: "2 · 河曲与冲积三角洲动画",
        badgeLabel: "九曲回肠 · 泥沙造陆",
        duration: 8,
        kind: "diagram",
        diagram: "river-delta",
        camera: { center: [31, 30], lonSpan: 15 }
      },
      {
        turn: 2,
        title: "3 · 中国长江三角洲",
        badgeLabel: "6300 km 亚洲第一长河",
        duration: 7,
        camera: { center: [117, 31], lonSpan: 22 },
        showChinaProvinces: true,
        markers: [
          { id: "wuhan-yz", label: "武汉 · 荆江九曲", coord: [114.3, 30.6], icon: "〰️", align: "l" },
          { id: "shanghai-delta", label: "上海 · 长江三角洲", place: "鱼米之乡与世界大港", coord: [121.47, 31.23], icon: "🔺", align: "r" }
        ],
        myth: {
          wrong: "以为世界上最长的河流也一定是水量最大的河流",
          right: "尼罗河长度世界第一（6650 km），而亚马孙河水量遥遥领先（20.9万 m³/s）！"
        }
      },
      {
        turn: 3,
        title: "4 · 水量第一的亚马孙河",
        badgeLabel: "每秒 20.9 万立方米",
        duration: 7,
        camera: { center: [-61, -4], lonSpan: 44 },
        zones: [GEO_ZONES.amazon_rainforest],
        routes: [
          {
            id: "amazon-flow",
            label: "亚马孙河滚滚东流",
            color: "#0284c7",
            waypoints: [[-74.5, -9.5], [-73.25, -3.74], [-60.02, -3.11], [-49.5, -0.5]],
            traveler: "🐊",
            width: 4,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "manaus", label: "马瑙斯", coord: [-60.02, -3.11], icon: "🌴", align: "t" },
          { id: "belem", label: "亚马孙宽阔河口", coord: [-49.5, -0.5], icon: "🌊", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 大江大河养育文明",
        badgeLabel: "尼罗河 · 亚马孙 · 长江",
        duration: 6,
        camera: { center: [20, 12], lonSpan: 175 },
        markers: [
          { id: "amz-end", label: "亚马孙(水量王)", coord: [-55, -2], icon: "🐊", align: "b" },
          { id: "nile-end", label: "尼罗河(长度王)", coord: [31, 22], icon: "🔺", align: "t" },
          { id: "yz-end", label: "长江(亚洲第一)", coord: [115, 31], icon: "🐉", align: "r" }
        ]
      }
    ],
    quiz: {
      prompt: "关于尼罗河与亚马孙河的比较，哪一项说法是准确的？",
      options: [
        "尼罗河全长世界第一，亚马孙河水量和流域面积世界第一",
        "亚马孙河既最长又最大，尼罗河最短",
        "尼罗河和亚马孙河都在中国境内"
      ],
      answerIndex: 0,
      explain: "尼罗河约 6650 公里为世界最长河，而流经热带雨林的亚马孙河约 6400 公里但水量世界第一，每秒入海流量约 20.9 万立方米！"
    },
    parentTip: "可以在海滩或沙坑里倒一瓢水，让孩子看着小水流自己拐弯、并在入水口积出小小扇形三角洲。",
    sources: [
      { title: "Encyclopaedia Britannica · Amazon River & Nile River", url: "https://www.britannica.com/place/Amazon-River" },
      { title: "National Geographic Education · Delta", url: "https://education.nationalgeographic.org/resource/delta/" }
    ]
  },
  {
    id: "global-straits-canals",
    realm: "human",
    emoji: "🚢",
    title: "为什么苏伊士、巴拿马和马六甲被称为世界海上钥匙？",
    subtitle: "马六甲咽喉（最窄 2.8 km）、193 km 无闸苏伊士运河与巴拿马水闸电梯",
    badge: "世界海上咽喉",
    trigger: "小念看货轮航线图，发现巨轮不去绕大洲的尖尖，而是挤进几条又窄又短的小通道！",
    difficulty: "explorer",
    tags: ["马六甲海峡", "苏伊士运河", "巴拿马运河", "航运"],
    dialogue: [
      {
        nian: "爸爸，太平洋那么宽，货轮怎么全挤到新加坡旁边一条弯弯的窄水沟里去啦？",
        dad: "那条“水沟”可是亚洲和世界海上贸易的超级咽喉——马六甲海峡！它夹在马来半岛和苏门答腊岛之间，是太平洋往来印度洋最短的走廊，最窄的地方只有大约 2.8 公里宽呢！",
        steps: [
          { icon: "🌏", label: "马六甲连太平与印度洋" },
          { icon: "🐫", label: "苏伊士省下绕非洲一万公里" },
          { icon: "⛰️", label: "巴拿马水闸抬船跨美洲" }
        ]
      },
      {
        nian: "那如果没有苏伊士运河，亚洲去欧洲的船要绕好大一圈吗？",
        dad: "太远啦！如果没有埃及挖通的 193 公里苏伊士运河，船就得绕整个非洲最南端的好望角，多走差不多 8000 到 10000 公里！而且苏伊士运河两边都是海平面，不用修水闸，巨轮一口气直接开过去！",
        factBadge: {
          icon: "🇪🇬",
          title: "193 公里连通红海与地中海",
          detail: "苏伊士运河把原本两周的非洲大绕行缩成十几个小时。"
        }
      },
      {
        nian: "那美洲中间的巴拿马运河呢？它也不用修水闸吗？",
        dad: "刚好相反！巴拿马地峡中间挡着小山丘和海拔 26 米高的加通湖，船开不过山头，工程师就用淡水做“巨轮水电梯”——船进水闸后灌满水把船托高 26 米，穿过山顶大湖后再一步步放水降回大洋！",
        figure: {
          kind: "scale",
          caption: "两大人工运河过船方式比一比",
          stops: [
            { label: "苏伊士运河", note: "193 km · 无水闸直通", color: "#f59e0b" },
            { label: "巴拿马运河", note: "82 km · 淡水闸门抬船", color: "#2aa89b", hot: true }
          ]
        }
      },
      {
        nian: "哇，用淡水把万吨巨轮抬上山再放下来！那如果遇到大旱，湖水不够了怎么办？",
        dad: "你问到真问题了！巴拿马运河每次开闸都会消耗海量加通湖淡水，近几年遇到少雨干旱年份，运河每天通行的船只数量就不得不限流排队呢！"
      },
      {
        nian: "我懂啦！马六甲是天然窄海峡，苏伊士和巴拿马是人类用智慧挖通的大陆抄近道！",
        dad: "记牢这三把“海上金钥匙”，你看世界海运地图一下子就全通透了！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 最繁忙的马六甲海峡",
        badgeLabel: "最窄仅约 2.8 公里",
        duration: 7,
        camera: { center: [102, 3], lonSpan: 24 },
        routes: [
          {
            id: "malacca-ship",
            label: "印度洋 ⇄ 南海航线",
            color: "#2aa89b",
            waypoints: [[95, 6], [100.5, 3.2], [103.85, 1.25], [107, 4]],
            traveler: "🚢",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "singapore", label: "马六甲海峡 · 新加坡", place: "太平洋与印度洋最短走廊", coord: [103.85, 1.29], icon: "⚓", align: "b" }
        ]
      },
      {
        turn: 1,
        title: "2 · 苏伊士运河超级抄近道",
        badgeLabel: "省下绕行非洲一圈",
        duration: 7,
        camera: { center: [32, 12], lonSpan: 72 },
        routes: [
          {
            id: "suez-short",
            label: "苏伊士直通航线",
            color: "#22c55e",
            waypoints: [[44, 12], [38, 22], [32.5, 30.5], [20, 35]],
            traveler: "🚢",
            width: 3.5,
            startAt: 0.05,
            endAt: 0.85
          },
          {
            id: "cape-long",
            label: "绕行好望角旧路",
            color: "#ef4444",
            waypoints: [[44, 12], [41, -15], [18.4, -34.4], [-15, 5], [-6, 36]],
            dashed: true,
            startAt: 0.1,
            endAt: 0.95
          }
        ],
        markers: [
          { id: "suez", label: "苏伊士运河", place: "193km 无闸直通", coord: [32.35, 30.58], icon: "🚢", align: "t" },
          { id: "good-hope", label: "好望角", coord: [18.47, -34.36], icon: "🌊", align: "l" }
        ]
      },
      {
        turn: 2,
        title: "3 · 巴拿马“水电梯”过河",
        badgeLabel: "三步水闸抬船 26 米",
        duration: 8,
        kind: "diagram",
        diagram: "panama-locks",
        camera: { center: [-79.9, 9.1], lonSpan: 18 },
        myth: {
          wrong: "以为所有人工运河都是挖条平直水沟让海水自己流过去",
          right: "苏伊士运河无闸直通，但巴拿马运河必须靠加通湖淡水把船抬高 26 米再放下来！"
        }
      },
      {
        turn: 3,
        title: "4 · 中美洲地峡巴拿马",
        badgeLabel: "连接太平洋与大西洋",
        duration: 6,
        camera: { center: [-80, 9], lonSpan: 28 },
        routes: [
          {
            id: "panama-route",
            label: "巴拿马运河",
            color: "#0284c7",
            waypoints: [[-82, 7.5], [-79.55, 8.95], [-79.9, 9.35], [-76, 12]],
            traveler: "🚢",
            startAt: 0.1,
            endAt: 0.88
          }
        ],
        markers: [
          { id: "panama-m", label: "巴拿马运河", place: "加通湖淡水闸门", coord: [-79.7, 9.1], icon: "🚢", align: "t" }
        ]
      },
      {
        turn: 4,
        title: "5 · 世界航运三大咽喉",
        badgeLabel: "马六甲 · 苏伊士 · 巴拿马",
        duration: 6,
        camera: { center: [15, 16], lonSpan: 220 },
        markers: [
          { id: "panama-end", label: "巴拿马运河", coord: [-79.7, 9.1], icon: "🚢", align: "t" },
          { id: "suez-end", label: "苏伊士运河", coord: [32.35, 30.58], icon: "⚓", align: "t" },
          { id: "malacca-end", label: "马六甲海峡", coord: [103.85, 1.29], icon: "🌏", align: "b" }
        ]
      }
    ],
    quiz: {
      prompt: "巴拿马运河与苏伊士运河最大的工程区别是什么？",
      options: [
        "巴拿马运河要靠淡水船闸把船抬高过湖，苏伊士运河是无水闸海平面运河",
        "苏伊士运河只允许帆船通过",
        "巴拿马运河比苏伊士运河长十倍"
      ],
      answerIndex: 0,
      explain: "苏伊士运河沿低平沙地开挖，直接连通地中海和红海；而巴拿马运河中间地势高，靠淡水注水闸门把船抬上加通湖再放回大洋！"
    },
    parentTip: "可以在浴缸或水盆里用两块积木夹出一条“窄水沟”放小纸船，告诉孩子为什么港口和补给点总爱守在咽喉海峡旁边。",
    sources: [
      { title: "Panama Canal Authority · How the Panama Canal Works", url: "https://pancanal.com/en/how-the-panama-canal-works/" },
      { title: "Encyclopaedia Britannica · Suez Canal & Strait of Malacca", url: "https://www.britannica.com/topic/Suez-Canal" }
    ]
  },

  // ==================== 5. sky ====================
  {
    id: "earth-tilt-seasons",
    realm: "sky",
    emoji: "☀️",
    title: "为什么北京过夏天时，悉尼的小朋友在穿羽绒服？",
    subtitle: "地轴倾斜 23.44°、太阳直射点南北摆动与南北回归线秘密",
    badge: "四季密码 · 23.44°倾角",
    trigger: "小念和澳大利亚悉尼的表弟视频，惊讶地发现 7 月北京大汗淋漓，表弟却正裹着棉袄看冬日海浪！",
    difficulty: "starter",
    tags: ["四季变化", "地轴倾斜", "南半球", "南北回归线"],
    dialogue: [
      {
        nian: "爸爸，太阳不就一个吗？为什么 7 月份北京热得吃冰棍，悉尼的小朋友却正在过冬天？",
        dad: "秘密全在地球妈妈歪着脑袋走路！地球自转的那根轴并不是直立的，而是向一边倾斜了大约 23.44 度。它一边歪着脑袋一边绕太阳转，于是半年北半球正对着太阳，半年南半球正对着太阳！",
        figure: {
          kind: "tilt",
          caption: "地球自转轴约 23.44° 倾斜，造就南北半球季节相反",
          angleDeg: 23.4,
          northNote: "北半球迎向太阳 → 盛夏",
          southNote: "南半球斜背太阳 → 寒冬"
        }
      },
      {
        nian: "哦！我以前还以为夏天是因为地球离太阳更近、冬天离太阳更远呢！",
        dad: "很多人都会这么误会，其实恰好相反！地球每年 1 月反而离太阳最近，7 月离太阳还稍远一点点呢！决定冷热的关键根本不是远近，而是地轴倾斜带来的“阳光直射还是斜射”。",
        steps: [
          { icon: "📐", label: "地轴稳稳倾斜 23.44°" },
          { icon: "☀️", label: "夏至太阳直射北回归线" },
          { icon: "❄️", label: "南半球同时迎来斜射寒冬" }
        ]
      },
      {
        nian: "原来“南北回归线” 23.4 度就是这么来的！太阳光最北只跑到北回归线吗？",
        dad: "太聪明啦！每年夏至（6月21日前后）太阳垂直照射北纬 23.4° 的北回归线，穿过了中国云南、广西、广东和台湾！然后太阳直射点掉头往南“回归”，冬至那天再照到南回归线 23.4°S。",
        factBadge: {
          icon: "🌞",
          title: "中国北回归线沿线建有多座“立竿无影”纪念塔",
          detail: "夏至正午站在广东从化或汕头的北回归线标志塔下，阳光直落头顶，影子会缩到脚底！"
        }
      },
      {
        nian: "那如果地球有一天突然把脑袋扶正，不歪了（0 度倾角），会怎么样？",
        dad: "那地球就再也没有春夏秋冬啦！赤道永远暴晒，两极永远冰冷，北京也会一年到头变成千篇一律的春秋温度，再也看不见秋天红叶和冬天飘雪啦。"
      },
      {
        nian: "幸亏地球歪了 23.44 度！北京吃西瓜的时候悉尼堆雪人，地球四季都是它倾斜出来的舞步！",
        dad: "说得真美！记住这 23.44 度的小小歪斜，它给了地球最丰富多彩的四季。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 地球歪着脑袋绕太阳",
        badgeLabel: "地轴倾角 23.44°",
        duration: 8,
        kind: "diagram",
        diagram: "earth-seasons",
        camera: { center: [125, 0], lonSpan: 110 }
      },
      {
        turn: 1,
        title: "2 · 打破夏天离太阳更近的误会",
        badgeLabel: "直射 vs 斜射",
        duration: 7,
        showTropics: true,
        camera: { center: [130, 5], lonSpan: 115 },
        markers: [
          { id: "bj-summer", label: "北京 40°N · 7月盛夏", coord: [116.4, 39.9], icon: "🍉", align: "t" },
          { id: "sydney-winter", label: "悉尼 33.9°S · 7月寒冬", coord: [151.2, -33.86], icon: "🧥", align: "b" }
        ],
        myth: {
          wrong: "以为夏天热是因为 7 月地球离太阳更近",
          right: "7 月地球反而离太阳略远，真正让北半球炎热的是地轴倾斜让阳光更直射、白天更长！"
        }
      },
      {
        turn: 2,
        title: "3 · 穿过中国四省的北回归线",
        badgeLabel: "23.4°N 立竿无影",
        duration: 7,
        showTropics: true,
        showChinaProvinces: true,
        camera: { center: [111, 23.5], lonSpan: 28 },
        markers: [
          { id: "mojiang", label: "云南墨江", coord: [101.68, 23.43], icon: "🌞", align: "l" },
          { id: "guangzhou-tropic", label: "广东从化北回归线塔", coord: [113.48, 23.44], icon: "🗼", align: "b" },
          { id: "chiayi", label: "台湾嘉义", coord: [120.42, 23.45], icon: "🌴", align: "r" }
        ]
      },
      {
        turn: 3,
        title: "4 · 阳光南北摆动的轨迹",
        badgeLabel: "春分 → 夏至 → 秋分 → 冬至",
        duration: 6,
        showTropics: true,
        camera: { center: [120, 0], lonSpan: 120 },
        routes: [
          {
            id: "sun-shift",
            label: "太阳直射点南北移动",
            color: "#f59e0b",
            waypoints: [[120, 0], [120, 23.4], [120, 0], [120, -23.4]],
            traveler: "☀️",
            dashed: true,
            startAt: 0.05,
            endAt: 0.92
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 南北半球季节接力",
        badgeLabel: "23.44° 倾斜舞步",
        duration: 6,
        showTropics: true,
        camera: { center: [130, 2], lonSpan: 120 },
        markers: [
          { id: "bj-end", label: "北京 · 四季分明", coord: [116.4, 39.9], icon: "🍂", align: "t" },
          { id: "syd-end", label: "悉尼 · 圣诞过夏天", coord: [151.2, -33.86], icon: "🏖️", align: "b" }
        ]
      }
    ],
    quiz: {
      prompt: "造成南北半球季节正好相反（北京过暑假、悉尼过冬天）的根本原因是？",
      options: [
        "地球自转轴倾斜约 23.44° 且方向保持不变地绕太阳公转",
        "北半球海洋比南半球少",
        "夏天地球离太阳特别近"
      ],
      answerIndex: 0,
      explain: "地轴倾斜约 23.44°，使得地球公转时半年北半球朝向太阳（夏季）、半年南半球朝向太阳（夏季）！"
    },
    parentTip: "关灯拿手电筒照着歪斜的橘子或地球仪绕圈转，让孩子对比光线直照和斜照时亮斑的面积大小，一秒秒懂四季！",
    sources: [
      { title: "NASA Space Place · What Causes the Seasons?", url: "https://spaceplace.nasa.gov/seasons/en/" },
      { title: "NOAA National Weather Service · Why Do We Have Seasons?", url: "https://www.weather.gov/lmk/seasons" }
    ]
  },
  {
    id: "midnight-sun-aurora",
    realm: "sky",
    emoji: "🌌",
    title: "为什么北极会有半年的白天，天空还会挂着绿色极光？",
    subtitle: "极昼午夜太阳、半年黑夜极夜与地球磁场引导太阳风绘出极光",
    badge: "极圈奇观 · 极昼与极光",
    trigger: "小念看到挪威半夜十二点天上还挂着太阳、冬天夜空却飘起绿纱巾一样的极光，觉得像外星球！",
    difficulty: "explorer",
    tags: ["极昼", "极夜", "极光", "北极圈"],
    dialogue: [
      {
        nian: "爸爸，这张挪威照片明明写着半夜 12 点，怎么太阳还在天上不下山呀？",
        dad: "欢迎来到北纬 66.5° 以北的北极圈！因为地球歪着脑袋转，夏天整个北极圈都被太阳连轴照着，地球转一圈它都在阳光里，所以半夜太阳只是斜斜贴着地平线绕圈，不会落山，这就叫“极昼 / 午夜太阳”！",
        steps: [
          { icon: "☀️", label: "夏天极圈连转整天照太阳" },
          { icon: "🌙", label: "冬天整天躲在阴影里叫极夜" },
          { icon: "🌌", label: "极夜时最适合看绿色极光" }
        ]
      },
      {
        nian: "那到了冬天，北极是不是一直黑乎乎的？南极也是这样吗？",
        dad: "对！北极圈内到了极点，差不多有半年连续白天（极昼）和半年连续黑夜（极夜），南极也一样，只是月份跟北极正好相反。中国北极科考“黄河站”就在北纬 78.9° 的斯瓦尔巴群岛，科考队员冬天真的要好几个月见不到太阳！",
        factBadge: {
          icon: "🇨🇳",
          title: "中国最北城市漠河也能看到极昼“白夜”吗？",
          detail: "黑龙江漠河（53.5°N）在北极圈外，不会完全极昼，但夏至半夜北方天空会透亮如黄昏！"
        }
      },
      {
        nian: "黑乎乎的极夜里，天空怎么会突然飘起发绿、发紫的极光窗帘呢？",
        dad: "极光是太阳吹出的“超快带电风”和地球磁场配合演出的宇宙灯光秀！太阳风跑过来时，大部分被地球大磁场挡在外面，只有极少数顺着磁场弯弯的弧线溜进南北两极高空，撞上大气里的氧原子和氮原子，就亮出了绿色和紫色极光！"
      },
      {
        nian: "原来地球磁场在帮我们挡住太阳风，顺便只在南北极开个天窗放烟花！",
        dad: "说得太浪漫了！而且因为极光最喜欢绕着磁极画圈，所以在挪威特罗姆瑟、冰岛雷克雅未克、加拿大黄刀镇和中国最北端漠河偶尔都能抓拍到它呢。"
      },
      {
        nian: "我懂了！极昼极夜是地球歪着脑袋晒太阳造成的，极光是磁场拉着太阳风粒子去两极跳舞！",
        dad: "完全掌握啦！下次冬天夜里看见绿极光照片，你就知道地球磁场正在悄悄保护我们呢。"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 北极圈里的午夜太阳",
        badgeLabel: "66.5°N 极昼带",
        duration: 7,
        showTropics: true,
        camera: { center: [18, 69], lonSpan: 55 },
        markers: [
          { id: "tromso", label: "挪威特罗姆瑟 69.6°N", place: "午夜太阳与极光之都", coord: [18.95, 69.65], icon: "🌌", align: "b" },
          { id: "huanghe", label: "中国北极黄河站 78.9°N", coord: [11.93, 78.92], icon: "🇨🇳", align: "t" }
        ]
      },
      {
        turn: 1,
        title: "2 · 中国最北的“白夜”漠河",
        badgeLabel: "53.5°N 夏至不夜天",
        duration: 7,
        showTropics: true,
        showChinaProvinces: true,
        camera: { center: [122, 52], lonSpan: 32 },
        markers: [
          { id: "mohe", label: "黑龙江漠河", place: "53.5°N 中国北极村", coord: [122.36, 53.48], icon: "✨", align: "b" }
        ],
        myth: {
          wrong: "以为极光是由月亮反射冰块产生的光",
          right: "极光是太阳风高能带电粒子沿地球磁力线冲入两极高层大气撞击发光！"
        }
      },
      {
        turn: 2,
        title: "3 · 磁场与太阳风极光动画",
        badgeLabel: "磁力线指引极光舞",
        duration: 8,
        kind: "diagram",
        diagram: "polar-aurora",
        camera: { center: [15, 70], lonSpan: 60 }
      },
      {
        turn: 3,
        title: "4 · 全球黄金极光观测带",
        badgeLabel: "65°N ~ 75°N 极光环",
        duration: 6,
        showTropics: true,
        camera: { center: [-10, 66], lonSpan: 135 },
        markers: [
          { id: "reykjavik", label: "冰岛雷克雅未克", coord: [-21.94, 64.14], icon: "🌌", align: "b" },
          { id: "yellowknife", label: "加拿大黄刀镇", coord: [-114.37, 62.45], icon: "✨", align: "l" },
          { id: "tromso-2", label: "特罗姆瑟", coord: [18.95, 69.65], icon: "🌌", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 南北两极的昼夜大剧",
        badgeLabel: "极昼半年 · 极夜半年",
        duration: 6,
        showTropics: true,
        camera: { center: [18, 65], lonSpan: 75 },
        markers: [{ id: "svalbard-end", label: "斯瓦尔巴群岛", coord: [15.5, 78.2], icon: "🐻‍❄️", align: "b" }]
      }
    ],
    quiz: {
      prompt: "极光最常出现在南北两极附近，这是因为什么？",
      options: [
        "两极的雪会反光",
        "地球磁场把太阳风带电粒子引导到两极高层大气撞击发光",
        "极夜的时候太冷了把空气冻亮了"
      ],
      answerIndex: 1,
      explain: "地球磁场像盾牌一样偏转太阳风，带电粒子沿着磁力线在南北极附近冲入大气层，激发氧原子和氮原子发出绚丽极光！"
    },
    parentTip: "用一块条形磁铁在白纸下放铁屑，就能看见磁力线像花瓣一样全部收束回磁铁两端的“南北极”，跟极光原理一模一样！",
    sources: [
      { title: "NASA Space Place · What Is an Aurora?", url: "https://spaceplace.nasa.gov/aurora/en/" },
      { title: "NOAA Space Weather Prediction Center · Aurora Tutorial", url: "https://www.swpc.noaa.gov/content/tips-viewing-aurora" }
    ]
  },
  {
    id: "timezones-dateline",
    realm: "sky",
    emoji: "🕒",
    title: "为什么爸爸坐飞机往东飞，居然能“倒流”回昨天？",
    subtitle: "每 15° 经度差 1 小时、0° 本初子午线、北京时间东八区与 180° 国际日界线",
    badge: "全球时区 · 国际日界线",
    trigger: "小念看到爸爸的机票日期愣住了：星期二上午从东京起飞，飞了九小时到美国居然写着“星期一晚上降落”！",
    difficulty: "explorer",
    tags: ["时区", "国际日界线", "经度", "北京时间"],
    dialogue: [
      {
        nian: "爸爸你是不是坐了时光机呀？为什么星期二从东京飞往美国旧金山，降落时手机上却显示“星期一”？",
        dad: "哈哈，不是时光机，是地球画在太平洋中间的“国际日界线”变了个日期魔术！地球自西向东 24 小时自转 360 度，算一下 360 ÷ 24 = 15，所以每往东跨过 15 度经度，钟表就拨快 1 小时。",
        steps: [
          { icon: "🌍", label: "地球 24h 转 360° (15°/h)" },
          { icon: "🕒", label: "全球划分为 24 个时区" },
          { icon: "📅", label: "跨过 180° 日界线日期加减一天" }
        ]
      },
      {
        nian: "那全球的钟表是从哪里开始算 0 点的呀？",
        dad: "大家约定把穿过英国伦敦格林威治天文台的那条经线定为 0° 本初子午线，是“零时区”；北京在东边大约东经 120 度附近，120 ÷ 15 = 8，所以咱们用的是“东八区”，比伦敦早整整 8 个小时！",
        figure: {
          kind: "scale",
          caption: "同一时刻世界手表对比（假设北京时间 16:00）",
          stops: [
            { label: "纽约 (西五区)", note: "凌晨 03:00", color: "#64748b" },
            { label: "伦敦 (零时区)", note: "上午 08:00", color: "#4d96ff" },
            { label: "北京 (东八区)", note: "下午 16:00", color: "#ff9f43", hot: true },
            { label: "东京 (东九区)", note: "下午 17:00", color: "#a66cff" }
          ]
        }
      },
      {
        nian: "等一下！如果一直往东拨快手表，绕地球一圈岂不是多出来一天 24 小时？",
        dad: "太会算啦！为了不让日期乱套，大家在人烟最稀少的太平洋正中间、大致沿着 180° 经线划了一根“国际日界线”。从亚洲往东飞过这条线去美洲，日期要减一天；反过来从美洲往西飞过它回亚洲，日期要加一天！",
        factBadge: {
          icon: "〰️",
          title: "国际日界线为什么扭来扭去不是直线？",
          detail: "为了不把同一个岛国或群岛劈成“左边周二、右边周一”，日界线特意绕开陆地和海岛！"
        }
      },
      {
        nian: "哇，太平洋上那几个小岛国每天是不是地球上最早迎接新年第一缕阳光的地方？",
        dad: "对！像基里巴斯和新西兰都在国际日界线西侧紧挨着它，所以每年跨年倒数，新西兰和汤加总是最早跨进新的一年！"
      },
      {
        nian: "我懂了！每 15 度差一小时，日界线就像地球的“日历校准线”，难怪往东跨过去能回到昨天吃两顿生日蛋糕！",
        dad: "哈哈，以后咱们真可以找机会体验一下在飞机上跨过国际日界线的奇妙感觉！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 从东京飞回“昨天”的航线",
        badgeLabel: "跨越太平洋 180° 线",
        duration: 7,
        camera: { center: [180, 36], lonSpan: 130 },
        routes: [
          {
            id: "tokyo-sf",
            label: "东跨 180° 日期减一天",
            color: "#a66cff",
            waypoints: [[139.77, 35.68], [165, 42], [-170, 44], [-145, 41], [-122.42, 37.77]],
            traveler: "✈️",
            width: 3.5,
            startAt: 0.08,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "tokyo-tz", label: "东京 (东九区)", coord: [139.77, 35.68], icon: "🗼", align: "l" },
          { id: "sf-tz", label: "旧金山 (西八区)", coord: [-122.42, 37.77], icon: "🌉", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 每 15° 差 1 小时的地球时钟",
        badgeLabel: "0° 格林威治 ↔ 180° 日界线",
        duration: 8,
        kind: "diagram",
        diagram: "timezone-spin",
        camera: { center: [60, 20], lonSpan: 150 }
      },
      {
        turn: 2,
        title: "3 · 绕开岛屿的锯齿日界线",
        badgeLabel: "180° 国际日界线",
        duration: 7,
        camera: { center: [176, 12], lonSpan: 80 },
        routes: [
          {
            id: "idl-zigzag",
            label: "180° 国际日界线",
            color: "#ef4444",
            waypoints: [[-169, 65], [178, 50], [180, 25], [-172, 0], [-174, -20], [180, -45]],
            dashed: true,
            width: 3,
            startAt: 0.05,
            endAt: 0.9
          }
        ],
        markers: [
          { id: "auckland-nz", label: "新西兰 (最早迎新年)", coord: [174.76, -36.85], icon: "🎆", align: "l" },
          { id: "honolulu", label: "夏威夷 (较晚入夜)", coord: [-157.85, 21.31], icon: "🌺", align: "r" }
        ],
        myth: {
          wrong: "以为国际日界线是一根笔直沿着 180° 经线的线",
          right: "日界线在白令海峡和南太平洋特意拐弯，免得同一个国家被分成两个日期！"
        }
      },
      {
        turn: 3,
        title: "4 · 伦敦零时区与北京时间",
        badgeLabel: "东八区早 8 小时",
        duration: 6,
        camera: { center: [58, 42], lonSpan: 140 },
        markers: [
          { id: "greenwich", label: "伦敦格林威治 0°", coord: [0, 51.48], icon: "🕰️", align: "l" },
          { id: "beijing-tz", label: "北京 116.4°E (东八区)", coord: [116.4, 39.9], icon: "🇨🇳", align: "r" }
        ]
      },
      {
        turn: 4,
        title: "5 · 地球转出 24 个时区",
        badgeLabel: "东早西晚 · 每15°一小时",
        duration: 6,
        camera: { center: [20, 25], lonSpan: 240 },
        markers: [
          { id: "nyc-end", label: "纽约", coord: [-74.0, 40.71], icon: "🗽", align: "l" },
          { id: "lon-end", label: "伦敦 0°", coord: [0, 51.48], icon: "🕰️", align: "t" },
          { id: "bj-end2", label: "北京 +8h", coord: [116.4, 39.9], icon: "🏮", align: "r" }
        ]
      }
    ],
    quiz: {
      prompt: "地球每自转多少度经度，地方时间大约相差 1 小时？",
      options: [
        "10 度",
        "15 度（360° ÷ 24小时）",
        "30 度"
      ],
      answerIndex: 1,
      explain: "地球一周 360° 自转一圈约 24 小时，360° ÷ 24 = 15°，所以每跨越 15° 经度就是一个标准时区（1小时）！"
    },
    parentTip: "可以拿家里时钟和地球仪试一试：在伦敦指向早上 8 点时，往东数 8 个 15°（120°E），正好对应北京下午 4 点！",
    sources: [
      { title: "NOAA National Ocean Service · What Is the International Date Line?", url: "https://oceanservice.noaa.gov/facts/international-date-line.html" },
      { title: "Royal Museums Greenwich · Prime Meridian and Time Zones", url: "https://www.rmg.co.uk/stories/topics/what-prime-meridian-why-it-greenwich" }
    ]
  },

  // ==================== 6. human ====================
  {
    id: "seven-continents-records",
    realm: "human",
    emoji: "🏆",
    title: "七大洲五大洋分别藏着什么“世界之最”？",
    subtitle: "珠峰 8848.86m、死海 -430m、撒哈拉、亚马孙、南极冰盖与大堡礁",
    badge: "地球吉尼斯全图",
    trigger: "小念想列一张“地球之最奖状榜”，给七大洲五大洋都颁一块独一无二的金牌！",
    difficulty: "starter",
    tags: ["七大洲", "五大洋", "世界之最", "死海", "大堡礁"],
    dialogue: [
      {
        nian: "爸爸，如果给七大洲和五大洋颁奖，每个大洲都能拿到什么“世界之最”金牌呀？",
        dad: "太好玩了！亚洲面积最大、人口最多，既有世界最高峰珠穆朗玛峰（8848.86 米），还有陆地最低点——西亚约旦和以色列之间的“死海”岸边，低于海平面约 430 米呢！",
        figure: {
          kind: "bars",
          caption: "七大洲面积大小排排队（万平方公里）",
          items: [
            { label: "亚洲", value: 4458, unit: "万km²", color: "#ff9f43" },
            { label: "非洲", value: 3037, unit: "万km²", color: "#f59e0b" },
            { label: "北美洲", value: 2471, unit: "万km²", color: "#4d96ff" },
            { label: "南美洲", value: 1784, unit: "万km²", color: "#3bb273" },
            { label: "南极洲", value: 1420, unit: "万km²", color: "#64748b" },
            { label: "欧洲", value: 1018, unit: "万km²", color: "#a66cff" },
            { label: "大洋洲", value: 853, unit: "万km²", color: "#2aa89b" }
          ]
        }
      },
      {
        nian: "哇，非洲和美洲又能拿什么奖状？",
        dad: "非洲是“热带大陆”，国家数最多，有世界最大的撒哈拉沙漠和最长的尼罗河；南美洲有流量最大的亚马孙河、最茂密的热带雨林和陆地上最长的安第斯山脉（约 7000 公里）！北美洲则有震撼的科罗拉多大峡谷和五大淡水湖。",
        steps: [
          { icon: "🌏", label: "亚：最高峰+最低死海" },
          { icon: "🦁", label: "非：最大沙漠+最长河" },
          { icon: "🦜", label: "南美：最大雨林+最长山脉" }
        ]
      },
      {
        nian: "大洋洲、欧洲和南极洲呢？千万不能漏掉它们！",
        dad: "大洋洲面积最小，却拥有在太空都能看见的地球最大珊瑚礁群——澳大利亚“大堡礁”！欧洲地形最平缓、平均海拔最低；而南极洲平均海拔反而高达两千多米，把地球大约 70% 的淡水冻成厚厚冰盖，也是地球最冷、风最大的大洲！",
        factBadge: {
          icon: "🌊",
          title: "海洋也占了地球表面 71% 的面积",
          detail: "太平洋、大西洋、印度洋、北冰洋和南大洋互相连通，太平洋自己就比所有陆地加起来还大！"
        }
      },
      {
        nian: "为什么“死海”叫死海，人躺上去居然沉不下去？",
        dad: "因为死海在干热的谷底没有出口，湖水拼命蒸发只留下盐分，含盐量比普通海水高出快十倍！鱼虾活不了，可浮力大到人可以飘在水面上悠闲地看报纸呢。"
      },
      {
        nian: "我全都记下来啦！亚洲最高又最低，非洲最热沙漠大，南美雨林山脉长，澳洲珊瑚南极冰，欧洲平平最好逛！",
        dad: "你这首七大洲顺口溜编得比地理课本还好记！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 亚洲：最高珠峰与最低死海",
        badgeLabel: "+8848.86m vs -430m",
        duration: 7,
        camera: { center: [64, 30], lonSpan: 72 },
        markers: [
          { id: "dead-sea", label: "死海 (-430m)", place: "陆地最低点", coord: [35.5, 31.5], icon: "🧂", align: "l" },
          { id: "everest-rec", label: "珠峰 (+8848.86m)", coord: [86.92, 27.99], icon: "🏔️", align: "r" }
        ]
      },
      {
        turn: 1,
        title: "2 · 美洲与非洲的超级纪录",
        badgeLabel: "撒哈拉 · 安第斯 · 科罗拉多",
        duration: 7,
        camera: { center: [-30, 8], lonSpan: 145 },
        zones: [GEO_ZONES.sahara_belt, GEO_ZONES.amazon_rainforest],
        markers: [
          { id: "grand-canyon", label: "科罗拉多大峡谷", coord: [-112.11, 36.11], icon: "🏜️", align: "l" },
          { id: "andes", label: "安第斯山脉(陆上最长)", coord: [-69.5, -18], icon: "⛰️", align: "l" },
          { id: "sahara-rec", label: "撒哈拉(最大热沙漠)", coord: [14, 24], icon: "🐪", align: "r" }
        ]
      },
      {
        turn: 2,
        title: "3 · 大洋洲大堡礁与欧美极地",
        badgeLabel: "最小大洲也有宇宙级奇观",
        duration: 7,
        camera: { center: [135, -18], lonSpan: 80 },
        markers: [
          { id: "barrier-reef", label: "大堡礁", place: "地球最大珊瑚礁群", coord: [147.5, -18.3], icon: "🐠", align: "r" }
        ],
        myth: {
          wrong: "以为南极洲只是浮在北冰洋一样的海上大冰块",
          right: "南极洲下面是一块真正的岩石大陆，覆盖着平均两千多米厚的冰盖！"
        }
      },
      {
        turn: 3,
        title: "4 · 能飘起来看报的死海",
        badgeLabel: "高盐高浮力",
        duration: 6,
        camera: { center: [35.5, 31.5], lonSpan: 14 },
        markers: [
          {
            id: "deadsea-zoom",
            label: "死海岸边 -430 米",
            place: "约旦与以色列交界",
            coord: [35.5, 31.5],
            icon: "🧂",
            align: "t",
            note: "含盐度约 34%，人躺在水上不会沉下去！"
          }
        ]
      },
      {
        turn: 4,
        title: "5 · 七大洲金牌全图",
        badgeLabel: "蓝色水球 71% 是海",
        duration: 6,
        camera: { center: [20, 14], lonSpan: 240 },
        markers: [
          { id: "asia-g", label: "亚洲(最大)", coord: [95, 38], icon: "🐼", align: "t" },
          { id: "eu-g", label: "欧洲(最低平)", coord: [15, 50], icon: "🏰", align: "t" },
          { id: "af-g", label: "非洲(最热)", coord: [20, 4], icon: "🦁", align: "b" },
          { id: "au-g", label: "大洋洲(大堡礁)", coord: [134, -24], icon: "🦘", align: "b" }
        ]
      }
    ],
    quiz: {
      prompt: "七大洲中“平均海拔最低”的大洲和“地球最大珊瑚礁群大堡礁”所在地分别是？",
      options: [
        "欧洲 和 大洋洲（澳大利亚）",
        "亚洲 和 南美洲",
        "非洲 和 北美洲"
      ],
      answerIndex: 0,
      explain: "欧洲地形多平原、平均海拔在七大洲中最低；大洋洲面积最小，东北部海域却拥有世界最大珊瑚礁群大堡礁！"
    },
    parentTip: "可以在水杯里加几勺盐搅匀，把生鸡蛋放进去浮起来，让孩子亲手体验“死海浮力”的秘密！",
    sources: [
      { title: "National Geographic Education · Continent", url: "https://education.nationalgeographic.org/resource/continent/" },
      { title: "NASA Earth Observatory · The Dead Sea", url: "https://earthobservatory.nasa.gov/images/77092/the-dead-sea" }
    ]
  },
  {
    id: "why-cities-on-rivers",
    realm: "human",
    emoji: "🏙️",
    title: "为什么全世界的超级大城市总爱长在河边和海口？",
    subtitle: "淡水、平地、肥沃农田与水运港口：上海、开罗、伦敦、巴黎、纽约",
    badge: "聚落地理 · 依水而生",
    trigger: "小念在地图上点开世界名城，惊讶地发现上海、开罗、伦敦、巴黎、纽约全都蹲在河流或海口旁边！",
    difficulty: "starter",
    tags: ["城市地理", "上海", "伦敦", "开罗", "河口港"],
    dialogue: [
      {
        nian: "爸爸你看！为什么巴黎守着塞纳河，伦敦跨过泰晤士河，上海蹲在长江口，纽约长在哈德逊河口，大城市全像约好了一样贴着水？",
        dad: "因为古人选地方建城，第一件要紧事就是找水喝、种粮食和运东西！河水不仅给全城人提供淡水，冲出来的平坦两岸还好盖房子、种庄稼。",
        steps: [
          { icon: "💧", label: "随时有干净淡水喝" },
          { icon: "🌾", label: "平地肥土好种庄稼" },
          { icon: "⛵", label: "河运海运省力又便宜" }
        ]
      },
      {
        nian: "坐船真的比马车卡车运东西还厉害吗？",
        dad: "厉害得多！直到今天，用大船在水上运一吨货物，依然比公路便宜好多倍。如果一座城正好站在“大河入海口”，里头连着全国内河小船，外头连着全世界远洋巨轮，就像上海和纽约一样，想不热闹都难！",
        factBadge: {
          icon: "⚓",
          title: "上海港连续多年居世界集装箱吞吐量前列",
          detail: "背靠长江黄金水道，面向太平洋航线，正是“江海交汇”黄金十字路口！"
        }
      },
      {
        nian: "那古代沙漠边上的开罗呢，它也是靠着尼罗河才活下来的吗？",
        dad: "完全正确！埃及四周大部分是撒哈拉黄沙，唯独尼罗河每年定期涨水带来肥沃黑泥，于是几千年前就在河谷和三角洲顶点长出了金字塔和开罗城。"
      },
      {
        nian: "还有哪些城市是因为“山谷关口”或者“两条河汇合”才长大的呢？",
        dad: "我们中国的武汉就长在长江和汉江交汇的“九省通衢”上；重庆长在长江和嘉陵江汇合处；而兰州守在黄河谷地与河西走廊的咽喉路口，每一座城的位置都在讲地理故事！"
      },
      {
        nian: "我懂啦！城市不是乱长出来的，有淡水、有平地、还能让船进出的十字路口，自然会变成大城市！",
        dad: "你已经学会人文地理最核心的“区位眼光”啦！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 河口大都市的秘密剖面",
        badgeLabel: "水源 · 平地 · 港口",
        duration: 7,
        kind: "diagram",
        diagram: "river-city",
        camera: { center: [121.5, 31.2], lonSpan: 24 }
      },
      {
        turn: 1,
        title: "2 · 江海交汇的超级大港上海",
        badgeLabel: "长江黄金水道 + 东海",
        duration: 7,
        camera: { center: [118, 31], lonSpan: 22 },
        showChinaProvinces: true,
        markers: [
          { id: "wuhan-c", label: "武汉 (汉江+长江)", coord: [114.3, 30.6], icon: "🌉", align: "l" },
          { id: "nanjing-c", label: "南京 (长江下游)", coord: [118.78, 32.06], icon: "🏯", align: "t" },
          { id: "shanghai-c", label: "上海 (江海交汇)", coord: [121.47, 31.23], icon: "⚓", align: "r" }
        ]
      },
      {
        turn: 2,
        title: "3 · 尼罗河喂养出的开罗",
        badgeLabel: "沙漠中的绿色走廊",
        duration: 7,
        camera: { center: [31, 29], lonSpan: 26 },
        zones: [GEO_ZONES.sahara_belt],
        markers: [
          { id: "cairo-c", label: "开罗 · 金字塔", place: "尼罗河三角洲顶点", coord: [31.23, 30.04], icon: "🔺", align: "r" }
        ],
        myth: {
          wrong: "以为大城市建在哪里全看皇帝拍脑袋决定",
          right: "水源、平地和河海交通枢纽才是城市千年兴盛的地理底气！"
        }
      },
      {
        turn: 3,
        title: "4 · 欧洲与美洲名城的水上名片",
        badgeLabel: "泰晤士 · 塞纳 · 哈德逊",
        duration: 7,
        camera: { center: [-30, 44], lonSpan: 95 },
        markers: [
          { id: "nyc-c", label: "纽约 (哈德逊河口)", coord: [-74.0, 40.71], icon: "🗽", align: "r" },
          { id: "london-c", label: "伦敦 (泰晤士河)", coord: [-0.12, 51.5], icon: "🕰️", align: "t" },
          { id: "paris-c", label: "巴黎 (塞纳河)", coord: [2.35, 48.85], icon: "🗼", align: "b" }
        ]
      },
      {
        turn: 4,
        title: "5 · 世界沿河都市带",
        badgeLabel: "依水而居的人类智慧",
        duration: 6,
        camera: { center: [40, 34], lonSpan: 170 },
        markers: [
          { id: "london-end-c", label: "伦敦", coord: [-0.12, 51.5], icon: "🕰️", align: "t" },
          { id: "cairo-end-c", label: "开罗", coord: [31.23, 30.04], icon: "🔺", align: "b" },
          { id: "shanghai-end-c", label: "上海", coord: [121.47, 31.23], icon: "⚓", align: "r" }
        ]
      }
    ],
    quiz: {
      prompt: "上海、伦敦、纽约、开罗等世界大都市都建在大河沿岸或河口，最核心的地理优势不包括哪一项？",
      options: [
        "稳定的淡水供应与肥沃平地",
        "便利低廉的内河与海运航运通道",
        "因为河边永远不会有风"
      ],
      answerIndex: 2,
      explain: "大河与河口为城市提供了水源、平坦肥沃土地和便捷水运；河海交界处风力往往不小，并非为了躲风。"
    },
    parentTip: "打开手机地图放大自己居住的城市，和孩子找一找穿城而过的河流或湖泊，看看城市老街区是不是贴着水边！",
    sources: [
      { title: "National Geographic Education · Urban Area & River Settlements", url: "https://education.nationalgeographic.org/resource/urban-area/" },
      { title: "UNESCO Intergovernmental Hydrological Programme · Water and Settlements", url: "https://www.unesco.org/en/ihp" }
    ]
  },
  {
    id: "vertical-climate-andes",
    realm: "weather",
    emoji: "🏔️",
    title: "为什么赤道边上的山顶也能积着千年不化的雪？",
    subtitle: "海拔每升高 1000 米降温约 6℃、乞力马扎罗山“赤道雪冠”与垂直自然带",
    badge: "垂直气候带 · 一山有四季",
    trigger: "小念看非洲赤道附近的照片惊呆了：山脚下长颈鹿在晒大太阳，山顶居然顶着厚厚的白雪冰帽！",
    difficulty: "explorer",
    tags: ["垂直自然带", "乞力马扎罗", "气温直减率", "横断山区"],
    dialogue: [
      {
        nian: "爸爸是不是 P 图了呀？赤道附近一年到头那么热，为什么非洲最高峰乞力马扎罗山顶上还戴着一顶大雪帽？",
        dad: "可不是 P 图，这就是大名鼎鼎的“赤道雪山”！虽然山脚下接近赤道有二十八九度，但空气有个铁规矩——海拔每往高处爬 1000 米，气温大约下降 6℃！乞力马扎罗山海拔 5895 米，山顶比山脚冷将近 35℃，当然常年零下结冰积雪啦！",
        steps: [
          { icon: "🌴", label: "山脚：28℃ 热带雨林草原" },
          { icon: "🌼", label: "半山：10℃ 温带森林草甸" },
          { icon: "❄️", label: "山顶：-7℃ 冰川雪冠" }
        ]
      },
      {
        nian: "天哪，那从山脚爬到山顶，岂不是一天就能把从赤道到北极的气候全逛一遍？",
        dad: "完全没错！地理学家叫它“垂直自然带”。在南美洲赤道附近的安第斯山脉也是一样，山脚种可可香蕉，半山坡气候像春天一样适合住人和种咖啡，再往上只有高原羊驼和冰雪呢！",
        figure: {
          kind: "bars",
          caption: "海拔升高 5000 米的温度大跳水（℃）",
          items: [
            { label: "山脚 0米", value: 28, unit: "℃", color: "#ea580c" },
            { label: "半山 2500米", value: 13, unit: "℃", color: "#3bb273" },
            { label: "山顶 5500米", value: -5, unit: "℃", color: "#3b82f6" }
          ]
        }
      },
      {
        nian: "为什么爬山越往上越靠近太阳，反而越冷而不是越热呢？",
        dad: "绝妙的问题！因为太阳光直接穿过透明空气不太暖和空气，它先把地面晒热，地面再像小暖气片一样把空气烤暖。离地面“暖气片”越远的高空空气又稀薄，热量全跑散啦，所以高山顶上冷飕飕的！",
        factBadge: {
          icon: "✈️",
          title: "民航客机飞在 1 万米高空，窗外零下 50 多度！",
          detail: "正是因为越往高空越冷，飞机飞过赤道上空，机翼外面照样冰天雪地。"
        }
      },
      {
        nian: "我们中国也有这样“一山有四季”的神奇高山吗？",
        dad: "有呀！四川云南交界的横断山区和贡嘎山就是典范！山谷底闷热像夏天，半山腰开满杜鹃像春天，山顶上却白雪皑皑，当地人真的说“一山有四季，十里不同天”！"
      },
      {
        nian: "我彻底明白啦！地面才是空气的暖气片，每升高 1000 米降温 6℃，所以赤道高山顶也能长出冰雪童话！",
        dad: "太棒了！以后坐缆车上高山，别忘了带一件厚外套，因为山顶比山脚冷多啦！"
      }
    ],
    scenes: [
      {
        turn: 0,
        title: "1 · 非洲屋脊乞力马扎罗",
        badgeLabel: "3°S 赤道雪冠 5895m",
        duration: 7,
        showTropics: true,
        camera: { center: [36, -3], lonSpan: 34 },
        markers: [
          {
            id: "kilimanjaro",
            label: "乞力马扎罗山",
            place: "坦桑尼亚 · 5895 米",
            coord: [37.35, -3.07],
            icon: "🏔️",
            align: "r",
            note: "距离赤道仅 300 多公里，山顶却常年覆盖冰川雪帽！"
          }
        ]
      },
      {
        turn: 1,
        title: "2 · 垂直自然带爬坡动画",
        badgeLabel: "每升 1000m 降约 6℃",
        duration: 8,
        kind: "diagram",
        diagram: "vertical-zones",
        camera: { center: [37, -3], lonSpan: 24 }
      },
      {
        turn: 2,
        title: "3 · 南美赤道安第斯雪峰",
        badgeLabel: "基多春城与钦博拉索",
        duration: 7,
        showTropics: true,
        camera: { center: [-78, -2], lonSpan: 28 },
        markers: [
          { id: "quito", label: "基多 (海拔2850m四季如春)", coord: [-78.47, -0.18], icon: "🌼", align: "l" },
          { id: "chimborazo", label: "钦博拉索山 (6263m)", coord: [-78.82, -1.47], icon: "❄️", align: "r" }
        ],
        myth: {
          wrong: "以为山顶离太阳近几十公里所以应该更暖和",
          right: "大气热量主要来自地面暖气片辐射，每升高 1000 米反而冷约 6℃！"
        }
      },
      {
        turn: 3,
        title: "4 · 中国横断山“一山有四季”",
        badgeLabel: "7556m 贡嘎山",
        duration: 7,
        showChinaProvinces: true,
        camera: { center: [101.5, 29], lonSpan: 18 },
        markers: [
          { id: "gongga", label: "贡嘎雪山 7556m", coord: [101.88, 29.6], icon: "🏔️", align: "r" },
          { id: "lijiang", label: "玉龙雪山", coord: [100.18, 27.1], icon: "❄️", align: "l" }
        ]
      },
      {
        turn: 4,
        title: "5 · 竖起来的地球气候带",
        badgeLabel: "高度也是气候魔法棒",
        duration: 6,
        showTropics: true,
        camera: { center: [35, 10], lonSpan: 150 },
        markers: [
          { id: "chili-end", label: "安第斯雪峰", coord: [-78.82, -1.47], icon: "❄️", align: "l" },
          { id: "kili-end", label: "乞力马扎罗", coord: [37.35, -3.07], icon: "🏔️", align: "t" },
          { id: "gongga-end", label: "横断山脉", coord: [101.88, 29.6], icon: "🌲", align: "r" }
        ]
      }
    ],
    quiz: {
      prompt: "如果海平面山脚的气温是 28℃，爬到海拔 3000 米的山顶时气温大约会降到多少度？",
      options: [
        "大约 10℃（每升高 1000 米降温约 6℃）",
        "还是 28℃ 不变",
        "升高到 40℃"
      ],
      answerIndex: 0,
      explain: "对流层中海拔每升高 1000 米，气温约下降 6℃，升高 3000 米大约降温 18℃，28℃ - 18℃ = 10℃！"
    },
    parentTip: "下次去爬山或坐飞机时，可以和孩子一起看机舱屏幕上的“舱外温度”随高度不断掉到零下五十度！",
    sources: [
      { title: "UNESCO World Heritage Centre · Kilimanjaro National Park", url: "https://whc.unesco.org/en/list/403/" },
      { title: "NOAA JetStream · Layers of the Atmosphere (Lapse Rate)", url: "https://www.noaa.gov/jetstream/atmosphere/layers-of-atmosphere" }
    ]
  }
];
