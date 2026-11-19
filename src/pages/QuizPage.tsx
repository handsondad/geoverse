import { useEffect, useState } from "react";
import { GeoDiagramLayer } from "../components/GeoDiagramLayer.tsx";
import { GeoStageSvg } from "../components/GeoStageSvg.tsx";
import { LAB_DIALOGUE, pinpointNianQuestion, QUIZ_WIN_LINES, quizStages } from "../data/quiz.ts";
import type { DiagramId, GeoMarker } from "../data/types.ts";
import { chime } from "../kit/audio.ts";
import { DadSays, NianSays, TopBar, type Settings } from "../kit/Chrome.tsx";
import { StageStrip, WinCard } from "../kit/GameKit.tsx";
import { recordStars, useStarBook } from "../kit/progress.ts";
import { say, stopSpeaking } from "../kit/speech.ts";
import { haversineKm, project, STAGE_H, STAGE_W, type LonLat } from "../lib/geo.ts";
import { cameraKmPerPx, evaluatePinpoint, scoreQuizStage, type PinpointResult } from "../lib/quiz-score.ts";

type LabKind = "seasons" | "tectonics" | "rainshadow" | "monsoon";

const LAB_ITEMS: readonly { id: LabKind; label: string }[] = [
  { id: "seasons", label: "☀️ 四季与倾角" },
  { id: "tectonics", label: "⛰️ 板块碰撞造山" },
  { id: "rainshadow", label: "🌧️ 地形雨与雨影" },
  { id: "monsoon", label: "🌬️ 东亚季风切换" }
];

