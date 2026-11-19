import { useMemo, useState } from "react";
import { canUseWebGL, Globe3D, type GlobeArcItem, type GlobeMarkerItem } from "../components/Globe3D.tsx";
import { FLIGHT_CITIES, GLOBE_LANDMARKS, PRESET_FLIGHTS } from "../data/globe-data.ts";
import { pinpointNianQuestion, QUIZ_WIN_LINES, quizStages } from "../data/quiz.ts";
import { chime } from "../kit/audio.ts";
import { DadSays, NianSays, TopBar, type Settings } from "../kit/Chrome.tsx";
import { StageStrip, WinCard } from "../kit/GameKit.tsx";
import { recordStars, useStarBook } from "../kit/progress.ts";
import { say, stopSpeaking } from "../kit/speech.ts";
import { formatCoord, haversineKm, type LonLat } from "../lib/geo.ts";
import { crossesDateLine, localSolarInfo, sunStateAt } from "../lib/globe-math.ts";
import { evaluatePinpoint, scoreQuizStage, type PinpointResult } from "../lib/quiz-score.ts";
import { AtlasSandboxPage } from "./AtlasSandboxPage.tsx";

type WorkbenchMode = "sandbox" | "seasons" | "flight" | "pinpoint";

const MONTH_NAMES = [
  "1月冬", "2月", "3月春分", "4月", "5月", "6月夏至",
  "7月", "8月", "9月秋分", "10月", "11月", "12月冬至"
];

const WATCH_CITIES: readonly { name: string; emoji: string; coord: LonLat }[] = [
  { name: "北京", emoji: "🏮", coord: [116.4, 39.9] },
  { name: "悉尼", emoji: "🦘", coord: [151.2, -33.86] },
  { name: "伦敦", emoji: "🎡", coord: [-0.12, 51.5] },
  { name: "纽约", emoji: "🗽", coord: [-74.0, 40.7] },
  { name: "北极点", emoji: "🐻‍❄️", coord: [0, 89] }
];

