import type { LonLat } from "../../lib/geo.ts";
import chinaRaw from "./china-geo.json" with { type: "json" };
import worldRaw from "./world-land.json" with { type: "json" };

export type WorldData = {
  land: LonLat[][][];
  borders: LonLat[][];
};

export type ChinaGeoData = {
  provinces: {
    name: string;
    hub: LonLat | null;
    rings: LonLat[][];
  }[];
  rivers: {
    name: string;
    lines: LonLat[][];
  }[];
};

export const worldData = worldRaw as unknown as WorldData;
export const chinaGeo = chinaRaw as unknown as ChinaGeoData;