const MONTH_NAMES = ["1月冬", "2月", "3月春分", "4月", "5月", "6月夏至", "7月", "8月", "9月秋分", "10月", "11月", "12月冬至"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function QuizPage({ settings }: { settings: Settings }) {
  const book = useStarBook();
  const stageStars = book["geo-quiz"] ?? {};

  const [mode, setMode] = useState<"lab" | "pinpoint">("lab");

  // ---- 模式一：互动地理原理实验室 ----
  const [lab, setLab] = useState<LabKind>("seasons");
  const [visitedLabs, setVisitedLabs] = useState<Record<LabKind, boolean>>({
    seasons: true,
    tectonics: false,
    rainshadow: false,
    monsoon: false
  });
  const [monthIdx, setMonthIdx] = useState(5); // 6月夏至
  const [tectonicMode, setTectonicMode] = useState<"subduction-uplift" | "ring-subduction" | "pangaea">("subduction-uplift");
  const [tectonicProgress, setTectonicProgress] = useState(0.65);
  const [moisture, setMoisture] = useState(80);
  const [mountainHeight, setMountainHeight] = useState(4000);
  const [monsoonSeason, setMonsoonSeason] = useState<"summer" | "winter">("summer");
  const [monsoonPhase, setMonsoonPhase] = useState(0.25);

  // 季风实验室连续流场动画（切到后台或开启减少动效时暂停）
  useEffect(() => {
    if (mode !== "lab" || lab !== "monsoon" || prefersReducedMotion()) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!document.hidden) {
        const dt = Math.min((now - last) / 1000, 0.08);
        setMonsoonPhase((p) => (p + dt * 0.22) % 0.48);
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, lab]);

  function switchLab(next: LabKind) {
    stopSpeaking();
    setLab(next);
    const updated = { ...visitedLabs, [next]: true };
    setVisitedLabs(updated);
    const doneCount = Object.values(updated).filter(Boolean).length;
    recordStars("geo-quiz", "geo-lab", doneCount >= 4 ? 3 : doneCount >= 2 ? 2 : 1);
  }

  // 计算四季实验室数据（采用平滑投影倾角，避免春分/秋分处跳变）
  const sunAngle = ((monthIdx - 2) / 12) * Math.PI * 2;
  const tiltFactor = Math.sin(sunAngle);
  const subsolarLat = Math.round(23.44 * tiltFactor * 10) / 10;
  const projectedTiltDeg = Number((-23.44 * tiltFactor).toFixed(1));
  const bjTemp = Math.round(14 + 14 * tiltFactor);
  const sydTemp = Math.round(18 - 7 * tiltFactor);
  const arcticDay = subsolarLat > 5 ? "极昼 (24h 白天)" : subsolarLat < -5 ? "极夜 (24h 黑夜)" : "昼夜平分";

  // 计算雨影实验室数据
  const windwardRain = Math.round((moisture * mountainHeight) / 45);
  const leewardRain = Math.max(5, Math.round(windwardRain * Math.max(0.03, 0.45 - mountainHeight / 10000)));
  const rainFactor = Math.min(1, (moisture / 100) * 0.6 + (mountainHeight / 6000) * 0.4);

  // ---- 模式二：地球寻宝 · 经纬扎针挑战 ----
  const [stageIdx, setStageIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [guess, setGuess] = useState<LonLat | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<PinpointResult[]>([]);

  const stage = quizStages[stageIdx];
  const target = stage.targets[targetIdx];
  const stageDone = target === undefined || results.length >= stage.targets.length && !revealed;

  function resetStage(nextIdx: number) {
    stopSpeaking();
    setStageIdx(nextIdx);
    setTargetIdx(0);
    setGuess(null);
    setRevealed(false);
    setResults([]);
  }

  function handleMapClick(lonLat: LonLat) {
    if (revealed || stageDone) return;
    setGuess(lonLat);
  }

  function confirmPin() {
    if (!guess || revealed || !target) return;
    const km = haversineKm(guess, target.coord);
    const result = evaluatePinpoint(km, target);
    const nextResults = [...results, result];
    setResults(nextResults);
    setRevealed(true);

    if (settings.sound) {
      chime(result.hit);
      say({ who: "dad", text: target.dadExplain });
    }

    if (nextResults.length >= stage.targets.length) {
      const { stars } = scoreQuizStage(nextResults, stage.targets.length);
      if (stars > 0) recordStars("geo-quiz", stage.id, stars);
    }
  }

  function nextTarget() {
    setGuess(null);
    setRevealed(false);
    setTargetIdx((i) => i + 1);
  }

  const pinpointMarkers: GeoMarker[] = [];
  if (guess && target) {
    pinpointMarkers.push({ id: "guess-pin", label: "小念的图钉", coord: guess, icon: "📌", align: "t" });
  }
  if (revealed && target) {
    pinpointMarkers.push({
      id: "answer-pin",
      label: target.name,
      place: target.place,
      coord: target.coord,
      icon: "🎯",
      align: "b"
    });
  }

  const kmPerPx = cameraKmPerPx(stage.camera, STAGE_W);
  const [tx, ty] = target ? project(target.coord, stage.camera) : [0, 0];
  const [gx, gy] = guess ? project(guess, stage.camera) : [0, 0];
  const lastResult = results[results.length - 1];
  const lastKm = lastResult?.km ?? 0;

  const { hitCount, stars: stageWonStars } = scoreQuizStage(results, stage.targets.length);

  const totalQuizStars = Object.values(stageStars).reduce((a, b) => a + b, 0);
  const totalQuizMax = (quizStages.length + 1) * 3;
  const visitedLabCount = Object.values(visitedLabs).filter(Boolean).length;

  return (
    <div className="page quiz-page">
      <TopBar
        emoji="🔬"
        title="地理原理实验室 & 经纬寻宝"
        backLabel="地球馆首页"
        onBack={() => {
          stopSpeaking();
          window.location.hash = "#/";
        }}
        stars={totalQuizStars}
        maxStars={totalQuizMax}
        settings={settings}
      />

      <div className="quiz-mode-tabs" role="tablist" aria-label="选择实验室或寻宝模式">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "lab"}
          className={`pill-btn${mode === "lab" ? " is-active" : ""}`}
          onClick={() => {
            stopSpeaking();
            setMode("lab");
          }}
        >
          🔬 互动地理原理实验室（已试 {visitedLabCount}/4）
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "pinpoint"}
          className={`pill-btn${mode === "pinpoint" ? " is-active" : ""}`}
          onClick={() => {
            stopSpeaking();
            setMode("pinpoint");
          }}
        >
          📍 平面地图 · 经纬扎针大挑战
        </button>
        <button
          type="button"
          className="pill-btn"
          onClick={() => {
            stopSpeaking();
            window.location.hash = "#/globe";
          }}
        >
          🌐 切换 3D 逼真地球仪工作台 →
        </button>
      </div>

      {mode === "lab" ? (
        <div className="chronicle-wrap">
          <div className="city-picker card">
            <div className="city-picker-head">
              <strong>🧪 选一个地理实验台，亲手拨动参数看地球原理动起来！</strong>
              <span className="mode-tag">集齐 4 个实验拿 ⭐3</span>
            </div>
            <div className="city-chips">
              {LAB_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`pill-btn${lab === item.id ? " is-active" : ""}`}
                  onClick={() => switchLab(item.id)}
                >
                  {visitedLabs[item.id] ? "✅ " : ""}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench">
            <div className="map-stage-frame">
              {lab === "seasons" && (
                <svg className="map-stage-svg" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label="四季与倾角模拟器">
                  <rect width={STAGE_W} height={STAGE_H} fill="#1e1b4b" />
                  <circle cx="130" cy="280" r="56" fill="#ffd93d" />
                  <text x="130" y="287" textAnchor="middle" fontWeight="700" fontSize="20" fill="#7c2d12">☀️ 太阳</text>
                  {[180, 230, 280, 330, 380].map((y) => (
                    <line key={y} x1="205" y1={y} x2="435" y2={y} stroke="#fde047" strokeWidth="3" strokeDasharray="8 6" />
                  ))}
                  {/* 直射点高亮线 */}
                  <line
                    x1="205"
                    y1={280 - subsolarLat * 2.2}
                    x2="475"
                    y2={280 - subsolarLat * 2.2}
                    stroke="#ef4444"
                    strokeWidth="4.5"
                  />
                  <g transform={`translate(520, 280) rotate(${projectedTiltDeg})`}>
                    <circle r="108" fill="#2563eb" stroke="#93c5fd" strokeWidth="3" />
                    <path d="M-45 -48 Q12 -65 55 -20 Q22 36 -38 45 Z" fill="#4ade80" />
                    <line x1="-108" y1="0" x2="108" y2="0" stroke="#fde047" strokeWidth="2.5" />
                    <line x1="0" y1="-130" x2="0" y2="130" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5 4" />
                  </g>
                  <rect x="16" y="16" width="350" height="36" rx="18" fill="#ffffff" fillOpacity="0.95" />
                  <text x="191" y="39" textAnchor="middle" fontWeight="700" fontSize="14.5" fill="#1e1b4b">
                    📅 {MONTH_NAMES[monthIdx]} · 太阳直射纬度 {subsolarLat > 0 ? `${subsolarLat}°N` : subsolarLat < 0 ? `${Math.abs(subsolarLat)}°S` : "0° 赤道"}
                  </text>
                  <text x="520" y="458" textAnchor="middle" fontWeight="700" fontSize="16" fill="#fef08a">
                    北京 {bjTemp}℃ · 悉尼 {sydTemp}℃ · 北极圈：{arcticDay}
                  </text>
                </svg>
              )}

              {lab === "tectonics" && (
                <svg className="map-stage-svg" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label="板块运动模拟器">
                  <GeoDiagramLayer diagram={tectonicMode as DiagramId} progress={tectonicProgress} />
                  <g transform="translate(14, 14)">
                    <rect width="315" height="36" rx="18" fill="#ffffff" fillOpacity="0.94" stroke="#ffd4b8" strokeWidth="2" />
                    <text x="172" y="23" textAnchor="middle" fontWeight="700" fontSize="14" fill="#5d4e37">
                      ⛰️ 板块演进进度：{Math.round(tectonicProgress * 100)}%
                    </text>
                  </g>
                </svg>
              )}

              {lab === "rainshadow" && (
                <svg className="map-stage-svg" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label="地形雨与雨影模拟器">
                  <GeoDiagramLayer
                    diagram="rain-shadow"
                    progress={rainFactor}
                    mountainHeight={mountainHeight}
                  />
                  <rect x="20" y="20" width="360" height="40" rx="18" fill="#ffffff" fillOpacity="0.94" stroke="#93c5fd" strokeWidth="2" />
                  <text x="200" y="45" textAnchor="middle" fontWeight="700" fontSize="14" fill="#1e3a8a">
                    🌧️ 迎风坡 {windwardRain}mm vs 背风坡 {leewardRain}mm
                  </text>
                </svg>
              )}

              {lab === "monsoon" && (
                <svg className="map-stage-svg" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label="东亚季风模拟器">
                  <GeoDiagramLayer
                    diagram="monsoon-flip"
                    progress={monsoonSeason === "summer" ? 0.01 + monsoonPhase : 0.51 + monsoonPhase}
                  />
                  <rect x="20" y="20" width="320" height="40" rx="18" fill="#ffffff" fillOpacity="0.94" stroke="#ffd4b8" strokeWidth="2" />
                  <text x="180" y="45" textAnchor="middle" fontWeight="700" fontSize="14" fill="#5d4e37">
                    {monsoonSeason === "summer" ? "🌞 夏季：海洋湿风吹进江南" : "❄️ 冬季：西北冷风吹向太平洋"}
                  </text>
                </svg>
              )}
            </div>

            <div className="card quiz-panel">
              <NianSays text={LAB_DIALOGUE[lab].nian} />
              <DadSays text={LAB_DIALOGUE[lab].dad} />

              {lab === "seasons" && (
                <div className="lab-controls">
                  <label className="lab-slider-row">
                    <span>📅 拖动地球公转月份：<strong>{MONTH_NAMES[monthIdx]}</strong></span>
                    <input
                      type="range"
                      min={0}
                      max={11}
                      value={monthIdx}
                      onChange={(e) => setMonthIdx(Number(e.target.value))}
                    />
                  </label>
                  <div className="lab-readout">
                    <span>🏮 北京气温约 <b>{bjTemp}℃</b></span>
                    <span>🦘 悉尼气温约 <b>{sydTemp}℃</b></span>
                    <span>🐻‍❄️ 北极圈：<b>{arcticDay}</b></span>
                  </div>
                </div>
              )}

              {lab === "tectonics" && (
                <div className="lab-controls">
                  <div className="atlas-toggles">
                    <button
                      type="button"
                      className={`pill-btn${tectonicMode === "subduction-uplift" ? " is-active" : ""}`}
                      onClick={() => setTectonicMode("subduction-uplift")}
                    >
                      🏔️ 大陆碰撞(喜马拉雅)
                    </button>
                    <button
                      type="button"
                      className={`pill-btn${tectonicMode === "ring-subduction" ? " is-active" : ""}`}
                      onClick={() => setTectonicMode("ring-subduction")}
                    >
                      🕳️ 大洋俯冲(海沟+火山)
                    </button>
                    <button
                      type="button"
                      className={`pill-btn${tectonicMode === "pangaea" ? " is-active" : ""}`}
                      onClick={() => setTectonicMode("pangaea")}
                    >
                      🧩 板块张裂(大西洋)
                    </button>
                  </div>
                  <label className="lab-slider-row">
                    <span>⏱️ 拖动百万年地质演进：<strong>{Math.round(tectonicProgress * 100)}%</strong></span>
                    <input
                      type="range"
                      min={0.05}
                      max={1}
                      step={0.05}
                      value={tectonicProgress}
                      onChange={(e) => setTectonicProgress(Number(e.target.value))}
                    />
                  </label>
                </div>
              )}

              {lab === "rainshadow" && (
                <div className="lab-controls">
                  <label className="lab-slider-row">
                    <span>🌊 海风携带水汽湿度：<strong>{moisture}%</strong></span>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={moisture}
                      onChange={(e) => setMoisture(Number(e.target.value))}
                    />
                  </label>
                  <label className="lab-slider-row">
                    <span>⛰️ 迎风大山海拔高度：<strong>{mountainHeight} 米</strong></span>
                    <input
                      type="range"
                      min={500}
                      max={6000}
                      step={500}
                      value={mountainHeight}
                      onChange={(e) => setMountainHeight(Number(e.target.value))}
                    />
                  </label>
                  <div className="lab-readout">
                    <span>🌲 迎风坡年雨量：<b>{windwardRain} mm</b></span>
                    <span>🌵 背风坡雨影区：<b>{leewardRain} mm</b></span>
                  </div>
                </div>
              )}

              {lab === "monsoon" && (
                <div className="lab-controls">
                  <div className="atlas-toggles">
                    <button
                      type="button"
                      className={`pill-btn${monsoonSeason === "summer" ? " is-active" : ""}`}
                      onClick={() => setMonsoonSeason("summer")}
                    >
                      🌞 切换到 7 月夏季风
                    </button>
                    <button
                      type="button"
                      className={`pill-btn${monsoonSeason === "winter" ? " is-active" : ""}`}
                      onClick={() => setMonsoonSeason("winter")}
                    >
                      ❄️ 切换到 1 月冬季风
                    </button>
                  </div>
                  <p className="note">
                    {monsoonSeason === "summer"
                      ? "夏季亚欧大陆吸热变成热低压，把太平洋湿润东南风吸进中国，造就北纬 30° 江南鱼米之乡！"
                      : "冬季大陆降温快成冷高压，干冷西北风吹向太平洋，幸好有秦岭帮南方挡住了大半寒潮！"}
                  </p>
                </div>
              )}

              {visitedLabCount >= 4 && (
                <WinCard
                  stars={3}
                  verdict="4 大地球原理实验全通关！"
                  cheer={QUIZ_WIN_LINES.labCheer}
                  dadLine={QUIZ_WIN_LINES.labDad}
                  nextLabel="去玩📍经纬寻宝扎针挑战 →"
                  onNext={() => setMode("pinpoint")}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <StageStrip
            stages={quizStages.map((s) => ({ id: s.id, title: s.title, emoji: s.emoji }))}
            activeId={stage.id}
            stars={stageStars}
            color="#3bb273"
            onSelect={(id) => {
              const idx = quizStages.findIndex((s) => s.id === id);
              if (idx >= 0) resetStage(idx);
            }}
          />

          {!stageDone && target ? (
            <div className="workbench">
              <div className="map-stage-frame">
                <GeoStageSvg
                  camera={stage.camera}
                  showChinaProvinces={stage.showChinaProvinces}
                  showTropics={stage.showTropics}
                  markers={pinpointMarkers}
                  showModernBorders={true}
                  onMapClick={handleMapClick}
                  sceneBadge={{
                    number: targetIdx + 1,
                    title: `第 ${targetIdx + 1} / ${stage.targets.length} 题 · ${target.tag}`,
                    badgeLabel: "点击地图扎针"
                  }}
                  extraOverlay={
                    revealed && guess ? (
                      <g>
                        <circle
                          cx={tx}
                          cy={ty}
                          r={Math.max(18, target.perfectKm / kmPerPx)}
                          fill="#22c55e"
                          fillOpacity="0.18"
                          stroke="#16a34a"
                          strokeWidth="2"
                          strokeDasharray="5 4"
                        />
                        <circle
                          cx={tx}
                          cy={ty}
                          r={Math.max(32, target.okKm / kmPerPx)}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                        />
                        <line
                          x1={gx}
                          y1={gy}
                          x2={tx}
                          y2={ty}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                        />
                      </g>
                    ) : null
                  }
                />
              </div>

              <div className="card quiz-panel">
                <NianSays text={pinpointNianQuestion(targetIdx, target.name)} />
                <DadSays text={target.clue} />

                {!revealed ? (
                  <div className="quiz-actions">
                    <p className="note">
                      {guess
                        ? "📌 已经在地图上插好图钉啦！可以继续点别处调整位置，再按确认。"
                        : "👆 请在左边地图上点一下你猜的位置！"}
                    </p>
                    <button type="button" className="primary-btn" disabled={!guess} onClick={confirmPin}>
                      ✅ 确认扎针位置
                    </button>
                  </div>
                ) : (
                  <div className="quiz-reveal">
                    <p className={`verdict ${lastResult?.hit ? "is-right" : "is-wrong"}`}>
                      {lastResult?.perfect
                        ? `🎯 神射手！只差 ${lastKm} 公里！`
                        : lastResult?.hit
                          ? `👍 找对方位啦！距离目标约 ${lastKm} 公里`
                          : `🗺️ 差了约 ${lastKm} 公里，记住绿圈圈的位置哦！`}
                    </p>
                    <DadSays text={target.dadExplain} />
                    <button type="button" className="primary-btn" onClick={nextTarget}>
                      {targetIdx + 1 < stage.targets.length ? "下一题 →" : "看看本关成绩 →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <WinCard
              stars={stageWonStars}
              verdict={`${stage.title} 完成！答中 ${hitCount} / ${stage.targets.length} 题`}
              cheer={QUIZ_WIN_LINES.pinpointCheer}
              dadLine={QUIZ_WIN_LINES.pinpointDad}
              nextLabel={
                stageIdx + 1 < quizStages.length
                  ? `下一关：${quizStages[stageIdx + 1].title} →`
                  : "切回🔬互动地理原理实验室 →"
              }
              onNext={() => {
                if (stageIdx + 1 < quizStages.length) {
                  resetStage(stageIdx + 1);
                } else {
                  setMode("lab");
                }
              }}
              onAgain={() => resetStage(stageIdx)}
            />
          )}
        </>
      )}
    </div>
  );
}
