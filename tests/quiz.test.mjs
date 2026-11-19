import assert from "node:assert/strict";
import test from "node:test";
import { quizStages } from "../src/data/quiz.ts";
import { project, STAGE_H, STAGE_W } from "../src/lib/geo.ts";
import { cameraKmPerPx, evaluatePinpoint, scoreQuizStage } from "../src/lib/quiz-score.ts";

test("经纬寻宝所有 5 关 20 题的目标点都在对应相机的可视安全点击区内", () => {
  for (const stage of quizStages) {
    for (const tgt of stage.targets) {
      const [x, y] = project(tgt.coord, stage.camera);
      assert.ok(
        x >= 30 && x <= STAGE_W - 30 && y >= 56 && y <= STAGE_H - 30,
        `${stage.id}/${tgt.id}（${tgt.name}）投影坐标 [${x.toFixed(1)}, ${y.toFixed(1)}] 越界`
      );
    }
  }
});

test("evaluatePinpoint 逐题按各自阈值判定命中与神射手", () => {
  const target = { perfectKm: 280, okKm: 650 };
  assert.deepEqual(evaluatePinpoint(120.4, target), { hit: true, perfect: true, km: 120 });
  assert.deepEqual(evaluatePinpoint(450.2, target), { hit: true, perfect: false, km: 450 });
  assert.deepEqual(evaluatePinpoint(800.9, target), { hit: false, perfect: false, km: 801 });
});

test("scoreQuizStage 星数结算逻辑与展示保持一致", () => {
  assert.deepEqual(
    scoreQuizStage(
      [
        { hit: true, perfect: true, km: 100 },
        { hit: true, perfect: true, km: 200 },
        { hit: true, perfect: false, km: 400 },
        { hit: true, perfect: false, km: 500 }
      ],
      4
    ),
    { hitCount: 4, perfectCount: 2, stars: 3 }
  );

  assert.deepEqual(
    scoreQuizStage(
      [
        { hit: true, perfect: true, km: 100 },
        { hit: true, perfect: false, km: 400 },
        { hit: true, perfect: false, km: 500 },
        { hit: true, perfect: false, km: 550 }
      ],
      4
    ),
    { hitCount: 4, perfectCount: 1, stars: 2 }
  );

  assert.deepEqual(
    scoreQuizStage(
      [
        { hit: true, perfect: false, km: 400 },
        { hit: false, perfect: false, km: 900 },
        { hit: false, perfect: false, km: 1200 },
        { hit: false, perfect: false, km: 1500 }
      ],
      4
    ),
    { hitCount: 1, perfectCount: 0, stars: 1 }
  );

  assert.deepEqual(
    scoreQuizStage(
      [
        { hit: false, perfect: false, km: 900 },
        { hit: false, perfect: false, km: 1200 }
      ],
      2
    ),
    { hitCount: 0, perfectCount: 0, stars: 0 }
  );
});

test("cameraKmPerPx 随纬度余弦正确缩放", () => {
  const eq = cameraKmPerPx({ center: [0, 0], lonSpan: 100 });
  const highLat = cameraKmPerPx({ center: [0, 60], lonSpan: 100 });
  assert.ok(Math.abs(eq / highLat - 2) < 0.05, "60° 纬度处每像素公里数应约为赤道的一半");
});
