#!/usr/bin/env node
/**
 * 从 world-atlas（Natural Earth）和公开地理矢量提取轻量自然地理数据到 src/data/geo/：
 *   1. world-land.json — 全球陆地与现代国界（保留七大洲主要轮廓与南北极参考）
 *   2. china-geo.json  — 中国现代省界轮廓与长江、黄河、淮河水系 + 世界主要大河折线
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature, mesh } from "topojson-client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "src", "data", "geo");
const HIST_LORE = path.resolve(ROOT, "..", "historical-map-playground", "src", "data", "geo", "china-lore.json");

fs.mkdirSync(OUT_DIR, { recursive: true });

function sqSegDist(p, p1, p2) {
  let x = p1[0];
  let y = p1[1];
  let dx = p2[0] - x;
  let dy = p2[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}

function simplifyDP(pts, sqTol) {
  if (pts.length <= 4) return pts;
  const markers = new Uint8Array(pts.length);
  markers[0] = 1;
  markers[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop();
    let maxSq = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const sq = sqSegDist(pts[i], pts[first], pts[last]);
      if (sq > maxSq) {
        index = i;
        maxSq = sq;
      }
    }
    if (maxSq > sqTol && index !== -1) {
      markers[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    if (markers[i]) out.push(pts[i]);
  }
  return out;
}

function roundCoord(c, decimals = 2) {
  const f = 10 ** decimals;
  return [Math.round(c[0] * f) / f, Math.round(c[1] * f) / f];
}

function ringBBoxArea(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return (maxX - minX) * (maxY - minY);
}

function simplifyRing(ring, tol, decimals, minBBoxArea = 0.08) {
  if (!Array.isArray(ring) || ring.length < 4) return null;
  if (ringBBoxArea(ring) < minBBoxArea) return null;
  const simplified = simplifyDP(ring, tol * tol).map((p) => roundCoord(p, decimals));
  if (simplified.length < 4) return null;
  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    simplified.push([first[0], first[1]]);
  }
  return simplified;
}

const land50 = JSON.parse(
  fs.readFileSync(path.join(ROOT, "node_modules/world-atlas/land-50m.json"), "utf8")
);
const countries110 = JSON.parse(
  fs.readFileSync(path.join(ROOT, "node_modules/world-atlas/countries-110m.json"), "utf8")
);

const landGeo = feature(land50, land50.objects.land);
const landPolys = [];
for (const geom of landGeo.features ? landGeo.features.map((f) => f.geometry) : [landGeo.geometry]) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) {
    const outer = poly[0];
    const maxLat = Math.max(...outer.map((p) => p[1]));
    if (maxLat < -58) continue;
    const minLat = Math.min(...outer.map((p) => p[1]));
    const minLon = Math.min(...outer.map((p) => p[0]));
    const maxLon = Math.max(...outer.map((p) => p[0]));
    const inDetailZone = minLon >= -15 && maxLon <= 145 && minLat >= -10 && maxLat <= 72;
    const minArea = inDetailZone ? 0.14 : 0.32;
    const tol = inDetailZone ? 0.18 : 0.26;
    const rings = poly
      .map((r, idx) => simplifyRing(r, tol, 2, idx === 0 ? minArea : minArea * 2))
      .filter(Boolean);
    if (rings.length > 0) landPolys.push(rings);
  }
}

const countryMesh = mesh(countries110, countries110.objects.countries, (a, b) => a !== b);
const countryBorders = countryMesh.coordinates
  .filter((line) => Math.max(...line.map((p) => p[1])) > -58)
  .map((line) => simplifyDP(line, 0.2 * 0.2).map((p) => roundCoord(p, 1)))
  .filter((line) => line.length >= 2);

fs.writeFileSync(
  path.join(OUT_DIR, "world-land.json"),
  JSON.stringify({ land: landPolys, borders: countryBorders })
);
console.log(
  `✅ world-land.json: ${landPolys.length} landmasses, ${countryBorders.length} border segments (${(
    fs.statSync(path.join(OUT_DIR, "world-land.json")).size / 1024
  ).toFixed(1)} KB)`
);

let provinces = [];
let chinaRivers = [];
const existingChinaPath = path.join(OUT_DIR, "china-geo.json");
if (fs.existsSync(HIST_LORE)) {
  const raw = JSON.parse(fs.readFileSync(HIST_LORE, "utf8"));
  provinces = raw.provinces || [];
  chinaRivers = raw.rivers || [];
} else if (fs.existsSync(existingChinaPath)) {
  const raw = JSON.parse(fs.readFileSync(existingChinaPath, "utf8"));
  provinces = raw.provinces || [];
  const worldNames = new Set(["尼罗河", "亚马孙河", "密西西比河", "多瑙河", "刚果河", "恒河", "珠江", "塔里木河"]);
  chinaRivers = (raw.rivers || []).filter((r) => !worldNames.has(r.name));
  console.warn(`⚠️ 未找到上游 ${HIST_LORE}，已保留现有 china-geo.json 中的 ${provinces.length} 个省界与 ${chinaRivers.length} 条中国水系`);
} else {
  console.error(`❌ 缺少中国地理源数据：${HIST_LORE} 与 ${existingChinaPath} 均不存在，中止写入以防数据清空`);
  process.exit(1);
}

const worldRivers = [
  {
    name: "尼罗河",
    lines: [[[32.58, 0.42], [31.6, 4.85], [32.55, 15.6], [32.9, 24.08], [31.23, 30.04], [31.1, 31.4]]]
  },
  {
    name: "亚马孙河",
    lines: [[[-74.5, -9.5], [-73.25, -3.74], [-67.5, -2.5], [-60.02, -3.11], [-54.7, -2.4], [-49.5, -0.5]]]
  },
  {
    name: "密西西比河",
    lines: [[[-95.2, 47.2], [-93.26, 44.97], [-90.19, 38.62], [-90.05, 35.14], [-90.07, 29.95], [-89.2, 29.1]]]
  },
  {
    name: "多瑙河",
    lines: [[[8.5, 48.0], [11.5, 48.8], [16.37, 48.21], [19.04, 47.49], [20.46, 44.81], [28.9, 45.2]]]
  },
  {
    name: "刚果河",
    lines: [[[25.2, 0.5], [22.5, 2.1], [18.2, 0.1], [15.26, -4.32], [12.35, -6.0]]]
  },
  {
    name: "恒河",
    lines: [[[78.16, 30.1], [80.35, 26.45], [83.0, 25.3], [88.36, 22.57], [90.4, 22.3]]]
  },
  {
    name: "珠江",
    lines: [[[104.2, 25.5], [108.3, 22.8], [110.2, 23.4], [113.26, 23.13], [113.6, 22.4]]]
  },
  {
    name: "塔里木河",
    lines: [[[76.0, 39.5], [80.2, 40.5], [84.2, 41.2], [87.5, 40.6]]]
  }
];

fs.writeFileSync(
  path.join(OUT_DIR, "china-geo.json"),
  JSON.stringify({ provinces, rivers: [...chinaRivers, ...worldRivers] })
);
console.log(
  `✅ china-geo.json: ${provinces.length} provinces, ${chinaRivers.length + worldRivers.length} rivers (${(
    fs.statSync(path.join(OUT_DIR, "china-geo.json")).size / 1024
  ).toFixed(1)} KB)`
);
