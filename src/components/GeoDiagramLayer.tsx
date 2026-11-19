import type { DiagramId } from "../data/types.ts";
import { STAGE_H, STAGE_W } from "../lib/geo.ts";
import { clamp01, easeInOutCubic, easeOutCubic, lerp, pulse } from "../lib/motion.ts";

type Props = {
  diagram: DiagramId;
  progress: number;
  hasMyth?: boolean;
  /** 雨影实验台可选参数：山脉海拔高度（500~6000 米） */
  mountainHeight?: number;
};

/** 800×560 纯时间驱动地理原理动画剖面引擎（与地图舞台共用同一坐标系与顶/底安全区） */
export function GeoDiagramLayer({ diagram, progress, hasMyth = false, mountainHeight }: Props) {
  const p = clamp01(progress);
  const e = easeInOutCubic(p);
  const eo = easeOutCubic(p);
  const bob = Math.sin(p * Math.PI * 4) * 4;
  const safeBottomY = hasMyth ? 458 : 528;

  switch (diagram) {
    case "pangaea": {
      const split = lerp(0, 125, e);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#dff2ff" />
          {/* 地幔岩浆上涌带 */}
          <rect x={392 - split * 0.08} y="150" width={16 + split * 0.16} height="330" rx="8" fill="#ff7043" opacity={0.25 + e * 0.55} />
          <path d="M400 470 L400 175" stroke="#ff5722" strokeWidth="5" strokeDasharray="8 6" opacity={e} />
          {/* 南美洲向左漂移 */}
          <g transform={`translate(${-split}, 0)`}>
            <path d="M235 165 L385 170 L398 225 L368 295 L340 390 L300 425 L285 330 L240 245 Z" fill="#8fd19e" stroke="#2f8a3c" strokeWidth="3" />
            <text x="315" y="255" textAnchor="middle" fontWeight="700" fontSize="18" fill="#1f5c2a">南美洲</text>
          </g>
          {/* 非洲向右漂移 */}
          <g transform={`translate(${split}, 0)`}>
            <path d="M405 160 L545 155 L585 230 L555 320 L515 415 L455 410 L440 300 L405 245 Z" fill="#f7c97e" stroke="#b55d00" strokeWidth="3" />
            <text x="495" y="260" textAnchor="middle" fontWeight="700" fontSize="18" fill="#6b3b00">非洲</text>
          </g>
          {e > 0.2 && (
            <g opacity={clamp01((e - 0.2) * 2)}>
              <text x="400" y="138" textAnchor="middle" fontWeight="700" fontSize="16" fill="#c94040">
                🌋 大西洋中脊 · 岩浆造出新海底
              </text>
              <text x={365 - split * 0.4} y="320" textAnchor="middle" fontSize="22">⬅️</text>
              <text x={435 + split * 0.4} y="320" textAnchor="middle" fontSize="22">➡️</text>
            </g>
          )}
        </g>
      );
    }

    case "subduction-uplift": {
      const push = lerp(0, 110, e);
      const peakLift = lerp(0, 125, easeOutCubic(clamp01((p - 0.15) / 0.85)));
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f4ff" />
          {/* 地幔红底 */}
          <rect x="0" y="380" width={STAGE_W} height="180" fill="#ff9d76" opacity="0.55" />
          <text x="400" y={safeBottomY - 12} textAnchor="middle" fontWeight="700" fontSize="15" fill="#9e3018">
            🔥 软流圈地幔（岩石被挤压变形）
          </text>
          {/* 欧亚大陆（右侧稳固） */}
          <path d="M390 290 L790 290 L790 385 L390 385 Z" fill="#f3d299" stroke="#9e6d2f" strokeWidth="2.5" />
          <text x="640" y="345" textAnchor="middle" fontWeight="700" fontSize="18" fill="#5d4e37">欧亚板块</text>
          {/* 古特提斯海洋逐渐挤压消失 & 喜马拉雅隆起 */}
          <path
            d={`M255 290 L335 ${290 - peakLift * 0.65} L415 ${290 - peakLift} L495 ${290 - peakLift * 0.55} L545 290 Z`}
            fill="#d9c2a3"
            stroke="#7c5634"
            strokeWidth="3"
          />
          {/* 山顶雪帽 */}
          {peakLift > 35 && (
            <polygon
              points={`415,${290 - peakLift} 388,${290 - peakLift * 0.7} 404,${290 - peakLift * 0.74} 415,${290 - peakLift * 0.68} 428,${290 - peakLift * 0.74} 442,${290 - peakLift * 0.7}`}
              fill="#ffffff"
            />
          )}
          {/* 海底贝壳跟着被抬到山顶！ */}
          <text x="415" y={272 - peakLift} textAnchor="middle" fontSize="22">🐚</text>
          <text x="415" y={244 - peakLift} textAnchor="middle" fontWeight="700" fontSize="15" fill="#1e40af">
            珠穆朗玛峰 8848.86米
          </text>
          {/* 印度板块从左向右俯冲推进 */}
          <g transform={`translate(${push}, 0)`}>
            <path d="M10 290 L280 290 L365 385 L10 385 Z" fill="#8fd19e" stroke="#2f8a3c" strokeWidth="2.5" />
            <text x="145" y="345" textAnchor="middle" fontWeight="700" fontSize="18" fill="#1f5c2a">印度板块 ➡️</text>
          </g>
        </g>
      );
    }

    case "ring-subduction": {
      const dive = lerp(0, 1, eo);
      const lavaY = lerp(420, 148, clamp01((p - 0.3) / 0.65));
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e4f3ff" />
          {/* 海洋水体 */}
          <rect x="0" y="210" width="470" height="175" fill="#60a5fa" fillOpacity="0.45" />
          <text x="140" y="242" textAnchor="middle" fontWeight="700" fontSize="15" fill="#1e3a8a">🌊 太平洋深海</text>
          {/* 大洋板块俯冲进地幔 */}
          <path d="M0 300 L290 300 L440 465 L350 475 L250 350 L0 350 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
          <text x="150" y="330" textAnchor="middle" fontWeight="700" fontSize="15" fill="#ffffff">大洋板块俯冲 ↘</text>
          {/* 马里亚纳海沟标注 */}
          <line x1="295" y1="215" x2="295" y2="338" stroke="#1e3a8a" strokeWidth="2" strokeDasharray="4 4" />
          <text x="295" y="198" textAnchor="middle" fontWeight="700" fontSize="15" fill="#1e3a8a">
            马里亚纳海沟 -10,935米
          </text>
          {/* 大陆板块 + 火山 */}
          <path d="M350 280 L485 280 L555 170 L625 280 L800 280 L800 475 L460 475 Z" fill="#d4b483" stroke="#8b6239" strokeWidth="2.5" />
          {/* 岩浆上升通道 */}
          <path d={`M470 430 Q530 330 555 ${lavaY}`} fill="none" stroke="#ef4444" strokeWidth={10 * dive + 2} strokeLinecap="round" opacity={0.8} />
          <circle cx="555" cy="415" r={22 + pulse(p, 2) * 6} fill="#ff5722" opacity="0.85" />
          {p > 0.55 && (
            <g transform={`translate(555, ${155 + bob * 0.5})`}>
              <text y="0" textAnchor="middle" fontSize="34">🌋</text>
              <text y="-32" textAnchor="middle" fontWeight="700" fontSize="16" fill="#c94040">岩浆喷发成火山链</text>
            </g>
          )}
        </g>
      );
    }

    case "rain-shadow": {
      const hRatio = mountainHeight !== undefined ? clamp01((mountainHeight - 500) / 5500) : 0.65;
      const peakY = lerp(310, 145, hRatio);
      const cloudX = lerp(95, 420, eo);
      const cloudY =
        cloudX < 340
          ? lerp(290, peakY - 18, clamp01((cloudX - 95) / 245))
          : lerp(peakY - 18, 260, clamp01((cloudX - 340) / 160));
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e6f4ff" />
          {/* 海洋与阳光 */}
          <rect x="0" y="385" width="210" height="175" fill="#38bdf8" fillOpacity="0.65" />
          <text x="105" y="425" textAnchor="middle" fontWeight="700" fontSize="16" fill="#0369a1">🌊 暖湿海洋</text>
          {/* 大山横亘中间 */}
          <polygon points={`180,385 400,${peakY} 620,385`} fill="#9ca3af" stroke="#6b7280" strokeWidth="3" />
          {/* 迎风坡绿林 + 背风坡荒漠 */}
          <polygon points={`180,385 380,${peakY + 20} 380,385`} fill="#6bcb77" fillOpacity="0.55" />
          <rect x="520" y="385" width="280" height="175" fill="#f7c97e" fillOpacity="0.8" />
          <text x="275" y="365" textAnchor="middle" fontWeight="700" fontSize="16" fill="#166534">🌲 迎风坡（湿润多雨）</text>
          <text x="655" y="425" textAnchor="middle" fontWeight="700" fontSize="16" fill="#9a3412">🌵 背风坡雨影区（干旱沙漠）</text>
          {/* 上升湿润气流 */}
          <path d={`M100 345 Q210 325 350 ${peakY + 20}`} fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="8 6" />
          {/* 移动云朵 */}
          <g transform={`translate(${cloudX}, ${cloudY})`}>
            <text y="0" textAnchor="middle" fontSize="42">{cloudX < 395 ? "🌧️" : "☁️"}</text>
          </g>
          {/* 翻过山后干热下沉气流 */}
          {p > 0.45 && (
            <g opacity={clamp01((p - 0.45) * 2.5)}>
              <path d={`M445 ${peakY + 25} Q560 250 675 350`} fill="none" stroke="#ea580c" strokeWidth="4" strokeDasharray="7 5" />
              <text x="580" y="230" textAnchor="middle" fontWeight="700" fontSize="15" fill="#c2410c">
                干燥下沉风 ↘
              </text>
            </g>
          )}
        </g>
      );
    }

    case "hadley-cell": {
      const flow = (p * 1.4) % 1;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#eef7ff" />
          {/* 地面三条纬度带 */}
          <rect x="60" y="380" width="210" height="44" rx="10" fill="#f7c97e" stroke="#d97706" strokeWidth="2" />
          <text x="165" y="408" textAnchor="middle" fontWeight="700" fontSize="15" fill="#7c2d12">🏜️ 南纬30° 沙漠带</text>
          <rect x="295" y="380" width="210" height="44" rx="10" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
          <text x="400" y="408" textAnchor="middle" fontWeight="700" fontSize="15" fill="#14532d">🌴 赤道 0° 雨林带</text>
          <rect x="530" y="380" width="210" height="44" rx="10" fill="#f7c97e" stroke="#d97706" strokeWidth="2" />
          <text x="635" y="408" textAnchor="middle" fontWeight="700" fontSize="15" fill="#7c2d12">🏜️ 北纬30° 沙漠带</text>
          {/* 赤道热空气上升 */}
          <path d="M400 370 L400 155" stroke="#ef4444" strokeWidth="5" strokeDasharray="8 6" />
          <text x="400" y="132" textAnchor="middle" fontWeight="700" fontSize="16" fill="#dc2626">
            ☀️ 热空气上升 → 凝结成暴雨 🌧️
          </text>
          {/* 高空向南北分流再于30度下沉 */}
          <path d="M380 165 Q200 165 165 365" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="6 6" />
          <path d="M420 165 Q600 165 635 365" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="6 6" />
          <text x={lerp(380, 165, flow)} y={lerp(165, 365, flow * flow)} textAnchor="middle" fontSize="22">💨</text>
          <text x={lerp(420, 635, flow)} y={lerp(165, 365, flow * flow)} textAnchor="middle" fontSize="22">💨</text>
          <text x="165" y="340" textAnchor="middle" fontWeight="700" fontSize="14" fill="#b45309">干空气下沉 ⬇</text>
          <text x="635" y="340" textAnchor="middle" fontWeight="700" fontSize="14" fill="#b45309">干空气下沉 ⬇</text>
        </g>
      );
    }

    case "monsoon-flip": {
      const isWinter = p > 0.5;
      const move = (p * 2) % 1;
      const windX = isWinter ? lerp(180, 610, move) : lerp(610, 180, move);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={isWinter ? "#e0f2fe" : "#fef3c7"} />
          <rect x="60" y="250" width="320" height="170" rx="22" fill="#f3d299" stroke="#b45309" strokeWidth="3" />
          <text x="220" y="315" textAnchor="middle" fontWeight="700" fontSize="20" fill="#5d4e37">🏔️ 亚欧大陆</text>
          <text x="220" y="352" textAnchor="middle" fontWeight="700" fontSize="15" fill={isWinter ? "#1d4ed8" : "#dc2626"}>
            {isWinter ? "冬天降温快：冷高压 ❄️" : "夏天升温快：热低压 🔥"}
          </text>
          <rect x="430" y="250" width="310" height="170" rx="22" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="3" />
          <text x="585" y="315" textAnchor="middle" fontWeight="700" fontSize="20" fill="#ffffff">🌊 太平洋</text>
          <text x="585" y="352" textAnchor="middle" fontWeight="700" fontSize="15" fill="#eff6ff">
            {isWinter ? "海水较暖：风吹向海洋" : "海水凉润：东南风吹向中国 🌧️"}
          </text>
          <line x1="250" y1="190" x2="560" y2="190" stroke={isWinter ? "#2563eb" : "#16a34a"} strokeWidth="6" strokeDasharray="10 6" />
          <text x={windX} y="198" textAnchor="middle" fontSize="34">{isWinter ? "💨➡️" : "⬅️🌧️"}</text>
          <text x="400" y="138" textAnchor="middle" fontWeight="700" fontSize="18" fill={isWinter ? "#1e40af" : "#15803d"}>
            {isWinter ? "❄️ 冬季风：西北风从大陆吹向海洋（干冷）" : "🌱 夏季风：东南季风把海洋水汽送进江南"}
          </text>
        </g>
      );
    }

    case "china-steps": {
      const waterX = lerp(120, 725, eo);
      const waterY = waterX < 280 ? 150 : waterX < 515 ? lerp(150, 260, (waterX - 280) / 235) : lerp(260, 355, (waterX - 515) / 210);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#eef7ff" />
          {/* 三级阶梯剖面 */}
          <path d="M50 175 L270 175 L315 280 L505 280 L545 375 L730 375 L730 440 L50 440 Z" fill="#e6be8a" stroke="#9e6d2f" strokeWidth="3" />
          {/* 海洋 */}
          <rect x="705" y="375" width="95" height="65" fill="#38bdf8" fillOpacity="0.7" />
          <text x="752" y="412" textAnchor="middle" fontWeight="700" fontSize="14" fill="#0369a1">东海</text>
          {/* 阶梯高度与标签 */}
          <rect x="75" y="102" width="175" height="58" rx="12" fill="#ffffff" stroke="#a66cff" strokeWidth="2" />
          <text x="162" y="127" textAnchor="middle" fontWeight="700" fontSize="14" fill="#6b21a8">第一级 · 青藏高原</text>
          <text x="162" y="148" textAnchor="middle" fontSize="13" fill="#5d4e37">海拔 4000米以上 🏔️</text>

          <rect x="315" y="205" width="180" height="58" rx="12" fill="#ffffff" stroke="#ff9f43" strokeWidth="2" />
          <text x="405" y="230" textAnchor="middle" fontWeight="700" fontSize="14" fill="#b55d00">第二级 · 盆地与高原</text>
          <text x="405" y="251" textAnchor="middle" fontSize="13" fill="#5d4e37">海拔 1000～2000米</text>

          <rect x="530" y="300" width="170" height="58" rx="12" fill="#ffffff" stroke="#3bb273" strokeWidth="2" />
          <text x="615" y="325" textAnchor="middle" fontWeight="700" fontSize="14" fill="#166534">第三级 · 东部平原</text>
          <text x="615" y="346" textAnchor="middle" fontSize="13" fill="#5d4e37">海拔 500米以下 🌾</text>

          {/* 大河奔流 */}
          <path d="M120 170 L275 170 L325 275 L510 275 L550 370 L725 370" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
          <circle cx={waterX} cy={waterY} r="13" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          <text x={waterX} y={waterY + 5} textAnchor="middle" fontSize="14">💧</text>
          <text x="400" y={safeBottomY - 12} textAnchor="middle" fontWeight="700" fontSize="16" fill="#1d4ed8">
            西高东低 → 一江春水向东流（落差处建水电站 ⚡）
          </text>
        </g>
      );
    }

    case "qinling-barrier": {
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#f0f9ff" />
          {/* 北方半湿润冷冬 */}
          <rect x="40" y="350" width="300" height="80" rx="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <text x="190" y="384" textAnchor="middle" fontWeight="700" fontSize="16" fill="#334155">❄️ 秦岭以北（冬季＜0℃）</text>
          <text x="190" y="410" textAnchor="middle" fontSize="14" fill="#475569">小麦 · 河流结冰 · 暖气过冬</text>
          {/* 秦岭山脉挡风墙 */}
          <polygon points="320,390 400,195 480,390" fill="#8b6b4a" stroke="#5c4028" strokeWidth="3" />
          <text x="400" y="176" textAnchor="middle" fontWeight="700" fontSize="16" fill="#7c2d12">⛰️ 秦岭（海拔2000~3700m）</text>
          {/* 寒潮撞山折返 */}
          <path d="M90 250 Q240 250 345 265 Q285 225 190 210" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="8 5" />
          <text x={lerp(110, 330, Math.abs(Math.sin(p * Math.PI)))} y="242" textAnchor="middle" fontSize="24">🥶💨</text>
          {/* 南方湿润暖冬 */}
          <rect x="460" y="350" width="300" height="80" rx="14" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
          <text x="610" y="384" textAnchor="middle" fontWeight="700" fontSize="16" fill="#14532d">🌾 秦岭以南（冬季＞0℃）</text>
          <text x="610" y="410" textAnchor="middle" fontSize="14" fill="#166534">水稻 · 800mm以上雨水 · 河不结冰</text>
          <text x="625" y="255" textAnchor="middle" fontWeight="700" fontSize="15" fill="#15803d">
            ☀️ 挡住大半寒潮，南方暖和多啦！
          </text>
        </g>
      );
    }

    case "karst-cave": {
      const dropY = lerp(135, 310, (p * 1.6) % 1);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f6ff" />
          {/* 喀斯特峰林 */}
          <path d="M40 280 Q85 110 135 280 Q190 100 245 280 Q320 130 390 280 L760 280 L760 460 L40 460 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
          {/* 溶洞空腔 */}
          <path d="M220 355 Q310 295 450 315 Q580 325 650 385 Q570 435 370 430 Q220 425 220 355 Z" fill="#1e293b" />
          {/* 地下河 */}
          <path d="M235 405 Q400 420 635 395" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
          {/* 钟乳石与石笋随时间生长 */}
          <polygon points={`320,312 332,${312 + 38 * eo} 344,312`} fill="#fde68a" />
          <polygon points={`410,308 424,${308 + 46 * eo} 438,308`} fill="#fde68a" />
          <polygon points={`326,412 336,${412 - 30 * eo} 346,412`} fill="#fcd34d" />
          {/* 雨水滴落溶解石灰岩 */}
          <text x="332" y={dropY} textAnchor="middle" fontSize="22">💧</text>
          <text x="530" y="185" textAnchor="middle" fontWeight="700" fontSize="16" fill="#0369a1">
            🌧️ 雨水带二氧化碳 → 慢慢溶出石灰岩溶洞
          </text>
          <text x="455" y="370" textAnchor="middle" fontWeight="700" fontSize="15" fill="#bae6fd">
            🪨 钟乳石 + 地下暗河
          </text>
        </g>
      );
    }

    case "ocean-conveyor": {
      const shipX = lerp(175, 625, (p * 1.2) % 1);
      const shipY = 300 - Math.sin(((shipX - 175) / 450) * Math.PI) * 95;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#dff2ff" />
          {/* 左侧北美、右侧欧洲 */}
          <path d="M40 150 L210 170 L185 385 L40 420 Z" fill="#a7f3d0" stroke="#059669" strokeWidth="2.5" />
          <text x="120" y="290" textAnchor="middle" fontWeight="700" fontSize="17" fill="#065f46">北美洲</text>
          <path d="M585 130 L760 120 L760 365 L595 340 Z" fill="#fde68a" stroke="#d97706" strokeWidth="2.5" />
          <text x="675" y="235" textAnchor="middle" fontWeight="700" fontSize="17" fill="#78350f">英国与西欧</text>
          {/* 暖流大动脉 */}
          <path d="M175 300 Q400 185 625 225" fill="none" stroke="#ef4444" strokeWidth="9" strokeLinecap="round" strokeDasharray="12 8" />
          <text x={shipX} y={shipY} textAnchor="middle" fontSize="28">🔥🌊</text>
          <text x="400" y="148" textAnchor="middle" fontWeight="700" fontSize="17" fill="#dc2626">
            🔥 北大西洋暖流：把热带太阳的热量送到欧洲！
          </text>
          {/* 冷水流回赤道 */}
          <path d="M610 355 Q400 410 190 365" fill="none" stroke="#2563eb" strokeWidth="6" strokeDasharray="8 6" />
          <text x="400" y="425" textAnchor="middle" fontWeight="700" fontSize="15" fill="#1d4ed8">
            ❄️ 深海冷水流回流，构成全球大洋传送带
          </text>
        </g>
      );
    }

    case "river-delta": {
      const silt = lerp(0, 1, eo);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e6f7ff" />
          {/* 上游山谷到下游三角洲 */}
          <rect x="0" y="130" width="560" height="330" fill="#d9f99d" />
          <rect x="560" y="130" width="240" height="330" fill="#38bdf8" fillOpacity="0.65" />
          {/* 泥沙堆积扇形三角洲 */}
          <path d={`M535 280 L${560 + 115 * silt} ${280 - 95 * silt} L${560 + 135 * silt} 280 L${560 + 115 * silt} ${280 + 95 * silt} Z`} fill="#f7c97e" stroke="#b45309" strokeWidth="2.5" />
          {/* 蜿蜒河曲 + 分汊入海 */}
          <path d="M60 280 Q180 175 280 280 T480 280 L560 280" fill="none" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
          {silt > 0.3 && (
            <g stroke="#2563eb" strokeWidth="5" fill="none">
              <path d={`M555 280 Q610 245 ${565 + 100 * silt} ${265 - 65 * silt}`} />
              <path d={`M555 280 Q610 315 ${565 + 100 * silt} ${295 + 65 * silt}`} />
            </g>
          )}
          <text x="155" y="160" textAnchor="middle" fontWeight="700" fontSize="15" fill="#166534">🏞️ 中游九曲回肠</text>
          <text x="640" y="160" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0369a1">🌊 河口泥沙冲积三角洲</text>
          <text x={lerp(80, 560, (p * 1.3) % 1)} y="286" textAnchor="middle" fontSize="22">⛵</text>
        </g>
      );
    }

    case "panama-locks": {
      const lift = p < 0.35 ? lerp(0, 1, p / 0.35) : p < 0.65 ? 1 : lerp(1, 0, (p - 0.65) / 0.35);
      const shipX = lerp(95, 705, eo);
      const shipY = 335 - lift * 95;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f6ff" />
          {/* 太平洋、加通湖高水位、大西洋 */}
          <rect x="40" y="345" width="160" height="120" fill="#38bdf8" />
          <rect x="200" y="250" width="400" height="215" fill="#0284c7" fillOpacity="0.82" />
          <rect x="600" y="345" width="160" height="120" fill="#38bdf8" />
          {/* 闸门阶梯 */}
          <rect x="195" y="245" width="14" height="220" fill="#64748b" />
          <rect x="591" y="245" width="14" height="220" fill="#64748b" />
          <text x="120" y="425" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0c4a6e">太平洋 (海平面)</text>
          <text x="400" y="365" textAnchor="middle" fontWeight="700" fontSize="17" fill="#ffffff">加通湖水闸 · 海拔高出26米</text>
          <text x="680" y="425" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0c4a6e">大西洋 (海平面)</text>
          {/* 船只坐水电梯过河 */}
          <g transform={`translate(${shipX}, ${shipY})`}>
            <text y="0" textAnchor="middle" fontSize="34">🚢</text>
          </g>
          <text x="400" y="150" textAnchor="middle" fontWeight="700" fontSize="17" fill="#0369a1">
            💧 靠淡水注入水闸把巨轮“抬上山顶再放下海”
          </text>
        </g>
      );
    }

    case "earth-seasons": {
      const summerNorth = p < 0.5;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#1e1b4b" />
          {/* 太阳 */}
          <circle cx="400" cy="275" r={44 + bob * 0.4} fill="#ffd93d" />
          <text x="400" y="282" textAnchor="middle" fontWeight="700" fontSize="18" fill="#7c2d12">☀️ 太阳</text>
          {/* 左侧：6月北半球夏至 */}
          <g transform="translate(160, 275)" opacity={summerNorth ? 1 : 0.45}>
            <g transform="rotate(23.4)">
              <circle r="54" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2.5" />
              <path d="M-26 -24 Q0 -34 26 -14 Q12 12 -20 18 Z" fill="#4ade80" />
              <line x1="-54" y1="0" x2="54" y2="0" stroke="#fde047" strokeWidth="2.5" />
              <line x1="0" y1="-68" x2="0" y2="68" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 3" />
            </g>
            <text y="-82" textAnchor="middle" fontWeight="700" fontSize="15" fill="#fef08a">6月 · 北半球倾斜向太阳</text>
            <text y="92" textAnchor="middle" fontWeight="700" fontSize="14" fill="#bbf7d0">北京夏天 ☀️ / 悉尼冬天 ❄️</text>
          </g>
          {/* 右侧：12月南半球夏至 */}
          <g transform="translate(640, 275)" opacity={!summerNorth ? 1 : 0.45}>
            <g transform="rotate(23.4)">
              <circle r="54" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2.5" />
              <path d="M-26 -24 Q0 -34 26 -14 Q12 12 -20 18 Z" fill="#4ade80" />
              <line x1="-54" y1="0" x2="54" y2="0" stroke="#fde047" strokeWidth="2.5" />
              <line x1="0" y1="-68" x2="0" y2="68" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 3" />
            </g>
            <text y="-82" textAnchor="middle" fontWeight="700" fontSize="15" fill="#bae6fd">12月 · 南半球倾斜向太阳</text>
            <text y="92" textAnchor="middle" fontWeight="700" fontSize="14" fill="#fef08a">北京冬天 ❄️ / 悉尼夏天 ☀️</text>
          </g>
          {/* 阳光照射箭头 */}
          <line x1="342" y1="275" x2="232" y2="275" stroke="#fde047" strokeWidth="4" strokeDasharray="6 5" opacity={summerNorth ? 1 : 0.25} />
          <line x1="458" y1="275" x2="568" y2="275" stroke="#fde047" strokeWidth="4" strokeDasharray="6 5" opacity={!summerNorth ? 1 : 0.25} />
        </g>
      );
    }

    case "polar-aurora": {
      const wave = Math.sin(p * Math.PI * 3) * 14;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#0f172a" />
          {/* 太阳风粒子 */}
          <circle cx="90" cy="280" r="36" fill="#ffd93d" />
          <text x="90" y="286" textAnchor="middle" fontWeight="700" fontSize="14" fill="#7c2d12">☀️ 太阳风</text>
          {[220, 260, 300, 340].map((y, idx) => (
            <circle key={y} cx={lerp(145, 420, (p * 1.5 + idx * 0.22) % 1)} cy={y} r="4.5" fill="#fde047" />
          ))}
          {/* 地球磁场弧线把带电粒子引向南北极 */}
          <g transform="translate(500, 285)">
            <ellipse cx="0" cy="0" rx="145" ry="125" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
            <ellipse cx="0" cy="0" rx="110" ry="95" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
            <circle r="72" fill="#2563eb" stroke="#93c5fd" strokeWidth="2.5" />
            <path d="M-40 -20 Q0 -40 35 -10 Q15 28 -30 22 Z" fill="#4ade80" />
            {/* 极光绿带 */}
            <path d={`M-38 -62 Q0 ${-86 + wave * 0.4} 38 -62`} fill="none" stroke="#34d399" strokeWidth="9" strokeLinecap="round" opacity="0.9" />
            <path d={`M-38 62 Q0 ${86 - wave * 0.4} 38 62`} fill="none" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
          </g>
          <text x="500" y="138" textAnchor="middle" fontWeight="700" fontSize="17" fill="#6ee7b7">
            ✨ 磁力线把太阳粒子引向两极，撞出绿色极光！
          </text>
        </g>
      );
    }

    case "timezone-spin": {
      // 从北极上空俯视地球，自西向东自转为逆时针（SVG 负角度）
      const rot = lerp(0, -30, e);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#1e293b" />
          <text x="400" y="132" textAnchor="middle" fontWeight="700" fontSize="17" fill="#fef08a">
            🌍 地球自西向东 24小时转 360° → 每 15° 差 1 小时
          </text>
          <g transform="translate(400, 295)">
            <circle r="128" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="3" />
            <g transform={`rotate(${rot})`}>
              {Array.from({ length: 12 }, (_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-128"
                  x2="0"
                  y2="128"
                  stroke="#bfdbfe"
                  strokeWidth="1.2"
                  opacity="0.45"
                  transform={`rotate(${i * 15})`}
                />
              ))}
              {/* 本初子午线 0° 与 180° 日界线 */}
              <line x1="0" y1="0" x2="0" y2="-128" stroke="#facc15" strokeWidth="4" />
              <line x1="0" y1="0" x2="0" y2="128" stroke="#f87171" strokeWidth="4" strokeDasharray="6 4" />
            </g>
            <circle r="10" fill="#ffffff" />
            <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">北极</text>
          </g>
          <text x="155" y="295" textAnchor="middle" fontWeight="700" fontSize="15" fill="#fef08a">🕒 0° 格林威治</text>
          <text x="645" y="295" textAnchor="middle" fontWeight="700" fontSize="15" fill="#fca5a5">📅 180° 国际日界线</text>
          <text x="400" y={safeBottomY - 14} textAnchor="middle" fontWeight="700" fontSize="15" fill="#bae6fd">
            往东跨过 180° 日界线要减一天，就像坐飞机“回到昨天”！
          </text>
        </g>
      );
    }

    case "river-city": {
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#eef9f0" />
          <rect x="0" y="130" width="800" height="340" fill="#d9f99d" />
          {/* 大河汇流入海 */}
          <path d="M40 240 Q260 220 420 290 T790 310" fill="none" stroke="#38bdf8" strokeWidth="36" strokeLinecap="round" />
          {/* 城市高楼、农田与港口 */}
          <rect x="290" y="155" width="32" height="65" rx="4" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2" />
          <rect x="330" y="135" width="36" height="85" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
          <rect x="374" y="165" width="30" height="55" rx="4" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
          <text x="348" y="236" textAnchor="middle" fontWeight="700" fontSize="15" fill="#1e293b">🏙️ 河口大都市</text>
          <text x="165" y="340" textAnchor="middle" fontWeight="700" fontSize="15" fill="#166534">🌾 肥沃冲积农田</text>
          <text x="585" y="385" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0369a1">⚓ 深水良港与淡水供应</text>
          <text x={lerp(110, 710, (p * 1.2) % 1)} y="295" textAnchor="middle" fontSize="28">🚢</text>
        </g>
      );
    }

    case "vertical-zones": {
      const hikerY = lerp(420, 155, eo);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f6ff" />
          {/* 赤道雪山垂直自然带 */}
          <polygon points="150,440 400,130 650,440" fill="#8fd19e" />
          <polygon points="225,345 400,130 575,345" fill="#bbf7d0" />
          <polygon points="295,260 400,130 505,260" fill="#cbd5e1" />
          <polygon points="342,202 400,130 458,202 432,190 400,206 368,190" fill="#ffffff" />
          {/* 高度与温度标尺 */}
          <text x="645" y="175" textAnchor="middle" fontWeight="700" fontSize="15" fill="#1e40af">❄️ 5895m 雪线（-10℃）</text>
          <text x="645" y="255" textAnchor="middle" fontWeight="700" fontSize="15" fill="#475569">🌼 3500m 高山草甸</text>
          <text x="645" y="335" textAnchor="middle" fontWeight="700" fontSize="15" fill="#166534">🌲 2000m 山地森林</text>
          <text x="645" y="415" textAnchor="middle" fontWeight="700" fontSize="15" fill="#15803d">🌴 0m 赤道雨林（28℃）</text>
          {/* 登山小探险家 */}
          <text x={lerp(205, 400, eo)} y={hikerY} textAnchor="middle" fontSize="26">🧗</text>
          <text x="155" y="205" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0369a1">
            每升高 1000米
          </text>
          <text x="155" y="230" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0369a1">
            气温下降约 6℃！
          </text>
        </g>
      );
    }

    case "rift-ocean": {
      const gap = lerp(8, 128, e);
      const seaFill = clamp01((p - 0.42) / 0.45);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f5ff" />
          {/* 软流圈岩浆上涌 */}
          <rect x="0" y="370" width={STAGE_W} height="190" fill="#ff9a76" opacity="0.58" />
          <path d={`M400 455 L400 ${lerp(390, 260, e)}`} stroke="#ef4444" strokeWidth={12 + e * 10} strokeLinecap="round" opacity="0.78" />
          {/* 海水灌入裂谷形成年轻海洋 */}
          {seaFill > 0.02 && (
            <rect
              x={400 - gap}
              y={lerp(350, 255, seaFill)}
              width={gap * 2}
              height={lerp(20, 120, seaFill)}
              fill="#38bdf8"
              fillOpacity="0.82"
            />
          )}
          {/* 左侧努比亚板块 */}
          <g transform={`translate(${-gap * 0.85}, 0)`}>
            <path d="M20 225 L392 225 L380 370 L20 370 Z" fill="#f3c98b" stroke="#9e6d2f" strokeWidth="2.5" />
            <text x="200" y="305" textAnchor="middle" fontWeight="700" fontSize="17" fill="#5d4e37">⬅️ 努比亚板块</text>
          </g>
          {/* 右侧索马里板块 */}
          <g transform={`translate(${gap * 0.85}, 0)`}>
            <path d="M408 225 L780 225 L780 370 L420 370 Z" fill="#a7f3d0" stroke="#059669" strokeWidth="2.5" />
            <text x="595" y="305" textAnchor="middle" fontWeight="700" fontSize="17" fill="#065f46">索马里板块 ➡️</text>
          </g>
          <text x="400" y="138" textAnchor="middle" fontWeight="700" fontSize="17" fill={seaFill > 0.35 ? "#0369a1" : "#c94040"}>
            {seaFill > 0.35 ? "🌊 海水涌入裂谷 → 红海式年轻大洋诞生！" : "🔥 地幔热流拉薄大陆 → 裂出深谷与裂谷湖"}
          </text>
          <text x="400" y={safeBottomY - 12} textAnchor="middle" fontWeight="700" fontSize="14.5" fill="#9e3018">
            东非大裂谷每年拉开约 1~5 毫米，几千万年后将裂出新海洋
          </text>
        </g>
      );
    }

    case "el-nino-seesaw": {
      const isElNino = p > 0.5;
      const move = (p * 2) % 1;
      const warmRight = isElNino ? lerp(420, 680, easeOutCubic(move)) : 410;
      const rainX = isElNino ? lerp(210, 560, easeOutCubic(move)) : 195;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill={isElNino ? "#fff7ed" : "#eef7ff"} />
          {/* 深海冷水底 */}
          <rect x="70" y="265" width="660" height="175" rx="16" fill="#2563eb" fillOpacity="0.82" />
          {/* 表层暖水楔形（正常时堆在西边，厄尔尼诺时东流铺平） */}
          <path
            d={
              isElNino
                ? `M70 265 L730 265 L730 ${lerp(295, 345, easeOutCubic(move))} L70 ${lerp(365, 330, easeOutCubic(move))} Z`
                : "M70 265 L730 265 L730 292 L70 370 Z"
            }
            fill="#f97316"
            fillOpacity="0.88"
          />
          {/* 东西两岸 */}
          <rect x="20" y="235" width="62" height="205" rx="10" fill="#8fd19e" stroke="#166534" strokeWidth="2.5" />
          <text x="51" y="340" textAnchor="middle" fontWeight="700" fontSize="14" fill="#14532d">印尼</text>
          <rect x="718" y="235" width="62" height="205" rx="10" fill="#f3c98b" stroke="#9a3412" strokeWidth="2.5" />
          <text x="749" y="340" textAnchor="middle" fontWeight="700" fontSize="14" fill="#7c2d12">秘鲁</text>
          {/* 风向与雨云 */}
          <line x1="210" y1="220" x2="590" y2="220" stroke={isElNino ? "#ea580c" : "#0284c7"} strokeWidth="5" strokeDasharray="9 6" />
          <text x={isElNino ? warmRight * 0.72 : lerp(580, 220, move)} y="226" textAnchor="middle" fontSize="26">
            {isElNino ? "🔥➡️" : "⬅️🌬️"}
          </text>
          <text x={rainX} y="168" textAnchor="middle" fontSize="40">⛈️</text>
          <text x="400" y="122" textAnchor="middle" fontWeight="700" fontSize="17" fill={isElNino ? "#c2410c" : "#0369a1"}>
            {isElNino ? "🔥 厄尔尼诺：信风变弱，暖水与暴雨向东搬家！" : "🌬️ 正常年份：信风把暖水推向西太平洋，东边冷水上涌"}
          </text>
          <text x="230" y="405" textAnchor="middle" fontWeight="700" fontSize="14" fill="#e0f2fe">
            {isElNino ? "暖水撤离 · 澳洲印尼偏旱" : "西侧暖水厚 150m"}
          </text>
          <text x="580" y="405" textAnchor="middle" fontWeight="700" fontSize="14" fill="#e0f2fe">
            {isElNino ? "冷水被压住 · 鱼群减少" : "⬆️ 富含养分深海冷水上涌"}
          </text>
        </g>
      );
    }

    case "hu-line-balance": {
      const barP = eo;
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#fffaf2" />
          <text x="400" y="116" textAnchor="middle" fontWeight="700" fontSize="17" fill="#5d4e37">
            📏 黑河—腾冲“胡焕庸线” × 400mm 等降水量线
          </text>
          {/* 左侧西北半壁卡片 */}
          <rect x="46" y="145" width="320" height="295" rx="20" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
          <text x="206" y="180" textAnchor="middle" fontWeight="700" fontSize="17" fill="#9a3412">🏔️ 西北半壁（＜400mm 降水）</text>
          <text x="206" y="206" textAnchor="middle" fontSize="13.5" fill="#7c2d12">高原 · 沙漠 · 草原牧区与绿洲</text>
          {/* 国土条 vs 人口条 */}
          <text x="74" y="250" fontWeight="700" fontSize="13.5" fill="#78350f">国土面积：56.8%</text>
          <rect x="74" y="262" width="260" height="22" rx="11" fill="#fde68a" />
          <rect x="74" y="262" width={260 * 0.568 * barP} height="22" rx="11" fill="#f59e0b" />
          <text x="74" y="325" fontWeight="700" fontSize="13.5" fill="#78350f">全国人口：6.5%</text>
          <rect x="74" y="337" width="260" height="22" rx="11" fill="#fde68a" />
          <rect x="74" y="337" width={Math.max(14, 260 * 0.065 * barP)} height="22" rx="11" fill="#ea580c" />
          <text x="206" y="405" textAnchor="middle" fontWeight="700" fontSize="14" fill="#9a3412">地广人稀 · 丝路绿洲串城</text>

          {/* 右侧东南半壁卡片 */}
          <rect x="434" y="145" width="320" height="295" rx="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
          <text x="594" y="180" textAnchor="middle" fontWeight="700" fontSize="17" fill="#166534">🌾 东南半壁（＞400mm 降水）</text>
          <text x="594" y="206" textAnchor="middle" fontSize="13.5" fill="#15803d">平原 · 丘陵 · 夏季风湿润农耕区</text>
          <text x="462" y="250" fontWeight="700" fontSize="13.5" fill="#14532d">国土面积：43.2%</text>
          <rect x="462" y="262" width="260" height="22" rx="11" fill="#bbf7d0" />
          <rect x="462" y="262" width={260 * 0.432 * barP} height="22" rx="11" fill="#22c55e" />
          <text x="462" y="325" fontWeight="700" fontSize="13.5" fill="#14532d">全国人口：93.5%</text>
          <rect x="462" y="337" width="260" height="22" rx="11" fill="#bbf7d0" />
          <rect x="462" y="337" width={260 * 0.935 * barP} height="22" rx="11" fill="#15803d" />
          <text x="594" y="405" textAnchor="middle" fontWeight="700" fontSize="14" fill="#166534">全国 18 座千万大城全在此侧</text>
        </g>
      );
    }

    case "atoll-evolution": {
      const sink = lerp(0, 125, e);
      const reefH = lerp(16, 130, e);
      const stageLabel =
        p < 0.33
          ? "① 岸礁：珊瑚贴着火山岛浅水边生长"
          : p < 0.68
            ? "② 堡礁：火山开始冷却下沉，中间露出蓝色潟湖"
            : "③ 环礁：火山彻底沉入海底，只剩水面一圈珊瑚戒指！";
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#dff4ff" />
          {/* 阳光照进浅海 */}
          <text x="400" y="114" textAnchor="middle" fontWeight="700" fontSize="16.5" fill="#0369a1">
            {stageLabel}
          </text>
          {/* 海水体 */}
          <rect x="0" y="245" width={STAGE_W} height="315" fill="#0284c7" fillOpacity="0.68" />
          <line x1="0" y1="245" x2={STAGE_W} y2="245" stroke="#38bdf8" strokeWidth="4" />
          {/* 逐渐下沉的海底火山锥 */}
          <polygon
            points={`140,${455 + sink * 0.35} 400,${160 + sink} 660,${455 + sink * 0.35}`}
            fill="#64748b"
            stroke="#334155"
            strokeWidth="3"
          />
          {/* 两侧拼命向上追阳光的珊瑚礁柱 */}
          <path
            d={`M210,${245 + reefH} L230,245 L268,245 L280,${245 + reefH} Z`}
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="2.5"
          />
          <path
            d={`M520,${245 + reefH} L532,245 L570,245 L590,${245 + reefH} Z`}
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="2.5"
          />
          <text x="248" y="232" textAnchor="middle" fontSize="20">🪸</text>
          <text x="552" y="232" textAnchor="middle" fontSize="20">🪸</text>
          {p > 0.5 && (
            <text x="400" y="278" textAnchor="middle" fontWeight="700" fontSize="15" fill="#e0f2fe">
              💎 中央浅蓝潟湖
            </text>
          )}
          <text x="400" y="425" textAnchor="middle" fontWeight="700" fontSize="15" fill="#f8fafc">
            🌋 冷却下沉的古海底火山
          </text>
        </g>
      );
    }

    case "moon-tides": {
      const springTide = p > 0.5;
      const bulgeRx = springTide ? 142 : 124;
      const moonAngle = springTide ? 0 : lerp(0, -90, clamp01(p * 2));
      const earthSpin = lerp(0, -360, p);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#0f172a" />
          <text x="400" y="114" textAnchor="middle" fontWeight="700" fontSize="16.5" fill="#fef08a">
            {springTide
              ? "🌕 初一/十五大潮：太阳与月亮排成一线，联手拉出最高潮！"
              : "🌙 月球引潮力把海水拉成对称双水包，地球自转一天涨潮两次"}
          </text>
          {/* 左侧太阳 */}
          <circle cx="96" cy="285" r="44" fill="#ffd93d" />
          <text x="96" y="292" textAnchor="middle" fontWeight="700" fontSize="16" fill="#7c2d12">☀️ 太阳</text>
          {/* 中央地球与双侧潮汐水包 */}
          <g transform="translate(415, 285)">
            <ellipse cx="0" cy="0" rx={bulgeRx} ry="96" fill="#38bdf8" fillOpacity="0.48" stroke="#7dd3fc" strokeWidth="2.5" />
            <g transform={`rotate(${earthSpin})`}>
              <circle r="76" fill="#2563eb" stroke="#93c5fd" strokeWidth="2.5" />
              <path d="M-38 -22 Q0 -44 36 -10 Q14 34 -32 24 Z" fill="#4ade80" />
              <circle cx="72" cy="0" r="6" fill="#facc15" />
            </g>
            <text x={bulgeRx - 16} y="-102" textAnchor="middle" fontWeight="700" fontSize="13.5" fill="#7dd3fc">近月高潮水包</text>
            <text x={-bulgeRx + 16} y="-102" textAnchor="middle" fontWeight="700" fontSize="13.5" fill="#7dd3fc">背月高潮水包</text>
          </g>
          {/* 月球 */}
          <g transform={`translate(${415 + Math.cos((moonAngle * Math.PI) / 180) * 235}, ${285 + Math.sin((moonAngle * Math.PI) / 180) * 145})`}>
            <circle r="24" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <text y="6" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">🌙 月</text>
          </g>
        </g>
      );
    }

    case "arctic-vs-antarctic": {
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#e8f6ff" />
          <text x="400" y="114" textAnchor="middle" fontWeight="700" fontSize="17" fill="#1e3a8a">
            🧭 同样在极圈，为什么南极比北极冷得多？
          </text>
          {/* 左半边：北极（陆地围着冰封海洋） */}
          <rect x="42" y="142" width="340" height="302" rx="20" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="212" y="176" textAnchor="middle" fontWeight="700" fontSize="17" fill="#0369a1">🐻‍❄️ 北极：冰封的北冰洋</text>
          {/* 北冰洋深海水体 + 薄薄海冰 */}
          <rect x="66" y="280" width="292" height="100" rx="10" fill="#0284c7" fillOpacity="0.82" />
          <rect x="86" y="266" width="252" height="20" rx="8" fill="#ffffff" stroke="#7dd3fc" strokeWidth="2" />
          <text x="212" y="255" textAnchor="middle" fontWeight="700" fontSize="13.5" fill="#0369a1">海冰仅厚约 2~4 米</text>
          <text x="212" y="334" textAnchor="middle" fontWeight="700" fontSize="14.5" fill="#e0f2fe">🌊 下方海水像大暖水袋保温</text>
          <text x="212" y="416" textAnchor="middle" fontWeight="700" fontSize="14" fill="#0c4a6e">冬季常见低温约 -40℃</text>

          {/* 右半边：南极（大洋围着高海拔厚冰盖大陆） */}
          <rect x="418" y="142" width="340" height="302" rx="20" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="2.5" />
          <text x="588" y="176" textAnchor="middle" fontWeight="700" fontSize="17" fill="#1e3a8a">🐧 南极：高海拔冰盖大陆</text>
          {/* 岩石陆地 + 厚达 4.9km 的高耸白色冰穹 */}
          <rect x="442" y="345" width="292" height="35" rx="8" fill="#94a3b8" />
          <path d={`M452 345 Q588 ${lerp(245, 200, eo)} 724 345 Z`} fill="#ffffff" stroke="#60a5fa" strokeWidth="2.5" />
          <text x="588" y="295" textAnchor="middle" fontWeight="700" fontSize="14" fill="#1e40af">冰盖平均超 2000m · 最厚 4.9km</text>
          <text x="588" y="368" textAnchor="middle" fontWeight="700" fontSize="13.5" fill="#f8fafc">🪨 下方是岩石南极大陆</text>
          <text x="588" y="416" textAnchor="middle" fontWeight="700" fontSize="14" fill="#1d4ed8">🥶 东方站实测极寒 -89.2℃</text>
        </g>
      );
    }

    case "mercator-distortion": {
      // 动画展示：左侧墨卡托平面图里被拉肥的格陵兰，右侧按真实面积缩回 1/14 放进非洲轮廓里！
      const shrink = lerp(1, 0.28, e);
      return (
        <g>
          <rect width={STAGE_W} height={STAGE_H} fill="#eef7ff" />
          <text x="400" y="114" textAnchor="middle" fontWeight="700" fontSize="17" fill="#1e3a8a">
            🗺️ 平面墨卡托地图的“视觉魔术” vs 🌍 地球仪真实比例
          </text>

          {/* 左侧：平面地图错觉 */}
          <rect x="44" y="142" width="335" height="302" rx="20" fill="#ffffff" stroke="#93c5fd" strokeWidth="2.5" />
          <text x="211" y="176" textAnchor="middle" fontWeight="700" fontSize="16" fill="#c94040">🗺️ 平面地图上看起来</text>
          {/* 被拉肥的格陵兰 */}
          <path d="M90 212 L190 205 L200 280 L155 375 L105 330 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
          <text x="145" y="285" textAnchor="middle" fontWeight="700" fontSize="15" fill="#0369a1">格陵兰</text>
          {/* 非洲 */}
          <path d="M235 215 L335 212 L355 275 L312 385 L270 378 L260 295 L230 265 Z" fill="#fde68a" stroke="#d97706" strokeWidth="2.5" />
          <text x="295" y="290" textAnchor="middle" fontWeight="700" fontSize="15" fill="#9a3412">非洲</text>
          <text x="211" y="420" textAnchor="middle" fontWeight="700" fontSize="14" fill="#64748b">
            高纬度被拉宽，看着居然差不多大！
          </text>

          {/* 右侧：真实比例（缩回 1/14） */}
          <rect x="421" y="142" width="335" height="302" rx="20" fill="#fffdf6" stroke="#ff9f43" strokeWidth="2.5" />
          <text x="588" y="176" textAnchor="middle" fontWeight="700" fontSize="16" fill="#15803d">🌍 地球仪上的真实大小</text>
          {/* 真实非洲 */}
          <path d="M515 205 L645 202 L675 278 L620 402 L568 395 L555 298 L512 262 Z" fill="#fde68a" stroke="#d97706" strokeWidth="2.5" />
          <text x="595" y="370" textAnchor="middle" fontWeight="700" fontSize="15" fill="#9a3412">非洲 3030 万km²</text>
          {/* 动态缩小并贴到非洲上方的格陵兰 */}
          <g transform={`translate(${lerp(510, 588, e)}, ${lerp(260, 268, e)}) scale(${shrink})`}>
            <path d="M-50 -55 L45 -60 L55 15 L10 105 L-40 60 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="5" />
          </g>
          <text x="588" y="232" textAnchor="middle" fontWeight="700" fontSize="13.5" fill="#0369a1">
            格陵兰仅 217 万km²（约 1/14！）
          </text>
          <text x="588" y="426" textAnchor="middle" fontWeight="700" fontSize="14" fill="#166534">
            能装下将近 14 个格陵兰岛！
          </text>
        </g>
      );
    }
  }
}
