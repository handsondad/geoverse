import type { LonLat } from "./geo.ts";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export type Vec3 = readonly [x: number, y: number, z: number];

/**
 * 与 Three.js SphereGeometry UV 精确对齐的经纬度 -> 三维直角坐标映射：
 * - lon = 0°, lat = 0° -> (+R, 0, 0)
 * - lon = +90°E, lat = 0° -> (0, 0, -R)
 * - lat = +90°N -> (0, +R, 0)
 */
export function latLonToVec3(lon: number, lat: number, radius = 1): Vec3 {
  const phi = (lon + 180) * DEG2RAD;
  const theta = (90 - lat) * DEG2RAD;
  const sinTheta = Math.sin(theta);
  return [
    -radius * Math.cos(phi) * sinTheta,
    radius * Math.cos(theta),
    radius * Math.sin(phi) * sinTheta
  ];
}

/** latLonToVec3 的精确逆变换：三维球面点 -> [lon, lat] */
export function vec3ToLatLon(x: number, y: number, z: number): LonLat {
  const r = Math.hypot(x, y, z);
  if (r < 1e-9) return [0, 0];
  const lat = Math.asin(Math.max(-1, Math.min(1, y / r))) * RAD2DEG;
  let phi = Math.atan2(z, -x);
  if (phi < 0) phi += Math.PI * 2;
  let lon = phi * RAD2DEG - 180;
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  return [lon, lat];
}

/** 球面两点间的真实大圆弧线采样（带可选拱高，用于 3D 航线与测距弧） */
export function greatCircleArc(
  a: LonLat,
  b: LonLat,
  segments = 64,
  baseRadius = 1.008,
  maxAltitude = 0.08
): Vec3[] {
  const va = latLonToVec3(a[0], a[1], 1);
  const vb = latLonToVec3(b[0], b[1], 1);
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);
  const archScale = Math.min(1, omega / (Math.PI * 0.65));

  const out: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let x: number;
    let y: number;
    let z: number;
    if (sinOmega < 1e-5) {
      x = va[0] + (vb[0] - va[0]) * t;
      y = va[1] + (vb[1] - va[1]) * t;
      z = va[2] + (vb[2] - va[2]) * t;
      const len = Math.hypot(x, y, z) || 1;
      x /= len;
      y /= len;
      z /= len;
    } else {
      const k0 = Math.sin((1 - t) * omega) / sinOmega;
      const k1 = Math.sin(t * omega) / sinOmega;
      x = k0 * va[0] + k1 * vb[0];
      y = k0 * va[1] + k1 * vb[1];
      z = k0 * va[2] + k1 * vb[2];
    }
    const lift = Math.sin(t * Math.PI) * maxAltitude * archScale;
    const r = baseRadius + lift;
    out.push([x * r, y * r, z * r]);
  }
  return out;
}

/**
 * 按月份（0=1月 .. 11=12月）与世界时（UTC 0..24）计算太阳直射点坐标与光照方向单位向量。
 * monthIdx=2(3月春分)/8(9月秋分)直射赤道，monthIdx=5(6月夏至)直射 +23.44°N，monthIdx=11(12月冬至)直射 -23.44°S。
 */
export function sunStateAt(monthIdx: number, utcHour: number): {
  subsolarLat: number;
  subsolarLon: number;
  dir: Vec3;
} {
  const angle = ((monthIdx - 2) / 12) * Math.PI * 2;
  const subsolarLat = Number((23.44 * Math.sin(angle)).toFixed(1));
  let subsolarLon = (12 - utcHour) * 15;
  while (subsolarLon > 180) subsolarLon -= 360;
  while (subsolarLon < -180) subsolarLon += 360;
  const dir = latLonToVec3(subsolarLon, subsolarLat, 1);
  return { subsolarLat, subsolarLon: Number(subsolarLon.toFixed(1)), dir };
}

/** 根据经度与太阳直射状态，推算当地太阳时、昼夜状态与季节 */
export function localSolarInfo(
  lon: number,
  lat: number,
  monthIdx: number,
  utcHour: number
): {
  timeText: string;
  phase: "白天" | "晨昏" | "黑夜";
  season: "春季" | "夏季" | "秋季" | "冬季" | "热带终年暖";
  solarElevationDeg: number;
} {
  const { dir } = sunStateAt(monthIdx, utcHour);
  const p = latLonToVec3(lon, lat, 1);
  const cosZenith = p[0] * dir[0] + p[1] * dir[1] + p[2] * dir[2];
  const solarElevationDeg = Math.round(Math.asin(Math.max(-1, Math.min(1, cosZenith))) * RAD2DEG);

  const rawHour = ((utcHour + lon / 15) % 24 + 24) % 24;
  const hh = Math.floor(rawHour);
  const mm = Math.floor((rawHour - hh) * 60);
  const timeText = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

  const phase = solarElevationDeg > 4 ? "白天" : solarElevationDeg >= -8 ? "晨昏" : "黑夜";

  let season: "春季" | "夏季" | "秋季" | "冬季" | "热带终年暖";
  if (Math.abs(lat) < 16) {
    season = "热带终年暖";
  } else {
    const northMonth = ((monthIdx % 12) + 12) % 12;
    const effective = lat >= 0 ? northMonth : (northMonth + 6) % 12;
    if (effective >= 2 && effective <= 4) season = "春季";
    else if (effective >= 5 && effective <= 7) season = "夏季";
    else if (effective >= 8 && effective <= 10) season = "秋季";
    else season = "冬季";
  }

  return { timeText, phase, season, solarElevationDeg };
}

/** 判断两点间经度差是否跨越国际日界线（180°经线） */
export function crossesDateLine(a: LonLat, b: LonLat): boolean {
  return Math.abs(b[0] - a[0]) > 180;
}
