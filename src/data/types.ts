import type { CameraView, LonLat } from "../lib/geo.ts";

export type RealmId =
  | "tectonics"
  | "weather"
  | "china"
  | "oceans"
  | "sky"
  | "human";

export type RealmMeta = {
  id: RealmId;
  step: number;
  title: string;
  emoji: string;
  subtitle: string;
  blurb: string;
  color: string;
};

export type GeoZone = {
  id: string;
  label: string;
  color: string;
  rings: readonly (readonly LonLat[])[];
  labelAt?: LonLat;
  dashed?: boolean;
  opacity?: number;
};

export type GeoMarker = {
  id: string;
  label: string;
  place?: string;
  coord: LonLat;
  icon?: string;
  kind?: "peak" | "trench" | "desert" | "city" | "strait" | "climate" | "river";
  align?: "t" | "b" | "l" | "r";
  note?: string;
  appearAt?: number;
};

export type GeoRoute = {
  id: string;
  label?: string;
  color: string;
  waypoints: readonly LonLat[];
  traveler?: string;
  dashed?: boolean;
  width?: number;
  startAt?: number;
  endAt?: number;
};

export type GeoMythCard = {
  wrong: string;
  right: string;
};

export type DiagramId =
  | "pangaea"
  | "subduction-uplift"
  | "ring-subduction"
  | "rift-ocean"
  | "rain-shadow"
  | "hadley-cell"
  | "monsoon-flip"
  | "el-nino-seesaw"
  | "china-steps"
  | "qinling-barrier"
  | "karst-cave"
  | "hu-line-balance"
  | "ocean-conveyor"
  | "river-delta"
  | "panama-locks"
  | "atoll-evolution"
  | "earth-seasons"
  | "polar-aurora"
  | "timezone-spin"
  | "moon-tides"
  | "mercator-distortion"
  | "river-city"
  | "vertical-zones"
  | "arctic-vs-antarctic";

export type GeoScene = {
  turn: number;
  title: string;
  badgeLabel: string;
  duration: number;
  kind?: "map" | "diagram";
  diagram?: DiagramId;
  camera: CameraView;
  showChinaProvinces?: boolean;
  showTropics?: boolean;
  zones?: readonly GeoZone[];
  routes?: readonly GeoRoute[];
  markers?: readonly GeoMarker[];
  myth?: GeoMythCard;
};

export type DialogueStepItem = {
  icon: string;
  label: string;
};

export type GeoFigureSpec =
  | {
      kind: "bars";
      caption: string;
      items: readonly { label: string; value: number; unit: string; color: string }[];
    }
  | {
      kind: "scale";
      caption: string;
      stops: readonly { label: string; note: string; color: string; hot?: boolean }[];
    }
  | {
      kind: "elevation";
      caption: string;
      steps: readonly { name: string; height: string; color: string; pct: number }[];
    }
  | {
      kind: "tilt";
      caption: string;
      angleDeg: number;
      northNote: string;
      southNote: string;
    };

export type DialogueTurn = {
  nian: string;
  dad: string;
  steps?: readonly DialogueStepItem[];
  figure?: GeoFigureSpec;
  factBadge?: {
    icon: string;
    title: string;
    detail: string;
  };
};

export type GeoSource = {
  title: string;
  url: string;
};

export type GeoStory = {
  id: string;
  realm: RealmId;
  emoji: string;
  title: string;
  subtitle: string;
  badge: string;
  trigger: string;
  difficulty: "starter" | "explorer" | "master";
  tags: readonly string[];
  dialogue: readonly DialogueTurn[];
  scenes: readonly GeoScene[];
  quiz: {
    prompt: string;
    options: readonly string[];
    answerIndex: number;
    explain: string;
  };
  parentTip: string;
  sources?: readonly GeoSource[];
};
