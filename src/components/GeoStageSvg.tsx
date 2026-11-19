import { useId, useMemo, type ReactNode } from "react";
import { chinaGeo, worldData } from "../data/geo/index.ts";
import type { DiagramId, GeoMarker, GeoMythCard, GeoRoute, GeoZone } from "../data/types.ts";
import {
  buildRoutePoints,
  cameraBounds,
  project,
  ringIntersectsBounds,
  ringToSvgPath,
  samplePolyline,
  STAGE_H,
  STAGE_W,
  unproject,
  type CameraView,
  type LonLat
} from "../lib/geo.ts";
import { progressBetween } from "../lib/motion.ts";
import { GeoDiagramLayer } from "./GeoDiagramLayer.tsx";

type Props = {
  camera: CameraView;
  localTime?: number;
  sceneDuration?: number;
  kind?: "map" | "diagram";
  diagram?: DiagramId;
  showChinaProvinces?: boolean;
  showTropics?: boolean;
  zones?: readonly GeoZone[];
  routes?: readonly GeoRoute[];
  markers?: readonly GeoMarker[];
  showModernBorders?: boolean;
  showRivers?: boolean;
  activeMarkerId?: string | null;
  onSelectMarker?: (m: GeoMarker) => void;
  onMapClick?: (lonLat: LonLat, px: [number, number]) => void;
  myth?: GeoMythCard;
  sceneBadge?: { number: number; title: string; badgeLabel: string };
  extraOverlay?: ReactNode;
};

type PlacedBox = { x1: number; y1: number; x2: number; y2: number };

function overlaps(a: PlacedBox, b: PlacedBox): boolean {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

function wrapCoordForCam([lon, lat]: LonLat, cam: CameraView): LonLat {
  if (cam.lonSpan > 260) return [lon, lat];
  let adj = lon;
  while (adj - cam.center[0] > 180) adj -= 360;
  while (adj - cam.center[0] < -180) adj += 360;
  return [adj, lat];
}

/** 估算中英文混排在 SVG 里的渲染宽度（px） */
function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const ch of text) {
    if (/[\u0020-\u007e]/.test(ch)) width += fontSize * 0.58;
    else width += fontSize * 1.02;
  }
  return width;
}

function estimateLabelBox(x: number, y: number, text: string, align: "t" | "b" | "l" | "r" | "c"): PlacedBox {
  const w = Math.max(40, estimateTextWidth(text, 13) + 14);
  const h = 20;
  if (align === "l") return { x1: x - w - 10, y1: y - h / 2, x2: x - 6, y2: y + h / 2 };
  if (align === "r") return { x1: x + 8, y1: y - h / 2, x2: x + w + 12, y2: y + h / 2 };
  if (align === "t") return { x1: x - w / 2, y1: y - h - 12, x2: x + w / 2, y2: y - 10 };
  if (align === "b") return { x1: x - w / 2, y1: y + 10, x2: x + w / 2, y2: y + h + 12 };
  return { x1: x - w / 2, y1: y - h / 2, x2: x + w / 2, y2: y + h / 2 };
}

function shiftRing(ring: readonly LonLat[], dLon: number): LonLat[] {
  return ring.map(([lon, lat]) => [lon + dLon, lat] as const);
}

