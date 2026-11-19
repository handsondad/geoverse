import assert from "node:assert/strict";
import test from "node:test";
import { crossesDateLine, greatCircleArc, latLonToVec3, localSolarInfo, sunStateAt, vec3ToLatLon } from "../src/lib/globe-math.ts";

test("latLonToVec3 与 vec3ToLatLon 精确可逆且对齐 Three.js SphereGeometry UV", () => {
  // 0°经线赤道点 -> (+1, 0, 0)
  const eq0 = latLonToVec3(0, 0, 1);
  assert.ok(Math.abs(eq0[0] - 1) < 1e-6 && Math.abs(eq0[1]) < 1e-6 && Math.abs(eq0[2]) < 1e-6);

  // 90°E 赤道点 -> (0, 0, -1)
  const eq90 = latLonToVec3(90, 0, 1);
  assert.ok(Math.abs(eq90[0]) < 1e-6 && Math.abs(eq90[1]) < 1e-6 && Math.abs(eq90[2] + 1) < 1e-6);

  // 任意点往返精度
  const samples = [
    [116.4, 39.9],
    [-74.0, 40.7],
    [151.2, -33.86],
    [-21.1, 64.2],
    [0, 88]
  ];
  for (const [lon, lat] of samples) {
    const [x, y, z] = latLonToVec3(lon, lat, 1);
    const [rlon, rlat] = vec3ToLatLon(x, y, z);
    assert.ok(Math.abs(rlon - lon) < 1e-5, `lon mismatch for ${lon}: got ${rlon}`);
    assert.ok(Math.abs(rlat - lat) < 1e-5, `lat mismatch for ${lat}: got ${rlat}`);
  }
});

test("greatCircleArc 北京飞纽约弧线高纬北拱并平滑采样", () => {
  const arc = greatCircleArc([116.4, 39.9], [-74.0, 40.7], 40, 1, 0.1);
  assert.equal(arc.length, 41);
  const mid = arc[20];
  const [, midLat] = vec3ToLatLon(mid[0], mid[1], mid[2]);
  assert.ok(midLat > 70, `北京→纽约大圆中点应北拱至北极圈以上，实测 ${midLat.toFixed(1)}°N`);
  const midR = Math.hypot(mid[0], mid[1], mid[2]);
  assert.ok(midR > 1.05, "中点拱高应高于球面");
});

test("sunStateAt 与 localSolarInfo 正确反映夏至极昼与冬至极夜", () => {
  // 6月夏至 (monthIdx=5), UTC 04:00 (= 北京中午 12:00)
  const june = sunStateAt(5, 4);
  assert.ok(june.subsolarLat > 23, `夏至太阳应直射北回归线附近，实测 ${june.subsolarLat}`);
  assert.equal(june.subsolarLon, 120);

  const bjNoon = localSolarInfo(116.4, 39.9, 5, 4);
  assert.equal(bjNoon.phase, "白天");
  assert.equal(bjNoon.season, "夏季");

  const sydJune = localSolarInfo(151.2, -33.86, 5, 4);
  assert.equal(sydJune.season, "冬季");

  // 6月夏至北极点全天白天，12月冬至北极点全天黑夜
  assert.equal(localSolarInfo(0, 89, 5, 0).phase, "白天");
  assert.equal(localSolarInfo(0, 89, 11, 12).phase, "黑夜");
});

test("crossesDateLine 正确检测东京→旧金山跨 180° 日界线", () => {
  assert.equal(crossesDateLine([139.69, 35.68], [-122.42, 37.77]), true);
  assert.equal(crossesDateLine([116.4, 39.9], [-0.12, 51.5]), false);
});
