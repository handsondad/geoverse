import type { GeoQuizTarget } from "../data/quiz.ts";
import { STAGE_W, type CameraView } from "./geo.ts";

export type PinpointResult = {
  hit: boolean;
  perfect: boolean;
  km: number;
};

/** 逐题按各自 perfectKm / okKm 结算本关星数（写入记录与 WinCard 展示共用同一公式） */
export function scoreQuizStage(
  results: readonly PinpointResult[],
  totalTargets: number
): { hitCount: number; perfectCount: number; stars: number } {
  const hitCount = results.filter((r) => r.hit).length;
  const perfectCount = results.filter((r) => r.perfect).length;
  let stars = 0;
  if (totalTargets > 0) {
    if (hitCount >= totalTargets) {
      stars = perfectCount >= Math.ceil(totalTargets / 2) ? 3 : 2;
    } else if (hitCount >= Math.ceil(totalTargets / 2)) {
      stars = 2;
    } else if (hitCount >= 1) {
      stars = 1;
    }
  }
  return { hitCount, perfectCount, stars };
}

export function evaluatePinpoint(km: number, target: Pick<GeoQuizTarget, "perfectKm" | "okKm">): PinpointResult {
  const rounded = Math.round(km);
  return {
    hit: rounded <= target.okKm,
    perfect: rounded <= target.perfectKm,
    km: rounded
  };
}

/** 按相机中心纬度的余弦换算像素对应公里数（与 project() 投影比例保持一致） */
export function cameraKmPerPx(camera: CameraView, width = STAGE_W): number {
  const cosLat = Math.max(0.35, Math.cos((camera.center[1] * Math.PI) / 180));
  return (camera.lonSpan * 111.32 * cosLat) / width;
}
