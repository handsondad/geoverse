import { useMemo } from "react";
import { chinaGeo, worldData } from "../data/geo/index.ts";
import type { GeoStory, RealmId } from "../data/types.ts";
import {
  buildRoutePoints,
  cameraBounds,
  project,
  ringIntersectsBounds,
  ringToSvgPath,
  samplePolyline,
  STAGE_H,
  STAGE_W
} from "../lib/geo.ts";

const ACCENT_BY_REALM: Record<RealmId, string> = {
  tectonics: "#ff6b6b",
  weather: "#4d96ff",
  china: "#ff9f43",
  oceans: "#2aa89b",
  sky: "#a66cff",
  human: "#3bb273"
};

function wrapCoordForCam([lon, lat]: readonly [number, number], cam: { center: readonly [number, number]; lonSpan: number }): readonly [number, number] {
  if (cam.lonSpan > 260) return [lon, lat];
  let adj = lon;
  while (adj - cam.center[0] > 180) adj -= 360;
  while (adj - cam.center[0] < -180) adj += 360;
  return [adj, lat];
}

export function MapThumb({ story }: { story: GeoStory }) {
  const spec = useMemo(() => {
    const mapScenes = story.scenes.filter((s) => s.kind !== "diagram");
    const best =
      mapScenes.find((s) => (s.routes?.length ?? 0) > 0 && (s.markers?.length ?? 0) >= 2) ??
      mapScenes.find((s) => (s.markers?.length ?? 0) >= 2) ??
      mapScenes[0] ??
      story.scenes[0];
    return {
      camera: best.camera,
      zones: best.zones ?? [],
      routes: best.routes ?? [],
      markers: best.markers ?? [],
      accent: ACCENT_BY_REALM[story.realm] ?? "#ff9f43"
    };
  }, [story]);

  const landPaths = useMemo(() => {
    const b = cameraBounds(spec.camera, STAGE_W, STAGE_H, 10);
    const out: string[] = [];
    for (const poly of worldData.land) {
      if (poly[0] && ringIntersectsBounds(poly[0], b)) {
        out.push(poly.map((r) => ringToSvgPath(r, spec.camera, true)).join(" "));
      }
      if (b.maxLon > 180 && poly[0]) {
        const shifted = poly.map((r) => r.map(([lon, lat]) => [lon + 360, lat] as const));
        if (ringIntersectsBounds(shifted[0], b)) {
          out.push(shifted.map((r) => ringToSvgPath(r, spec.camera, true)).join(" "));
        }
      }
    }
    return out;
  }, [spec.camera]);

  return (
    <span className="map-banner" aria-hidden="true">
      <svg viewBox="0 80 800 360" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`sea-${story.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dff0ff" />
            <stop offset="100%" stopColor="#eff7ff" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={STAGE_W} height={STAGE_H} fill={`url(#sea-${story.id})`} />

        <path
          d="M0,180 H800 M0,320 H800 M200,0 V560 M400,0 V560 M600,0 V560"
          stroke="#c6e0f7"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          opacity="0.7"
        />

        <g>
          {landPaths.map((d, i) => (
            <path key={i} d={d} fill="#fbf2df" stroke="#d5bc93" strokeWidth="2.4" fillRule="evenodd" />
          ))}
        </g>

        <g opacity="0.45">
          {chinaGeo.rivers.map((rv, i) => (
            <path
              key={`${rv.name}-${i}`}
              d={rv.lines.map((ln) => ringToSvgPath(ln, spec.camera, false)).join(" ")}
              fill="none"
              stroke="#6ea8e5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
        </g>

        {spec.zones.map((z) => (
          <path
            key={z.id}
            d={z.rings.map((r) => ringToSvgPath(r, spec.camera, true)).join(" ")}
            fill={z.color}
            fillOpacity={0.22}
            stroke={z.color}
            strokeWidth="2"
          />
        ))}

        {spec.routes.map((rt) => {
          const pts = buildRoutePoints(
            rt.waypoints.map((w) => wrapCoordForCam(w, spec.camera)),
            spec.camera
          );
          const { fullPath } = samplePolyline(pts, 1);
          return (
            <g key={rt.id}>
              <path d={fullPath} fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.75" />
              <path
                d={fullPath}
                fill="none"
                stroke={rt.color || spec.accent}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="10 7"
              />
            </g>
          );
        })}

        {spec.markers.slice(0, 4).map((m) => {
          const [x, y] = project(wrapCoordForCam(m.coord, spec.camera), spec.camera);
          if (x < 30 || x > STAGE_W - 30 || y < 95 || y > 425) return null;
          return (
            <g key={m.id} transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}>
              <circle r="16" fill={spec.accent} fillOpacity="0.18" />
              <circle r="8.5" fill="#ffffff" stroke={spec.accent} strokeWidth="4" />
            </g>
          );
        })}

        <g transform="translate(742, 392)" opacity="0.32">
          <circle r="24" fill="none" stroke="#8b7a5c" strokeWidth="2" />
          <polygon points="0,-20 5,0 0,20 -5,0" fill="#8b7a5c" />
          <polygon points="-20,0 0,-5 20,0 0,5" fill="#8b7a5c" />
        </g>
      </svg>
    </span>
  );
}
