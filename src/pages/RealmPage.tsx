import { useEffect, type CSSProperties } from "react";
import { RealmArt } from "../components/RealmArt.tsx";
import { difficultyLabel, realmById, realms, realmShortTitle } from "../data/realms.ts";
import { storiesIn } from "../data/stories.ts";
import { geoTalks, geoWiki, realmChats } from "../data/talks.ts";
import type { GeoStory, RealmId } from "../data/types.ts";
import { Avatar } from "../kit/Avatar.tsx";
import type { Settings } from "../kit/Chrome.tsx";
import { TalksSection, WikiSection } from "../kit/GameKit.tsx";
import { sumStars, useStarBook } from "../kit/progress.ts";
import { isSpeaking, pairLines, say, stopSpeaking, useSpeaking } from "../kit/speech.ts";

const difficulties: readonly GeoStory["difficulty"][] = ["starter", "explorer", "master"];
const difficultyStars: Record<GeoStory["difficulty"], string> = { starter: "⭐", explorer: "⭐⭐", master: "⭐⭐⭐" };
const difficultyHint: Record<GeoStory["difficulty"], string> = {
  starter: "一听就懂的地球小问题",
  explorer: "要多想一步：风、水和大地在怎么接力？",
  master: "藏得更深的问题，大人也常常答不全"
};

function go(hash: string) {
  stopSpeaking();
  window.location.hash = hash;
}

export function RealmPage({ realmId, settings }: { realmId: RealmId; settings: Settings }) {
  const realm = realmById(realmId);
  const stories = storiesIn(realmId);
  const intro = realmChats[realmId];
  const introLines = intro ? pairLines(intro) : [];
  const wikiItems = geoWiki.filter((w) => w.realm === realmId);
  const talks = geoTalks.filter((t) => t.realm === realmId);
  const book = useStarBook();
  const speaking = useSpeaking();
  const guidePlaying = introLines.some((line) => isSpeaking(speaking, line.who, line.text));
  const answered = stories.filter((s) => sumStars(book[s.id]) > 0).length;

  useEffect(() => {
    if (settings.sound && intro) say(...pairLines(intro));
    return () => stopSpeaking();
  }, [realmId, settings.sound, intro]);

  return (
    <div className="page qlist realm-page" style={{ "--bubble": realm.color } as CSSProperties}>
      <header className="qa-top">
        <button type="button" className="pill-btn qa-back" onClick={() => go("#/")}>
          ← 回到地理首页
        </button>
        <div className="qa-heading">
          <span className="qa-meta">
            第 {realm.step} 站 · {stories.length} 个问题{answered > 0 && ` · ⭐ 答对 ${answered} 个`}
          </span>
          <h1>
            <RealmArt realm={realm.id} size="icon" /> {realmShortTitle(realm)}
          </h1>
        </div>
        <div className="qa-top-tools">
          <button
            type="button"
            className="pill-btn"
            aria-pressed={settings.sound}
            aria-label={settings.sound ? "音效与自动朗读：开" : "音效与自动朗读：关"}
            title={settings.sound ? "小念和爸爸会自动说话，带讲解配音" : "静音模式（点气泡上的 🔊 仍可单句听）"}
            onClick={() => {
              if (settings.sound) stopSpeaking();
              settings.setSound(!settings.sound);
            }}
          >
            {settings.sound ? "🔊 声音" : "🔇 静音"}
          </button>
        </div>
      </header>

      <div className="qlist-intro">
        {intro && (
          <>
            <p className={isSpeaking(speaking, "nian", intro[0]) ? "is-speaking" : undefined}>
              <Avatar who="nian" />
              <strong>小念：</strong>
              {intro[0]}
            </p>
            <p className={isSpeaking(speaking, "dad", intro[1]) ? "is-speaking" : undefined}>
              <Avatar who="dad" />
              <strong>爸爸：</strong>
              {intro[1]}
            </p>
          </>
        )}
        <p className="qlist-intro-foot">
          <span>
            🧭 {realm.subtitle}。{realm.blurb}
          </span>
          {intro && (
            <button
              type="button"
              className={`qlist-guide${guidePlaying ? " is-speaking" : ""}`}
              onClick={() => say(...introLines)}
            >
              {guidePlaying ? "🔊" : "▶"} 听小念和爸爸导览
            </button>
          )}
        </p>
      </div>

      {difficulties.map((level) => {
        const group = stories.filter((st) => st.difficulty === level);
        if (group.length === 0) return null;
        return (
          <section key={level} className="qlist-group" aria-label={difficultyLabel[level]}>
            <h2>
              <span aria-hidden="true">{difficultyStars[level]}</span> {difficultyLabel[level]}
              <small>{difficultyHint[level]}</small>
            </h2>
            <div className="qlist-grid">
              {group.map((st) => {
                const stars = Math.min(3, sumStars(book[st.id]));
                return (
                  <button
                    key={st.id}
                    type="button"
                    className={`qlist-card${stars > 0 ? " is-heard" : ""}`}
                    onClick={() => go(`#/story/${st.id}`)}
                  >
                    <strong>{st.title}</strong>
                    <small className="qlist-trigger">{st.trigger}</small>
                    <span className="qlist-badges">
                      <em>
                        💬 {st.dialogue.length} 问 {st.dialogue.length} 答
                      </em>
                      <em>🎬 地图动画</em>
                      <em>🧭 {st.badge}</em>
                      {stars > 0 && <em className="is-star">⭐ 答对 {stars}/3</em>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <WikiSection
        items={wikiItems}
        colorsByRealm={{ [realm.id]: realm.color }}
        title={`📚 地理百宝箱 · ${realmShortTitle(realm)}`}
        subtitle="读一段地球背后的真事，再跟孩子在家试一试"
      />

      <TalksSection talks={talks} title={`💬 小念问爸爸 · ${realmShortTitle(realm)}`} />

      <nav className="qlist-other" aria-label="换一个主题">
        <h2>换一个主题</h2>
        <div className="qlist-chips">
          {realms.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={item.id === realmId ? "true" : undefined}
              onClick={() => go(`#/realm/${item.id}`)}
            >
              {item.emoji} {realmShortTitle(item)}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
