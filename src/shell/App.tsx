import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { realmById, realms } from "../data/realms.ts";
import { loadStories, storyCardById } from "../data/story-index.ts";
import type { RealmId } from "../data/types.ts";
import type { Settings } from "../kit/Chrome.tsx";
import { stopSpeaking, voiceReady } from "../kit/speech.ts";
import { HubPage } from "../pages/HubPage.tsx";

const RealmPage = lazy(() => import("../pages/RealmPage.tsx").then((m) => ({ default: m.RealmPage })));
/** 故事页连同完整故事数据和配音清单（动画时间轴按配音时长排）一起按需加载 */
const StoryRoute = lazy(() =>
  Promise.all([import("../pages/StoryPage.tsx"), loadStories(), voiceReady]).then(([page, data]) => ({
    default: ({ id, settings }: { id: string; settings: Settings }) => (
      <page.StoryPage story={data.storyById(id) ?? data.allStories[0]} settings={settings} />
    )
  }))
);
const GlobeWorkbenchPage = lazy(() =>
  import("../pages/GlobeWorkbenchPage.tsx").then((m) => ({ default: m.GlobeWorkbenchPage }))
);
const QuizPage = lazy(() => import("../pages/QuizPage.tsx").then((m) => ({ default: m.QuizPage })));

const SOUND_STORAGE_KEY = "geoverse:sound:v1";

function readSoundPreference(): boolean {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

type Route =
  | { kind: "hub" }
  | { kind: "realm"; id: RealmId }
  | { kind: "story"; id: string }
  | { kind: "globe"; mode?: "sandbox" | "seasons" | "flight" | "pinpoint" }
  | { kind: "quiz" };

function parseHash(): Route {
  const hash = window.location.hash || "#/";
  const regMatch = hash.match(/^#\/realm\/([^/?#]+)/);
  if (regMatch) {
    const id = regMatch[1] as RealmId;
    if (realms.some((r) => r.id === id)) return { kind: "realm", id };
  }
  const storyMatch = hash.match(/^#\/story\/([^/?#]+)/);
  if (storyMatch && storyCardById(storyMatch[1])) {
    return { kind: "story", id: storyMatch[1] };
  }
  const globeMatch = hash.match(/^#\/(?:globe|atlas)(?:\/(sandbox|seasons|flight|pinpoint))?/);
  if (globeMatch) {
    return {
      kind: "globe",
      mode: (globeMatch[1] as "sandbox" | "seasons" | "flight" | "pinpoint" | undefined) ?? "sandbox"
    };
  }
  if (/^#\/quiz/.test(hash)) return { kind: "quiz" };
  return { kind: "hub" };
}

const SITE = "地理奇遇记";

function titleOf(route: Route): string {
  switch (route.kind) {
    case "realm":
      return `${realmById(route.id).title} · ${SITE}`;
    case "story":
      return `${storyCardById(route.id)?.title ?? "地理动画"} · ${SITE}`;
    case "globe":
      return `逼真 3D 地球仪 · ${SITE}`;
    case "quiz":
      return `地理原理实验室与经纬寻宝 · ${SITE}`;
    default:
      return `${SITE} · 小念和爸爸的地球探索馆`;
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const [sound, setSoundState] = useState<boolean>(readSoundPreference);

  const setSound = useCallback((on: boolean) => {
    setSoundState(on);
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, on ? "on" : "off");
    } catch {
      // ignore storage quota errors
    }
  }, []);

  useEffect(() => {
    const onHash = () => {
      stopSpeaking(true);
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const settings = { sound, setSound };

  useEffect(() => {
    document.title = titleOf(route);
  }, [route]);

  if (route.kind === "realm") {
    return (
      <Suspense fallback={null}>
        <RealmPage realmId={route.id} settings={settings} />
      </Suspense>
    );
  }
  if (route.kind === "story") {
    return (
      <Suspense fallback={null}>
        <StoryRoute id={route.id} settings={settings} />
      </Suspense>
    );
  }
  if (route.kind === "globe") {
    return (
      <Suspense fallback={null}>
        <GlobeWorkbenchPage key={route.mode ?? "sandbox"} settings={settings} initialMode={route.mode} />
      </Suspense>
    );
  }
  if (route.kind === "quiz") {
    return (
      <Suspense fallback={null}>
        <QuizPage settings={settings} />
      </Suspense>
    );
  }
  return <HubPage settings={settings} />;
}
