import { easeInOutCubic, lerp } from "./motion.ts";

export type LonLat = readonly [lon: number, lat: number];

export type CameraView = {
  center: LonLat;
  /** 经度跨度（度）：越大视野越广（全球约 280°，中国约 54°，海域/局部约 16°~30°） */
  lonSpan: number;
};

export const STAGE_W = 800;
export const STAGE_H = 560;

const DEG2RAD = Math.PI / 180;

export function project(coord: LonLat, cam: CameraView, w = STAGE_W, h = STAGE_H): [number, number] {
  const cosLat = Math.max(0.35, Math.cos(cam.center[1] * DEG2RAD));
  const pxPerDegLon = w / cam.lonSpan;
  const pxPerDegLat = pxPerDegLon / cosLat;
  const x = w / 2 + (coord[0] - cam.center[0]) * pxPerDegLon;
  const y = h / 2 - (coord[1] - cam.center[1]) * pxPerDegLat;
  return [x, y];
}

export function unproject(px: number, py: number, cam: CameraView, w = STAGE_W, h = STAGE_H): LonLat {
  const cosLat = Math.max(0.35, Math.cos(cam.center[1] * DEG2RAD));
  const pxPerDegLon = w / cam.lonSpan;
  const pxPerDegLat = pxPerDegLon / cosLat;
  const lon = cam.center[0] + (px - w / 2) / pxPerDegLon;
  const lat = cam.center[1] - (py - h / 2) / pxPerDegLat;
  return [lon, lat];
}

export function interpolateCamera(a: CameraView, b: CameraView, rawT: number): CameraView {
  const t = easeInOutCubic(rawT);
  return {
    center: [lerp(a.center[0], b.center[0], t), lerp(a.center[1], b.center[1], t)],
    lonSpan: lerp(a.lonSpan, b.lonSpan, t)
  };
}

export function ringToSvgPath(ring: readonly LonLat[], cam: CameraView, close = true): string {
  if (ring.length === 0) return "";
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i], cam);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return close ? `${d}Z` : d;
}

export function buildRoutePoints(waypoints: readonly LonLat[], cam: CameraView): [number, number][] {
  if (waypoints.length === 0) return [];
  if (waypoints.length === 1) return [project(waypoints[0], cam)];
  const out: [number, number][] = [];
  const samplesPerSeg = 18;
  for (let s = 0; s < waypoints.length - 1; s++) {
    const p0 = project(waypoints[s], cam);
    const p1 = project(waypoints[s + 1], cam);
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy);
    if (len < 1) {
      if (s === 0) out.push(p0);
      continue;
    }
    const nx = -dy / len;
    const ny = dx / len;
    const arch = Math.min(40, len * 0.14) * (ny <= 0 ? 1 : -1);
    const cx = (p0[0] + p1[0]) / 2 + nx * arch;
    const cy = (p0[1] + p1[1]) / 2 + ny * arch;
    for (let k = s === 0 ? 0 : 1; k <= samplesPerSeg; k++) {
      const u = k / samplesPerSeg;
      const omt = 1 - u;
      out.push([
        omt * omt * p0[0] + 2 * omt * u * cx + u * u * p1[0],
        omt * omt * p0[1] + 2 * omt * u * cy + u * u * p1[1]
      ]);
    }
  }
  return out;
}

export function samplePolyline(pts: readonly [number, number][], progress: number): {
  partialPath: string;
  fullPath: string;
  head: [number, number];
  angleDeg: number;
} {
  if (pts.length === 0) {
    return { partialPath: "", fullPath: "", head: [0, 0], angleDeg: 0 };
  }
  if (pts.length === 1) {
    const p = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    return { partialPath: p, fullPath: p, head: pts[0], angleDeg: 0 };
  }
  const fullPath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join("");
  const pClamped = Math.max(0, Math.min(1, progress));
  const exactIdx = pClamped * (pts.length - 1);
  const idx = Math.min(pts.length - 2, Math.floor(exactIdx));
  const frac = exactIdx - idx;
  const a = pts[idx];
  const b = pts[idx + 1];
  const hx = lerp(a[0], b[0], frac);
  const hy = lerp(a[1], b[1], frac);
  const sub = pts.slice(0, idx + 1);
  sub.push([hx, hy]);
  const partialPath = sub
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join("");
  const angleDeg = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return { partialPath, fullPath, head: [hx, hy], angleDeg };
}

export function haversineKm(a: LonLat, b: LonLat): number {
  const R = 6371;
  const dLat = (b[1] - a[1]) * DEG2RAD;
  const dLon = (b[0] - a[0]) * DEG2RAD;
  const lat1 = a[1] * DEG2RAD;
  const lat2 = b[1] * DEG2RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type GeoBounds = { minLon: number; maxLon: number; minLat: number; maxLat: number };

export function cameraBounds(cam: CameraView, w = STAGE_W, h = STAGE_H, pad = 4): GeoBounds {
  const cosLat = Math.max(0.35, Math.cos(cam.center[1] * DEG2RAD));
  const halfLon = cam.lonSpan / 2 + pad;
  const halfLat = (cam.lonSpan * (h / w) * cosLat) / 2 + pad;
  return {
    minLon: cam.center[0] - halfLon,
    maxLon: cam.center[0] + halfLon,
    minLat: cam.center[1] - halfLat,
    maxLat: cam.center[1] + halfLat
  };
}

export function ringIntersectsBounds(ring: readonly LonLat[], b: GeoBounds): boolean {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = ring[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return !(maxX < b.minLon || minX > b.maxLon || maxY < b.minLat || minY > b.maxLat);
}

export function formatCoord(coord: LonLat): string {
  const lonStr = `${Math.abs(coord[0]).toFixed(1)}°${coord[0] >= 0 ? "E" : "W"}`;
  const latStr = `${Math.abs(coord[1]).toFixed(1)}°${coord[1] >= 0 ? "N" : "S"}`;
  return `${latStr}, ${lonStr}`;
}
