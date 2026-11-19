import { useEffect, type CSSProperties } from "react";
import { MapThumb } from "../components/MapThumb.tsx";
import { RealmArt } from "../components/RealmArt.tsx";
import { realmById } from "../data/realms.ts";
import { storiesIn } from "../data/stories.ts";
import { geoTalks, geoWiki, realmChats } from "../data/talks.ts";
import type { RealmId } from "../data/types.ts";
import { Chat, TopBar, type Settings } from "../kit/Chrome.tsx";
import { TalksSection, WikiSection } from "../kit/GameKit.tsx";
import { sumStars, useStarBook } from "../kit/progress.ts";
import { pairLines, say, stopSpeaking } from "../kit/speech.ts";

const DIFFICULTY_LABEL: Record<"starter" | "explorer" | "master", string> = {
  starter: "入门",
  explorer: "进阶",
  master: "挑战"
};

export function RealmPage({ realmId, settings }: { realmId: RealmId; settings: Settings }) {
  const realm = realmById(realmId);
  const stories = storiesIn(realmId);
  const intro = realmChats[realmId];
  const wikiItems = geoWiki.filter((w) => w.realm === realmId);
  const talks = geoTalks.filter((t) => t.realm === realmId);
  const book = useStarBook();

  const maxStars = stories.length * 3;
  const earned = stories.reduce((acc, s) => acc + Math.min(3, sumStars(book[s.id])), 0);

  useEffect(() => {
    if (settings.sound && intro) say(...pairLines(intro));
    return () => stopSpeaking();
  }, [realmId, settings.sound, intro]);

  return (
    <div className="page home">
      <TopBar
        icon={<RealmArt realm={realm.id} size="icon" />}
        title={realm.title}
        onBack={() => {
          stopSpeaking();
          window.location.hash = "#/";
        }}
        backLabel="地球馆首页"
        stars={earned}
        maxStars={maxStars}
        settings={settings}
      />

      {intro && <Chat lines={pairLines(intro)} playLabel="听小念和爸爸导览" />}

      <div className="region-intro-banner" style={{ "--bubble": realm.color } as CSSProperties}>
        <span>🧭 {realm.subtitle}</span>
        <p>{realm.blurb}</p>
      </div>

      <h2 className="section-title">🎬 本馆互动地理动画 ({stories.length})</h2>
      <div className={`modes${stories.length <= 2 ? " is-two" : ""}`}>
        {stories.map((st) => {
          const stStars = Math.min(3, sumStars(book[st.id]));
          return (
            <button
              key={st.id}
              type="button"
              className="story-cover-card"
              style={{ "--bubble": realm.color } as CSSProperties}
              onClick={() => {
                stopSpeaking();
                window.location.hash = `#/story/${st.id}`;
              }}
            >
              <MapThumb story={st} />
              <div className="story-cover-body">
                <div className="story-cover-head">
                  <strong>{st.title}</strong>
                  <span className="story-cover-badges">
                    <span className={`difficulty-pill is-${st.difficulty}`}>{DIFFICULTY_LABEL[st.difficulty]}</span>
                    <span className="mode-tag">{st.badge}</span>
                  </span>
                </div>
                <small>{st.subtitle}</small>
                <span className="hall-preview" aria-hidden="true">
                  {st.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="hall-chip">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="mode-count">
                  <span>{stStars > 0 ? `⭐ ${stStars} / 3` : `${st.dialogue.length} 轮问答 + 地图剖面动画`}</span>
                  <span>开始探索 →</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <WikiSection
        items={wikiItems}
        colorsByRealm={{ [realm.id]: realm.color }}
        title={`📚 地理百宝箱 · ${realm.title}`}
        subtitle="读一段地球背后的真事，再跟孩子在家试一试"
      />

      <TalksSection talks={talks} title={`💬 小念问爸爸 · ${realm.title}`} />
    </div>
  );
}