export function GlobeWorkbenchPage({
  settings,
  initialMode = "sandbox"
}: {
  settings: Settings;
  initialMode?: WorkbenchMode;
}) {
  const [webglOk, setWebglOk] = useState(canUseWebGL);
  const [use2D, setUse2D] = useState(false);

  const [mode, setMode] = useState<WorkbenchMode>(initialMode);
  const [dayNight, setDayNight] = useState(true);
  const [monthIdx, setMonthIdx] = useState(5); // 6月夏至
  const [bjHour, setBjHour] = useState(14); // 北京时间 14:00 -> UTC 6:00
  const [autoSpin, setAutoSpin] = useState(false);

  // 图层开关
  const [showClouds, setShowClouds] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showTectonics, setShowTectonics] = useState(false);
  const [showCurrents, setShowCurrents] = useState(false);
  const [showChinaLines, setShowChinaLines] = useState(true);

  const [focusTarget, setFocusTarget] = useState<{ coord: LonLat; distance?: number; seq: number } | null>({
    coord: [108, 28],
    distance: 2.65,
    seq: 0
  });
  const [pickedLandmark, setPickedLandmark] = useState<GlobeMarkerItem | null>(GLOBE_LANDMARKS[0]);
  const [probedCoord, setProbedCoord] = useState<LonLat | null>(null);

  // 大圆航线状态
  const [fromCityId, setFromCityId] = useState("beijing");
  const [toCityId, setToCityId] = useState("newyork");

  // 3D 寻宝状态
  const book = useStarBook();
  const stageStars = book["geo-quiz"] ?? {};
  const [stageIdx, setStageIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [guess, setGuess] = useState<LonLat | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<PinpointResult[]>([]);

  // 若无 WebGL 或主动切换 2D，直接回退平面地球沙盘
  if (!webglOk || use2D) {
    return (
      <div>
        {webglOk && (
          <div className="page" style={{ paddingBottom: 0 }}>
            <button type="button" className="primary-btn is-blue" onClick={() => setUse2D(false)}>
              🌐 切回 3D 逼真交互地球仪
            </button>
          </div>
        )}
        <AtlasSandboxPage settings={settings} />
      </div>
    );
  }

  const utcHour = ((bjHour - 8) % 24 + 24) % 24;
  const sun = useMemo(() => sunStateAt(monthIdx, utcHour), [monthIdx, utcHour]);

  function flyTo(coord: LonLat, distance = 2.35) {
    setFocusTarget((prev) => ({ coord, distance, seq: (prev?.seq ?? 0) + 1 }));
  }

  function switchMode(next: WorkbenchMode) {
    stopSpeaking();
    setMode(next);
    setProbedCoord(null);
    if (next === "seasons") {
      setDayNight(true);
      setShowAxis(true);
      setShowGraticule(true);
      flyTo([105, 22], 2.85);
    } else if (next === "flight") {
      setDayNight(false);
      setShowGraticule(true);
      const fromC = FLIGHT_CITIES.find((c) => c.id === fromCityId) ?? FLIGHT_CITIES[0];
      const toC = FLIGHT_CITIES.find((c) => c.id === toCityId) ?? FLIGHT_CITIES[1];
      flyTo([(fromC.coord[0] + toC.coord[0]) / 2, Math.max(25, (fromC.coord[1] + toC.coord[1]) / 2)], 2.95);
    } else if (next === "pinpoint") {
      setDayNight(false);
      setShowClouds(false);
      setShowTectonics(false);
      setShowCurrents(false);
      setAutoSpin(false);
      const st = quizStages[stageIdx];
      flyTo(st.camera.center, st.camera.lonSpan < 70 ? 2.05 : 2.75);
    }
  }

  // ---- 大圆航线数据 ----
  const fromCity = FLIGHT_CITIES.find((c) => c.id === fromCityId) ?? FLIGHT_CITIES[0];
  const toCity = FLIGHT_CITIES.find((c) => c.id === toCityId) ?? FLIGHT_CITIES[1];
  const flightKm = Math.round(haversineKm(fromCity.coord, toCity.coord));
  const flightHours = (flightKm / 850).toFixed(1);
  const tzDiff = toCity.utcOffset - fromCity.utcOffset;
  const crossesDL = crossesDateLine(fromCity.coord, toCity.coord);

  // ---- 3D 寻宝数据 ----
  const stage = quizStages[stageIdx];
  const target = stage.targets[targetIdx];
  const stageDone = target === undefined || (results.length >= stage.targets.length && !revealed);
  const { hitCount, stars: stageWonStars } = scoreQuizStage(results, stage.targets.length);
  const lastResult = results[results.length - 1];

  function resetStage(nextIdx: number) {
    stopSpeaking();
    setStageIdx(nextIdx);
    setTargetIdx(0);
    setGuess(null);
    setRevealed(false);
    setResults([]);
    const st = quizStages[nextIdx];
    flyTo(st.camera.center, st.camera.lonSpan < 70 ? 2.05 : 2.75);
  }

  function confirmPin() {
    if (!guess || revealed || !target) return;
    const km = haversineKm(guess, target.coord);
    const res = evaluatePinpoint(km, target);
    const nextResults = [...results, res];
    setResults(nextResults);
    setRevealed(true);
    flyTo(target.coord, 2.25);

    if (settings.sound) {
      chime(res.hit);
      say({ who: "dad", text: target.dadExplain });
    }
    if (nextResults.length >= stage.targets.length) {
      const { stars } = scoreQuizStage(nextResults, stage.targets.length);
      if (stars > 0) recordStars("geo-quiz", stage.id, stars);
    }
  }

  // ---- 汇总交给 Globe3D 的 markers & arcs ----
  const globeMarkers: GlobeMarkerItem[] = useMemo(() => {
    if (mode === "sandbox") {
      const base = [...GLOBE_LANDMARKS];
      if (probedCoord) {
        base.push({
          id: "__probe__",
          label: "你点的位置",
          icon: "📍",
          coord: probedCoord,
          color: "#facc15"
        });
      }
      return base;
    }
    if (mode === "seasons") {
      return WATCH_CITIES.map((c) => ({
        id: `watch-${c.name}`,
        label: c.name,
        icon: c.emoji,
        coord: c.coord,
        color: "#ffd93d"
      }));
    }
    if (mode === "flight") {
      return [
        { id: fromCity.id, label: `起飞·${fromCity.name}`, icon: fromCity.emoji, coord: fromCity.coord, color: "#22c55e" },
        { id: toCity.id, label: `到达·${toCity.name}`, icon: toCity.emoji, coord: toCity.coord, color: "#ef4444" }
      ];
    }
    // pinpoint
    const out: GlobeMarkerItem[] = [];
    if (guess) out.push({ id: "pin-guess", label: "小念的图钉", icon: "📌", coord: guess, color: "#facc15" });
    if (revealed && target) {
      out.push({ id: "pin-ans", label: target.name, icon: "🎯", coord: target.coord, color: "#22c55e" });
    }
    return out;
  }, [mode, probedCoord, fromCity, toCity, guess, revealed, target]);

  const globeArcs: GlobeArcItem[] = useMemo(() => {
    if (mode === "flight" && fromCity.id !== toCity.id) {
      return [{ id: "main-flight", from: fromCity.coord, to: toCity.coord, color: "#ff6b6b", altitude: 0.14 }];
    }
    if (mode === "pinpoint" && revealed && guess && target) {
      return [{ id: "pin-err", from: guess, to: target.coord, color: "#facc15", altitude: 0.08 }];
    }
    return [];
  }, [mode, fromCity, toCity, revealed, guess, target]);

  const probeInfo = probedCoord ? localSolarInfo(probedCoord[0], probedCoord[1], monthIdx, utcHour) : null;
  const landmarkInfo = pickedLandmark
    ? localSolarInfo(pickedLandmark.coord[0], pickedLandmark.coord[1], monthIdx, utcHour)
    : null;

  const totalQuizStars = Object.values(stageStars).reduce((a, b) => a + b, 0);
  const totalQuizMax = (quizStages.length + 1) * 3;

  return (
    <div className="page globe-page">
      <TopBar
        emoji="🌐"
        title="逼真 3D 交互地球仪 · 沙盘与实验室"
        backLabel="地球馆首页"
        onBack={() => {
          stopSpeaking();
          window.location.hash = "#/";
        }}
        stars={mode === "pinpoint" ? totalQuizStars : undefined}
        maxStars={mode === "pinpoint" ? totalQuizMax : undefined}
        settings={settings}
      />

      <div className="globe-mode-bar" role="tablist" aria-label="选择地球仪模式">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sandbox"}
          className={`pill-btn${mode === "sandbox" ? " is-active" : ""}`}
          onClick={() => switchMode("sandbox")}
        >
          🌍 卫星地球沙盘
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "seasons"}
          className={`pill-btn${mode === "seasons" ? " is-active" : ""}`}
          onClick={() => switchMode("seasons")}
        >
          ☀️ 四季与昼夜实验室
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "flight"}
          className={`pill-btn${mode === "flight" ? " is-active" : ""}`}
          onClick={() => switchMode("flight")}
        >
          ✈️ 大圆航线与时差
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "pinpoint"}
          className={`pill-btn${mode === "pinpoint" ? " is-active" : ""}`}
          onClick={() => switchMode("pinpoint")}
        >
          🎯 3D 地球仪寻宝
        </button>
        <button
          type="button"
          className="pill-btn"
          onClick={() => {
            stopSpeaking();
            window.location.hash = "#/quiz";
          }}
        >
          🧪 地质与气象剖面台 →
        </button>
        <button type="button" className="pill-btn" onClick={() => setUse2D(true)}>
          🗺️ 平面地图版
        </button>
      </div>

      <div className="globe-layout">
        <div className="globe-stage-col">
          <div className="globe-frame">
            <Globe3D
              dayNight={dayNight}
              monthIdx={monthIdx}
              utcHour={utcHour}
              autoSpin={autoSpin}
              showClouds={showClouds}
              showGraticule={showGraticule}
              showAxis={showAxis}
              showTectonics={showTectonics}
              showCurrents={showCurrents}
              showChinaLines={showChinaLines}
              showSubsolar={dayNight || mode === "seasons"}
              focusTarget={focusTarget}
              markers={globeMarkers}
              activeMarkerId={pickedLandmark?.id ?? null}
              arcs={globeArcs}
              onSurfaceClick={(coord) => {
                if (mode === "pinpoint") {
                  if (!revealed && !stageDone) setGuess(coord);
                } else {
                  setProbedCoord(coord);
                  setPickedLandmark(null);
                }
              }}
              onSelectMarker={(m) => {
                if (mode === "sandbox" && m.id !== "__probe__") {
                  setPickedLandmark(m);
                  setProbedCoord(null);
                  flyTo(m.coord, 2.25);
                } else if (mode === "seasons") {
                  flyTo(m.coord, 2.45);
                }
              }}
              onUnsupported={() => setWebglOk(false)}
            />

            <div className="globe-hud-top">
              <span className="globe-hud-pill">
                {dayNight ? "🌗 真实昼夜光照 + 卫星夜光" : "☀️ 全亮书桌地球仪"}
              </span>
              <span className="globe-hud-pill">
                ☀️ 直射 {sun.subsolarLat > 0 ? `${sun.subsolarLat}°N` : sun.subsolarLat < 0 ? `${Math.abs(sun.subsolarLat)}°S` : "0° 赤道"}
              </span>
            </div>

            <div className="globe-hud-bottom">
              <span>🖱️ 拖动 360° 旋转 · 滚轮缩放 · 点击地表读经纬与昼夜</span>
              <div className="globe-quick-actions">
                <button
                  type="button"
                  className="pill-btn"
                  aria-pressed={dayNight}
                  onClick={() => setDayNight((v) => !v)}
                >
                  {dayNight ? "🌗 昼夜：开" : "☀️ 全亮模式"}
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  aria-pressed={autoSpin}
                  onClick={() => setAutoSpin((v) => !v)}
                >
                  {autoSpin ? "⏸ 停转" : "🔄 自转"}
                </button>
              </div>
            </div>
          </div>

          {/* 快捷视角芯片栏 */}
          <div className="globe-presets card">
            <strong>🚀 一键飞向精彩视角：</strong>
            <div className="globe-preset-chips">
              <button
                type="button"
                className="pill-btn"
                onClick={() => {
                  setDayNight(true);
                  setBjHour(22);
                  setShowChinaLines(true);
                  setShowClouds(false);
                  flyTo([106, 35], 2.15);
                }}
              >
                🌃 夜间中国 · 看胡焕庸线灯光！
              </button>
              <button
                type="button"
                className="pill-btn"
                onClick={() => {
                  setDayNight(true);
                  setMonthIdx(5);
                  setShowAxis(true);
                  setShowGraticule(true);
                  flyTo([20, 72], 2.55);
                }}
              >
                ☀️ 6月夏至 · 看北极圈极昼
              </button>
              <button
                type="button"
                className="pill-btn"
                onClick={() => {
                  setDayNight(false);
                  setShowClouds(false);
                  flyTo([-18, 42], 2.45);
                }}
              >
                🧊 真实比例 · 对比格陵兰与非洲
              </button>
              <button
                type="button"
                className="pill-btn"
                onClick={() => {
                  setDayNight(false);
                  setShowTectonics(true);
                  setShowCurrents(false);
                  flyTo([160, 12], 2.8);
                }}
              >
                🌋 太平洋火环与马里亚纳
              </button>
              <button
                type="button"
                className="pill-btn"
                onClick={() => {
                  setDayNight(false);
                  setShowCurrents(true);
                  setShowTectonics(false);
                  flyTo([-35, 38], 2.55);
                }}
              >
                🌊 北大西洋暖流输送带
              </button>
            </div>
          </div>
        </div>

        <aside className="globe-side-col">
          {mode === "sandbox" && (
            <>
              <div className="card">
                <h3>🎛️ 3D 球面图层开关</h3>
                <div className="atlas-toggles">
                  <button type="button" className="pill-btn" aria-pressed={showClouds} onClick={() => setShowClouds((v) => !v)}>
                    {showClouds ? "✅ 卫星云层" : "⬜ 卫星云层"}
                  </button>
                  <button type="button" className="pill-btn" aria-pressed={showGraticule} onClick={() => setShowGraticule((v) => !v)}>
                    {showGraticule ? "✅ 经纬网·回归线" : "⬜ 经纬网·回归线"}
                  </button>
                  <button type="button" className="pill-btn" aria-pressed={showAxis} onClick={() => setShowAxis((v) => !v)}>
                    {showAxis ? "✅ 地轴支架" : "⬜ 地轴支架"}
                  </button>
                  <button type="button" className="pill-btn" aria-pressed={showTectonics} onClick={() => setShowTectonics((v) => !v)}>
                    {showTectonics ? "✅ 板块火环·裂谷" : "⬜ 板块火环·裂谷"}
                  </button>
                  <button type="button" className="pill-btn" aria-pressed={showCurrents} onClick={() => setShowCurrents((v) => !v)}>
                    {showCurrents ? "✅ 全球冷暖洋流" : "⬜ 全球冷暖洋流"}
                  </button>
                  <button type="button" className="pill-btn" aria-pressed={showChinaLines} onClick={() => setShowChinaLines((v) => !v)}>
                    {showChinaLines ? "✅ 胡焕庸线·秦岭线" : "⬜ 胡焕庸线·秦岭线"}
                  </button>
                </div>

                <h4 className="atlas-sub-h">📌 点击飞向全球奇观</h4>
                <div className="atlas-journey-list">
                  {GLOBE_LANDMARKS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`pill-btn${pickedLandmark?.id === m.id ? " is-active" : ""}`}
                      onClick={() => {
                        setPickedLandmark(m);
                        setProbedCoord(null);
                        flyTo(m.coord, 2.2);
                      }}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {pickedLandmark && landmarkInfo && (
                <div className="card globe-info-card">
                  <h3>
                    {pickedLandmark.icon} {pickedLandmark.label}
                  </h3>
                  <p className="note">
                    {pickedLandmark.place} · 坐标 <b>{formatCoord(pickedLandmark.coord)}</b>
                  </p>
                  <div className="globe-solar-chips">
                    <span>🕒 当地太阳时 {landmarkInfo.timeText}</span>
                    <span>{landmarkInfo.phase === "白天" ? "☀️ 白天" : landmarkInfo.phase === "晨昏" ? "🌅 晨昏" : "🌙 黑夜"}</span>
                    <span>🌿 {landmarkInfo.season}</span>
                  </div>
                  {pickedLandmark.note && <p>{pickedLandmark.note}</p>}
                  {pickedLandmark.storyId && (
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => {
                        stopSpeaking();
                        window.location.hash = `#/story/${pickedLandmark.storyId}`;
                      }}
                    >
                      🎬 去看这一集地理动画 →
                    </button>
                  )}
                </div>
              )}

              {probedCoord && probeInfo && (
                <div className="card globe-info-card">
                  <h3>📍 你刚刚点中的地球坐标</h3>
                  <p className="note">
                    经纬度：<b>{formatCoord(probedCoord)}</b>
                  </p>
                  <div className="globe-solar-chips">
                    <span>🕒 当地太阳时 {probeInfo.timeText}</span>
                    <span>{probeInfo.phase === "白天" ? "☀️ 白天" : probeInfo.phase === "晨昏" ? "🌅 晨昏" : "🌙 黑夜"}</span>
                    <span>🌿 {probeInfo.season}</span>
                  </div>
                  <p className="note">
                    提示：拖动地球仪或切换「☀️ 四季与昼夜实验室」，可以观察这个位置在一年四季里的日照变化！
                  </p>
                </div>
              )}
            </>
          )}

          {mode === "seasons" && (
            <div className="card quiz-panel">
              <h3>☀️ 3D 四季与昼夜太阳实验室</h3>
              <p className="note">
                拨动月份和北京时间，亲眼看 <b>23.44° 地轴</b> 和真实晨昏线如何扫过整个地球、让夜晚城市灯光亮起来！
              </p>

              <div className="lab-controls">
                <label className="lab-slider-row">
                  <span>📅 公转月份：<strong>{MONTH_NAMES[monthIdx]}</strong>（直射 {sun.subsolarLat > 0 ? `${sun.subsolarLat}°N` : sun.subsolarLat < 0 ? `${Math.abs(sun.subsolarLat)}°S` : "0° 赤道"}）</span>
                  <input type="range" min={0} max={11} value={monthIdx} onChange={(e) => setMonthIdx(Number(e.target.value))} />
                </label>

                <label className="lab-slider-row">
                  <span>🕒 北京时间（东八区）：<strong>{String(bjHour).padStart(2, "0")}:00</strong></span>
                  <input type="range" min={0} max={23} value={bjHour} onChange={(e) => setBjHour(Number(e.target.value))} />
                </label>

                <div className="atlas-toggles">
                  <button type="button" className="pill-btn" onClick={() => { setMonthIdx(5); flyTo([20, 68], 2.65); }}>
                    ☀️ 6月夏至·北极极昼
                  </button>
                  <button type="button" className="pill-btn" onClick={() => { setMonthIdx(11); flyTo([20, -68], 2.65); }}>
                    ❄️ 12月冬至·南极极昼
                  </button>
                  <button type="button" className="pill-btn" onClick={() => { setMonthIdx(2); flyTo([105, 10], 2.75); }}>
                    ⚖️ 3月春分·昼夜平分
                  </button>
                </div>
              </div>

              <div className="globe-watch-list">
                {WATCH_CITIES.map((c) => {
                  const info = localSolarInfo(c.coord[0], c.coord[1], monthIdx, utcHour);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      className="globe-watch-row"
                      onClick={() => flyTo(c.coord, 2.4)}
                    >
                      <strong>{c.emoji} {c.name}</strong>
                      <span>{info.timeText}</span>
                      <span>{info.phase === "白天" ? "☀️ 白天" : info.phase === "晨昏" ? "🌅 晨昏" : "🌙 黑夜"}</span>
                      <small>{info.season}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "flight" && (
            <div className="card quiz-panel">
              <h3>✈️ 球面大圆航线与时差测距</h3>
              <p className="note">
                在平面地图上画直线往往不是最近的路！在 3D 地球仪上看看飞机为什么贴着北极飞、往东跨过 180° 线怎么“回到昨天”！
              </p>

              <div className="atlas-toggles">
                {PRESET_FLIGHTS.map((pf) => (
                  <button
                    key={pf.id}
                    type="button"
                    className={`pill-btn${fromCityId === pf.from && toCityId === pf.to ? " is-active" : ""}`}
                    onClick={() => {
                      setFromCityId(pf.from);
                      setToCityId(pf.to);
                      const a = FLIGHT_CITIES.find((c) => c.id === pf.from)!;
                      const b = FLIGHT_CITIES.find((c) => c.id === pf.to)!;
                      const midLon = crossesDateLine(a.coord, b.coord) ? 175 : (a.coord[0] + b.coord[0]) / 2;
                      const midLat = Math.max(20, (a.coord[1] + b.coord[1]) / 2 + 12);
                      flyTo([midLon, Math.min(72, midLat)], 2.95);
                    }}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>

              <div className="lab-controls">
                <label className="lab-slider-row">
                  <span>🛫 起飞城市：</span>
                  <div className="city-chips">
                    {FLIGHT_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`pill-btn${fromCityId === c.id ? " is-active" : ""}`}
                        onClick={() => setFromCityId(c.id)}
                      >
                        {c.emoji} {c.name}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="lab-slider-row">
                  <span>🛬 到达城市：</span>
                  <div className="city-chips">
                    {FLIGHT_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`pill-btn${toCityId === c.id ? " is-active" : ""}`}
                        onClick={() => setToCityId(c.id)}
                      >
                        {c.emoji} {c.name}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="lab-readout">
                  <span>📏 大圆最短距离：<b>{flightKm.toLocaleString()} km</b></span>
                  <span>⏱️ 客机直飞约：<b>{flightHours} 小时</b></span>
                  <span>🕒 时差：<b>{tzDiff >= 0 ? `+${tzDiff}` : tzDiff} 小时</b></span>
                  {crossesDL && <span>📅 <b>跨越 180° 国际日界线！</b></span>}
                </div>
              </div>

              {PRESET_FLIGHTS.find((pf) => pf.from === fromCityId && pf.to === toCityId) && (
                <p className="note">
                  💡 {PRESET_FLIGHTS.find((pf) => pf.from === fromCityId && pf.to === toCityId)!.tip}
                </p>
              )}
            </div>
          )}

          {mode === "pinpoint" && (
            <div className="card quiz-panel">
              <h3>🎯 3D 地球仪寻宝大挑战</h3>
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
                <>
                  <NianSays text={pinpointNianQuestion(targetIdx, target.name)} />
                  <DadSays text={target.clue} />

                  {!revealed ? (
                    <div className="quiz-actions">
                      <p className="note">
                        {guess
                          ? `📌 已扎针在 ${formatCoord(guess)}！可转动地球仪重新点击调整，或点下方确认。`
                          : "👆 转动左边 3D 地球仪，直接点一下你猜的位置扎针！"}
                      </p>
                      <button type="button" className="primary-btn" disabled={!guess} onClick={confirmPin}>
                        ✅ 确认扎针位置
                      </button>
                    </div>
                  ) : (
                    <div className="quiz-reveal">
                      <p className={`verdict ${lastResult?.hit ? "is-right" : "is-wrong"}`}>
                        {lastResult?.perfect
                          ? `🎯 神射手！球面只差 ${lastResult.km} 公里！`
                          : lastResult?.hit
                            ? `👍 找对方位啦！球面距离约 ${lastResult.km} 公里`
                            : `🗺️ 差了约 ${lastResult?.km ?? 0} 公里，看地球仪上的金线指向 🎯！`}
                      </p>
                      <DadSays text={target.dadExplain} />
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => {
                          setGuess(null);
                          setRevealed(false);
                          setTargetIdx((i) => i + 1);
                        }}
                      >
                        {targetIdx + 1 < stage.targets.length ? "下一题 →" : "看看本关成绩 →"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <WinCard
                  stars={stageWonStars}
                  verdict={`${stage.title} 完成！答中 ${hitCount} / ${stage.targets.length} 题`}
                  cheer={QUIZ_WIN_LINES.pinpointCheer}
                  dadLine={QUIZ_WIN_LINES.pinpointDad}
                  nextLabel={
                    stageIdx + 1 < quizStages.length
                      ? `下一关：${quizStages[stageIdx + 1].title} →`
                      : "切回🌍自由地球仪沙盘 →"
                  }
                  onNext={() => {
                    if (stageIdx + 1 < quizStages.length) resetStage(stageIdx + 1);
                    else switchMode("sandbox");
                  }}
                  onAgain={() => resetStage(stageIdx)}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
