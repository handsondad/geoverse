export const maxFrameSeconds = 1 / 15;

export const clamp01 = (v: number): number => (v <= 0 ? 0 : v >= 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOutCubic = (t: number): number => {
  const c = clamp01(t);
  return 1 - (1 - c) ** 3;
};

export const easeInOutCubic = (t: number): number => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - (-2 * c + 2) ** 3 / 2;
};

export function progressBetween(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp01((t - start) / (end - start));
}

export function pulse(t: number, hz = 1): number {
  return 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * hz);
}
