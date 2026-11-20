import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties } from "react";
import { RealmArt } from "../components/RealmArt.tsx";
import { quizStages } from "../data/quiz.ts";
import { realms } from "../data/realms.ts";
import { loadStories, storyCards, storyCardsIn } from "../data/story-index.ts";
import { geoTalks, geoWiki, hubChats } from "../data/talks.ts";
import type { GeoStory, RealmId } from "../data/types.ts";
import type { Settings } from "../kit/Chrome.tsx";
import { DuoStage, Meter, TalksSection, WikiSection } from "../kit/GameKit.tsx";
import { sumStars, useStarBook, type StarBook } from "../kit/progress.ts";
import { stopSpeaking } from "../kit/speech.ts";

const MapThumb = lazy(() => import("../components/MapThumb.tsx").then((m) => ({ default: m.MapThumb })));

const QUICK_KEYWORDS = ["珠穆朗玛峰", "撒哈拉", "三级阶梯", "秦岭", "四季", "马六甲"];

function pickRandomStoryId(book: StarBook): string {
  const unplayed = storyCards.filter((s) => sumStars(book[s.id]) === 0);
  const pool = unplayed.length > 0 ? unplayed : storyCards;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export function HubPage({ settings }: { settings: Settings }) {
  const [query, setQuery] = useState("");
  const book = useStarBook();
  /** 搜索要翻对白、缩略图要画分镜，所以第一次点搜索框时才加载完整故事 */
  const [fullStories, setFullStories] = useState<readonly GeoStory[] | null>(null);
  const [wantStories, setWantStories] = useState(false);

  useEffect(() => {
    if (!wantStories) return;
    let alive = true;
    loadStories()
      .then((m) => {
        if (alive) setFullStories(m.allStories);
      })
      .catch((error: unknown) => console.warn("地理故事没能加载，搜索暂时只能查百宝箱和问答。", error));
    return () => {
      alive = false;
    };
  }, [wantStories]);

  const totalStoryMax = storyCards.length * 3;
  const totalQuizTargets = quizStages.reduce((acc, s) => acc + s.targets.length, 0);
  const totalQuizMax = (quizStages.length + 1) * 3;
  const grandMax = totalStoryMax + totalQuizMax;

  const grandEarned =
    storyCards.reduce((acc, s) => acc + Math.min(3, sumStars(book[s.id])), 0) +
    Math.min(totalQuizMax, sumStars(book["geo-quiz"]));
  const pct = grandMax > 0 ? Math.round((grandEarned / grandMax) * 100) : 0;

  const colorByRealm = useMemo(
    () => Object.fromEntries(realms.map((r) => [r.id, r.color])) as Record<RealmId, string>,
    []
  );
  const realmMap = useMemo(
    () => Object.fromEntries(realms.map((r) => [r.id, r])) as Record<RealmId, (typeof realms)[number]>,
    []
  );

  const trimmed = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!trimmed) return null;
    const hit = (s: string) => s.toLowerCase().includes(trimmed);
    const matchedStories = (fullStories ?? []).filter((st) => {
      const reg = realmMap[st.realm];
      return (
        hit(st.title) ||
        hit(st.subtitle) ||
        hit(st.badge) ||
        st.tags.some(hit) ||
        (reg && hit(reg.title)) ||
        st.dialogue.some((d) => hit(d.nian) || hit(d.dad))
      );
    });
    const matchedWiki = geoWiki.filter(
      (w) => hit(w.title) || hit(w.place) || hit(w.story) || hit(w.familyTip)
    );
    const matchedTalks = geoTalks.filter(
      (t) => hit(t.title) || hit(t.wrap) || t.turns.some((turn) => hit(turn.nian) || hit(turn.dad))
    );
    return {
      stories: matchedStories,
      wiki: matchedWiki,
      talks: matchedTalks,
      total: matchedStories.length + matchedWiki.length + matchedTalks.length
    };
  }, [trimmed, realmMap, fullStories]);
  const searchingStories = Boolean(searchResults) && !fullStories;

  function nav(hash: string) {
    stopSpeaking();
    window.location.hash = hash;
  }

  return (
    <div className="page home">
      <header className="home-title">
        <h1>
          <span aria-hidden="true">🌍</span> 地理奇遇记
        </h1>
        <p>小念和爸爸的地球探索馆 · 从喜马拉雅到马里亚纳，看着会动的地图与剖面学地理</p>
      </header>

      <div className="hub-progress">
        <div className="hub-progress-info">
          <span aria-hidden="true">🏆</span>
          <span>地球探索勋章</span>
          <strong>
            ⭐ {grandEarned} / {grandMax}
          </strong>
        </div>
        <Meter pct={pct} label="点亮进度" valueText={`${pct}%`} />
        <button
          type="button"
          className="pill-btn sound-btn"
          aria-pressed={settings.sound}
          onClick={() => {
            if (settings.sound) stopSpeaking();
            settings.setSound(!settings.sound);
          }}
        >
          {settings.sound ? "🔊 声音：开" : "🔇 声音：关"}
        </button>
      </div>

      <DuoStage chats={hubChats} sound={settings.sound} />

      <section className="hub-finder" aria-label="快速寻找地理动画或进入实验室">
        <div className="hub-finder-bar">
          <label className="hub-search">
            <span className="hub-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              value={query}
              onFocus={() => setWantStories(true)}
              onChange={(e) => {
                setWantStories(true);
                setQuery(e.target.value);
              }}
              placeholder="搜一搜地貌、气候或名川：如 珠穆朗玛峰、撒哈拉、季风、秦岭、极光……"
              aria-label="搜索地理动画故事、问答或百科"
            />
            {query && (
              <button
                type="button"
                className="hub-search-clear"
                onClick={() => setQuery("")}
                aria-label="清空搜索"
              >
                ✕
              </button>
            )}
          </label>
          <button type="button" className="primary-btn is-blue hub-random-btn" onClick={() => nav("#/globe")}>
            🌐 逼真 3D 地球仪
          </button>
          <button type="button" className="primary-btn is-green hub-random-btn" onClick={() => nav("#/quiz")}>
            🔬 剖面实验与寻宝
          </button>
          <button
            type="button"
            className="primary-btn hub-random-btn"
            onClick={() => nav(`#/story/${pickRandomStoryId(book)}`)}
          >
            🎲 随便听一集
          </button>
        </div>

        {searchResults && (
          <div className="hub-search-results" aria-live="polite">
            <div className="hub-results-head">
              <strong>
                {searchingStories
                  ? "正在翻找地理动画故事……"
                  : searchResults.total > 0
                  ? `找到 ${searchResults.stories.length} 个地理动画故事、${searchResults.wiki.length} 段百宝箱、${searchResults.talks.length} 组问答`
                  : "没搜到这个词呢，试试下面这几个热门词？"}
              </strong>
              <div className="hub-quick-tags">
                {QUICK_KEYWORDS.map((kw) => (
                  <button key={kw} type="button" className="pill-btn hub-kw-chip" onClick={() => setQuery(kw)}>
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {searchResults.stories.length > 0 && (
              <div className="modes is-two hub-results-grid">
                {searchResults.stories.map((st) => {
                  const earned = Math.min(3, sumStars(book[st.id]));
                  const reg = realmMap[st.realm];
                  return (
                    <button
                      key={st.id}
                      type="button"
                      className="story-cover-card"
                      style={{ "--bubble": reg?.color ?? "#ff9f43" } as CSSProperties}
                      onClick={() => nav(`#/story/${st.id}`)}
                    >
                      <Suspense fallback={<span className="map-banner" aria-hidden="true" />}>
                        <MapThumb story={st} />
                      </Suspense>
                      <div className="story-cover-body">
                        <div className="story-cover-head">
                          <strong>{st.title}</strong>
                          <span className="mode-tag">{reg?.title}</span>
                        </div>
                        <small>{st.subtitle}</small>
                        <span className="mode-count">
                          <span>{earned > 0 ? `⭐ ${earned} / 3` : "🎬 带动画与配音"}</span>
                          <span>去看故事 →</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {searchResults.wiki.length > 0 && (
              <WikiSection
                items={searchResults.wiki}
                colorsByRealm={colorByRealm}
                title="📚 匹配的地理百宝箱"
                subtitle=""
              />
            )}

            {searchResults.talks.length > 0 && (
              <TalksSection talks={searchResults.talks} title="💬 匹配的小念问爸爸" />
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="hub-realms-title">
        <div className="section-head">
          <h2 id="hub-realms-title" className="section-title">
            六站系统地理探索路线（按第 1 → 6 站循序渐进）
          </h2>
          <span className="section-sub">
            共 {storyCards.length} 集互动地理动画 · {geoWiki.length} 篇百宝箱 · {geoTalks.length} 组父子问答
          </span>
        </div>
        <div className="modes">
          {realms.map((realm) => {
            const list = storyCardsIn(realm.id);
            const realmMax = list.length * 3;
            const realmEarned = list.reduce((acc, s) => acc + Math.min(3, sumStars(book[s.id])), 0);
            return (
              <button
                key={realm.id}
                type="button"
                className="mode-card hall-card has-region-art"
                style={{ "--bubble": realm.color } as CSSProperties}
                onClick={() => nav(`#/realm/${realm.id}`)}
              >
                <RealmArt realm={realm.id} size="card" />
                <strong>
                  {realm.title}
                  <span className="mode-tag">{realm.subtitle}</span>
                </strong>
                <small>{realm.blurb}</small>
                <span className="hall-preview" aria-hidden="true">
                  {list.map((st) => (
                    <span key={st.id} className="hall-chip">
                      {st.tags[0]}
                    </span>
                  ))}
                </span>
                <span className="mode-count">
                  <span>🎬 {list.length} 集动画问答</span>
                  <span>
                    ⭐ {realmEarned} / {realmMax} →
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="sandbox-banner-grid">
        <button
          type="button"
          className="mode-card sandbox-feature-card"
          style={{ "--bubble": "#4d96ff" } as CSSProperties}
          onClick={() => nav("#/globe")}
        >
          <span className="mode-emoji" aria-hidden="true">
            🌐
          </span>
          <strong>
            逼真 3D 交互地球仪 · 沙盘与实验室
            <span className="mode-tag">卫星地表 + 昼夜灯光 + 航线 + 3D寻宝</span>
          </strong>
          <small>
            360° 转动真实太空地球仪！看昼夜晨昏线与夜晚中国胡焕庸线星海、拨动四季倾角、拉出极地大圆航线与 3D 扎针寻宝！
          </small>
          <span className="mode-count">
            <span>4 合 1 立体地球工作台</span>
            <span>打开 3D 地球仪 →</span>
          </span>
        </button>

        <button
          type="button"
          className="mode-card sandbox-feature-card"
          style={{ "--bubble": "#3bb273" } as CSSProperties}
          onClick={() => nav("#/quiz")}
        >
          <span className="mode-emoji" aria-hidden="true">
            🔬
          </span>
          <strong>
            地理原理实验室 &amp; 经纬寻宝
            <span className="mode-tag">4 大交互模拟器 + {quizStages.length} 关扎针</span>
          </strong>
          <small>
            亲手拨动地球季节倾角、板块碰撞、地形雨影和季风开关看实时动画，再挑战 {totalQuizTargets} 道世界与中国寻宝扎针！
          </small>
          <span className="mode-count">
            <span>⭐ {Math.min(totalQuizMax, sumStars(book["geo-quiz"]))} / {totalQuizMax}</span>
            <span>开始实验 →</span>
          </span>
        </button>
      </div>

      <TalksSection talks={geoTalks.slice(0, 6)} title="💬 小念问爸爸 · 地球冷知识" />

      <p className="home-credit">
        选一座地球展厅推门进去，就能一边看地图与地质剖面动起来、一边听小念和爸爸一问一答
      </p>
    </div>
  );
}