export function GeoStageSvg({
  camera,
  localTime = 99,
  sceneDuration = 6,
  kind = "map",
  diagram,
  showChinaProvinces = false,
  showTropics = false,
  zones,
  routes,
  markers,
  showModernBorders = true,
  showRivers = true,
  activeMarkerId,
  onSelectMarker,
  onMapClick,
  myth,
  sceneBadge,
  extraOverlay
}: Props) {
  const uid = useId().replace(/:/g, "");
  const oceanGradId = `ocean-grad-${uid}`;
  const shadowId = `soft-shadow-${uid}`;

  const progress = sceneDuration > 0 ? Math.min(1, localTime / sceneDuration) : 1;

  // 动态计算顶栏胶囊宽度，避免长标题或长标签溢出
  const leftBadgeFont = sceneBadge && estimateTextWidth(sceneBadge.title, 14) > 315 ? 12.5 : 14;
  const leftBadgeW = sceneBadge
    ? Math.min(410, Math.max(210, Math.ceil(estimateTextWidth(sceneBadge.title, leftBadgeFont) + 56)))
    : 0;
  const rightText = sceneBadge?.badgeLabel ? `🧭 ${sceneBadge.badgeLabel}` : "";
  const rightBadgeFont = rightText && estimateTextWidth(rightText, 13) > 250 ? 11.5 : 13;
  const rightBadgeW = rightText
    ? Math.min(310, Math.max(150, Math.ceil(estimateTextWidth(rightText, rightBadgeFont) + 30)))
    : 0;

  // 动态计算底部误会反转卡尺寸与字体，确保超长句子不溢出、删除线精准对齐
  const mythLayout = useMemo(() => {
    if (!myth) return null;
    const wrongFull = `❌ 误会：${myth.wrong}`;
    const rightFull = `✅ 真相：${myth.right}`;
    const maxCardW = STAGE_W - 28; // 772px
    const maxTextW = maxCardW - 36;
    let wrongFont = 13;
    let rightFont = 14;
    if (estimateTextWidth(wrongFull, wrongFont) > maxTextW) {
      wrongFont = Math.max(11, (maxTextW / estimateTextWidth(wrongFull, 1)) * 0.96);
    }
    if (estimateTextWidth(rightFull, rightFont) > maxTextW) {
      rightFont = Math.max(11, (maxTextW / estimateTextWidth(rightFull, 1)) * 0.96);
    }
    const contentW = Math.max(
      estimateTextWidth(wrongFull, wrongFont),
      estimateTextWidth(rightFull, rightFont)
    );
    const cardW = Math.min(maxCardW, Math.max(460, Math.ceil(contentW + 38)));
    const prefixW = estimateTextWidth("❌ 误会：", wrongFont);
    const strikeEnd = Math.min(cardW - 18, Math.round(18 + prefixW + estimateTextWidth(myth.wrong, wrongFont)));
    return {
      cardW,
      cardX: (STAGE_W - cardW) / 2,
      wrongFont: Number(wrongFont.toFixed(1)),
      rightFont: Number(rightFont.toFixed(1)),
      strikeStart: Math.round(18 + prefixW),
      strikeEnd
    };
  }, [myth]);

  // 预占位：左上角场次胶囊、右上角地理标签胶囊和底部误会反转卡
  const placed: PlacedBox[] = [];
  if (sceneBadge) placed.push({ x1: 8, y1: 8, x2: 20 + leftBadgeW, y2: 56 });
  if (rightText) placed.push({ x1: STAGE_W - 20 - rightBadgeW, y1: 8, x2: STAGE_W - 8, y2: 54 });
  if (mythLayout) {
    placed.push({
      x1: mythLayout.cardX - 8,
      y1: STAGE_H - 96,
      x2: mythLayout.cardX + mythLayout.cardW + 8,
      y2: STAGE_H - 8
    });
  }

  // 按相机视口裁剪并缓存底图矢量，避免 60fps 播放动画时每帧全量投影全球多边形
  const camKey = `${camera.center[0].toFixed(3)},${camera.center[1].toFixed(3)},${camera.lonSpan.toFixed(3)}`;

  const baseMapPaths = useMemo(() => {
    if (kind === "diagram") {
      return { gridPath: "", landPaths: [] as string[], borderPaths: [] as string[], riverPaths: [] as string[], provincePaths: [] as string[] };
    }
    const bounds = cameraBounds(camera, STAGE_W, STAGE_H, 10);
    const shifts = [0];
    if (bounds.maxLon > 180) shifts.push(360);
    if (bounds.minLon < -180) shifts.push(-360);

    const lonStep = camera.lonSpan > 120 ? 30 : camera.lonSpan > 45 ? 15 : 10;
    const latStep = camera.lonSpan > 120 ? 30 : camera.lonSpan > 45 ? 15 : 10;
    const minLon = Math.floor((camera.center[0] - camera.lonSpan * 0.7) / lonStep) * lonStep;
    const maxLon = Math.ceil((camera.center[0] + camera.lonSpan * 0.7) / lonStep) * lonStep;
    const minLat = Math.max(-60, Math.floor((camera.center[1] - camera.lonSpan * 0.6) / latStep) * latStep);
    const maxLat = Math.min(80, Math.ceil((camera.center[1] + camera.lonSpan * 0.6) / latStep) * latStep);

    const gridLines: string[] = [];
    for (let lon = minLon; lon <= maxLon; lon += lonStep) {
      const [x] = project([lon, camera.center[1]], camera);
      if (x >= -10 && x <= STAGE_W + 10) gridLines.push(`M${x.toFixed(1)},0V${STAGE_H}`);
    }
    for (let lat = minLat; lat <= maxLat; lat += latStep) {
      const [, y] = project([camera.center[0], lat], camera);
      if (y >= -10 && y <= STAGE_H + 10) gridLines.push(`M0,${y.toFixed(1)}H${STAGE_W}`);
    }

    const landPaths: string[] = [];
    for (const shift of shifts) {
      for (const poly of worldData.land) {
        if (!poly[0]) continue;
        const shiftedPoly = shift === 0 ? poly : poly.map((r) => shiftRing(r, shift));
        if (ringIntersectsBounds(shiftedPoly[0], bounds)) {
          landPaths.push(shiftedPoly.map((r) => ringToSvgPath(r, camera, true)).join(" "));
        }
      }
    }

    const borderPaths: string[] = [];
    if (showModernBorders) {
      for (const shift of shifts) {
        for (const line of worldData.borders) {
          const shifted = shift === 0 ? line : shiftRing(line, shift);
          if (ringIntersectsBounds(shifted, bounds)) {
            borderPaths.push(ringToSvgPath(shifted, camera, false));
          }
        }
      }
    }

    const riverPaths: string[] = [];
    if (showRivers) {
      for (const shift of shifts) {
        for (const rv of chinaGeo.rivers) {
          for (const ln of rv.lines) {
            const shifted = shift === 0 ? ln : shiftRing(ln, shift);
            if (ringIntersectsBounds(shifted, bounds)) {
              riverPaths.push(ringToSvgPath(shifted, camera, false));
            }
          }
        }
      }
    }

    const provincePaths: string[] = [];
    if (showChinaProvinces) {
      for (const p of chinaGeo.provinces) {
        const visibleRings = p.rings.filter((r) => ringIntersectsBounds(r, bounds));
        if (visibleRings.length > 0) {
          provincePaths.push(visibleRings.map((r) => ringToSvgPath(r, camera, true)).join(" "));
        }
      }
    }

    return { gridPath: gridLines.join(" "), landPaths, borderPaths, riverPaths, provincePaths };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camKey, kind, showModernBorders, showRivers, showChinaProvinces]);

  const placedPinCenters: [number, number][] = [];
  const visibleMarkers = (markers ?? [])
    .map((m) => {
      const [x, y] = project(wrapCoordForCam(m.coord, camera), camera);
      const appear = m.appearAt ?? 0;
      const opacity = appear <= 0 ? 1 : progressBetween(progress, appear, appear + 0.14);
      const inView = x >= 24 && x <= STAGE_W - 24 && y >= 24 && y <= STAGE_H - 24;
      if (!inView || opacity <= 0.02) return null;
      if (m.id !== activeMarkerId && placedPinCenters.some(([px, py]) => Math.hypot(px - x, py - y) < 26)) {
        return null;
      }
      placedPinCenters.push([x, y]);
      const align = m.align ?? "t";
      let showLabel = true;
      const box = estimateLabelBox(x, y, m.label, align);
      if (box.x1 < 6 || box.x2 > STAGE_W - 6 || box.y1 < 6 || box.y2 > STAGE_H - 6) {
        showLabel = false;
      } else if (placed.some((p) => overlaps(p, box))) {
        showLabel = false;
      } else {
        placed.push(box);
      }
      return { m, x, y, opacity, align, showLabel };
    })
    .filter(Boolean) as {
      m: GeoMarker;
      x: number;
      y: number;
      opacity: number;
      align: "t" | "b" | "l" | "r";
      showLabel: boolean;
    }[];

  const zoneLabels = (zones ?? [])
    .map((z) => {
      if (!z.labelAt) return null;
      const [x, y] = project(wrapCoordForCam(z.labelAt, camera), camera);
      if (x < 45 || x > STAGE_W - 45 || y < 60 || y > STAGE_H - 40) return null;
      const box = estimateLabelBox(x, y, z.label, "c");
      if (placed.some((p) => overlaps(p, box))) return null;
      placed.push(box);
      return { id: z.id, label: z.label, color: z.color, x, y };
    })
    .filter(Boolean) as { id: string; label: string; color: string; x: number; y: number }[];

  const specialLatLines = showTropics
    ? [
        { lat: 66.5, label: "北极圈 66.5°N", color: "#3b82f6" },
        { lat: 23.4, label: "北回归线 23.4°N", color: "#f97316" },
        { lat: 0, label: "赤道 0°", color: "#ef4444" },
        { lat: -23.4, label: "南回归线 23.4°S", color: "#f97316" }
      ]
    : [];

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!onMapClick || kind === "diagram") return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * STAGE_W;
    const py = ((e.clientY - rect.top) / rect.height) * STAGE_H;
    const lonLat = unproject(px, py, camera);
    onMapClick(lonLat, [px, py]);
  }

  return (
    <svg
      className="map-stage-svg"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      role="img"
      aria-label={sceneBadge ? `${sceneBadge.title}（${sceneBadge.badgeLabel}）地理动画舞台` : "地理动画舞台"}
      onClick={handleSvgClick}
    >
      <defs>
        <linearGradient id={oceanGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9eeff" />
          <stop offset="100%" stopColor="#eef7ff" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#5d4e37" floodOpacity="0.18" />
        </filter>
      </defs>

      {kind === "diagram" && diagram ? (
        <GeoDiagramLayer diagram={diagram} progress={progress} hasMyth={Boolean(myth)} />
      ) : (
        <>
          <rect width={STAGE_W} height={STAGE_H} fill={`url(#${oceanGradId})`} />
          <path d={baseMapPaths.gridPath} stroke="#b9d8f5" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.65" />

          {specialLatLines.map((ln) => {
            const [, y] = project([camera.center[0], ln.lat], camera);
            if (y < 60 || y > STAGE_H - 35) return null;
            return (
              <g key={ln.label}>
                <line x1="0" y1={y} x2={STAGE_W} y2={y} stroke={ln.color} strokeWidth="2" strokeDasharray="7 5" opacity="0.72" />
                <text x="16" y={y - 6} fontSize="12" fontWeight="700" fill={ln.color} className="map-territory-label">
                  {ln.label}
                </text>
              </g>
            );
          })}

          <g className="map-land">
            {baseMapPaths.landPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="#faf1df"
                stroke="#d6bf98"
                strokeWidth="1.1"
                fillRule="evenodd"
              />
            ))}
          </g>

          {showRivers && baseMapPaths.riverPaths.length > 0 && (
            <g className="map-rivers" opacity="0.65">
              {baseMapPaths.riverPaths.map((d, i) => (
                <path
                  key={`rv-${i}`}
                  d={d}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}

          {showModernBorders && baseMapPaths.borderPaths.length > 0 && (
            <g className="map-modern-borders" opacity="0.45">
              {baseMapPaths.borderPaths.map((d, i) => (
                <path
                  key={`wb-${i}`}
                  d={d}
                  fill="none"
                  stroke="#8b7a5c"
                  strokeWidth="0.9"
                  strokeDasharray="3 3"
                />
              ))}
            </g>
          )}

          {showChinaProvinces && baseMapPaths.provincePaths.length > 0 && (
            <g className="map-china-provinces" opacity="0.55">
              {baseMapPaths.provincePaths.map((d, i) => (
                <path
                  key={`cp-${i}`}
                  d={d}
                  fill="none"
                  stroke="#a87954"
                  strokeWidth="1.1"
                  strokeDasharray="4 3"
                />
              ))}
            </g>
          )}

          {zones && (
            <g className="map-zones">
              {zones.map((z) => (
                <path
                  key={z.id}
                  d={z.rings
                    .map((r) => ringToSvgPath(r.map((pt) => wrapCoordForCam(pt, camera)), camera, true))
                    .join(" ")}
                  fill={z.color}
                  fillOpacity={z.opacity ?? 0.28}
                  stroke={z.color}
                  strokeWidth={2}
                  strokeDasharray={z.dashed ? "6 4" : undefined}
                />
              ))}
            </g>
          )}

          <g className="map-polity-labels">
            {zoneLabels.map((lbl) => (
              <text
                key={lbl.id}
                x={lbl.x}
                y={lbl.y}
                textAnchor="middle"
                className="map-territory-label"
                fill={lbl.color}
              >
                {lbl.label}
              </text>
            ))}
          </g>

          {routes && (
            <g className="map-routes">
              {routes.map((rt) => {
                const pts = buildRoutePoints(
                  rt.waypoints.map((w) => wrapCoordForCam(w, camera)),
                  camera
                );
                const start = rt.startAt ?? 0;
                const end = rt.endAt ?? 0.92;
                const routeP = progressBetween(progress, start, end);
                const { partialPath, fullPath, head } = samplePolyline(pts, routeP);
                return (
                  <g key={rt.id}>
                    <path
                      d={fullPath}
                      fill="none"
                      stroke={rt.color}
                      strokeWidth={rt.width ?? 2.5}
                      strokeDasharray="6 6"
                      opacity="0.28"
                    />
                    {routeP > 0.01 && (
                      <path
                        d={partialPath}
                        fill="none"
                        stroke={rt.color}
                        strokeWidth={(rt.width ?? 2.5) + 1.8}
                        strokeLinecap="round"
                        strokeDasharray={rt.dashed ? "7 5" : undefined}
                      />
                    )}
                    {rt.traveler && routeP > 0.02 && (
                      <g transform={`translate(${head[0].toFixed(1)}, ${head[1].toFixed(1)})`} filter={`url(#${shadowId})`}>
                        <circle r="14" fill="#fff8f0" stroke={rt.color} strokeWidth="2.5" />
                        <text y="5" textAnchor="middle" fontSize="15">
                          {rt.traveler}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          <g className="map-markers">
            {visibleMarkers.map(({ m, x, y, opacity, align, showLabel }) => {
              if (opacity <= 0.02) return null;
              const active = activeMarkerId === m.id;
              const dx = align === "l" ? -14 : align === "r" ? 14 : 0;
              const dy = align === "t" ? -16 : align === "b" ? 22 : 4;
              const anchor = align === "l" ? "end" : align === "r" ? "start" : "middle";
              return (
                <g
                  key={m.id}
                  transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                  opacity={opacity}
                  className={`map-marker${active ? " is-active" : ""}`}
                  style={{ cursor: onSelectMarker ? "pointer" : "default" }}
                  onClick={(e) => {
                    if (!onSelectMarker) return;
                    e.stopPropagation();
                    onSelectMarker(m);
                  }}
                >
                  <circle
                    r={active ? 14 : 11}
                    fill={active ? "#fff3e2" : "#ffffff"}
                    stroke={active ? "#ff9f43" : "#4d96ff"}
                    strokeWidth={active ? 3 : 2}
                    filter={`url(#${shadowId})`}
                  />
                  <text y="4.5" textAnchor="middle" fontSize="13">
                    {m.icon ?? "📍"}
                  </text>
                  {showLabel && (
                    <text x={dx} y={dy} textAnchor={anchor} className="map-marker-label">
                      {m.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </>
      )}

      {extraOverlay}

      {sceneBadge && (
        <g transform="translate(14, 14)" filter={`url(#${shadowId})`}>
          <rect width={leftBadgeW} height="36" rx="18" fill="#ffffff" fillOpacity="0.94" stroke="#ffd4b8" strokeWidth="2" />
          <circle cx="19" cy="18" r="12" fill="#ff9f43" />
          <text x="19" y="22.5" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13">
            {sceneBadge.number}
          </text>
          <text x="38" y="22.5" fill="#5d4e37" fontWeight="700" fontSize={leftBadgeFont}>
            {sceneBadge.title}
          </text>
        </g>
      )}

      {rightText && (
        <g transform={`translate(${STAGE_W - 14 - rightBadgeW}, 14)`} filter={`url(#${shadowId})`}>
          <rect width={rightBadgeW} height="34" rx="17" fill="#fff7e6" fillOpacity="0.95" stroke="#ffc27a" strokeWidth="2" />
          <text x={rightBadgeW / 2} y="21.5" textAnchor="middle" fill="#a85c00" fontWeight="700" fontSize={rightBadgeFont}>
            {rightText}
          </text>
        </g>
      )}

      {myth && mythLayout && (
        <g transform={`translate(${mythLayout.cardX}, ${STAGE_H - 84})`} filter={`url(#${shadowId})`}>
          <rect width={mythLayout.cardW} height="70" rx="18" fill="#ffffff" fillOpacity="0.96" stroke="#ff9f43" strokeWidth="2.5" />
          <text x="18" y="26" fill="#c94040" fontWeight="700" fontSize={mythLayout.wrongFont}>
            ❌ 误会：{myth.wrong}
          </text>
          <line
            x1={mythLayout.strikeStart}
            y1="22"
            x2={mythLayout.strikeEnd}
            y2="22"
            stroke="#e05252"
            strokeWidth="2"
            opacity="0.7"
          />
          <text x="18" y="52" fill="#2f8a3c" fontWeight="700" fontSize={mythLayout.rightFont}>
            ✅ 真相：{myth.right}
          </text>
        </g>
      )}
    </svg>
  );
}
