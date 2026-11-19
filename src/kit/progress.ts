import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "geoverse:stars:v1";

export type StageStars = Record<string, number>;
export type StarBook = Record<string, StageStars>;

const listeners = new Set<() => void>();
let cache: StarBook | null = null;

function read(): StarBook {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as StarBook) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: StarBook) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
  listeners.forEach((l) => l());
}

export function recordStars(itemId: string, stageId: string | number, stars: number) {
  const book = read();
  const key = String(stageId);
  const current = book[itemId]?.[key] ?? 0;
  const clamped = Math.max(0, Math.min(3, Math.round(stars)));
  if (clamped <= current) return;
  write({
    ...book,
    [itemId]: { ...(book[itemId] ?? {}), [key]: clamped }
  });
}

export function sumStars(stages: StageStars | undefined): number {
  if (!stages) return 0;
  return Object.values(stages).reduce((acc, n) => acc + (Number.isFinite(n) ? n : 0), 0);
}

export function useStarBook(): StarBook {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
    () => ({})
  );
}
