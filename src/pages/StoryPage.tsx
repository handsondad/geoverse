import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GeoFigure } from "../components/GeoFigure.tsx";
import { GeoFilmPlayer, type GeoFilmPlayerHandle } from "../components/GeoFilmPlayer.tsx";
import { RealmArt } from "../components/RealmArt.tsx";
import { STORY_QUIZ_WIN_CHEER } from "../data/atlas-presets.ts";
import { realmById } from "../data/realms.ts";
import { storiesIn } from "../data/stories.ts";
import type { GeoStory } from "../data/types.ts";
import { chime } from "../kit/audio.ts";
import { Avatar } from "../kit/Avatar.tsx";
import { SpeakButton, TopBar, type Settings } from "../kit/Chrome.tsx";
import { WinCard } from "../kit/GameKit.tsx";
import { recordStars, sumStars, useStarBook } from "../kit/progress.ts";
import { stopSpeaking, type Who } from "../kit/speech.ts";

export function StoryPage({ story, settings }: { story: GeoStory; settings: Settings }) {
  const realm = realmById(story.realm);
  const siblings = storiesIn(story.realm).filter((s) => s.id !== story.id);
  const book = useStarBook();
  const earned = Math.min(3, sumStars(book[story.id]));

  const playerRef = useRef<GeoFilmPlayerHandle>(null);
  const stageBoxRef = useRef<HTMLDivElement>(null);
  const turnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [playingTurn, setPlayingTurn] = useState<{ turn: number; who?: Who }>({ turn: 0 });
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const [quizWon, setQuizWon] = useState(false);
  const [wonStars, setWonStars] = useState(0);

  useEffect(() => {
    setPlayingTurn({ turn: 0 });
    setPickedOption(null);
    setTries(0);
    setQuizWon(false);
    setWonStars(0);
    return () => stopSpeaking();
  }, [story.id]);

  const onTurn = useCallback((turn: number, who?: Who) => {
    setPlayingTurn({ turn, who });
  }, []);

  useEffect(() => {
    if (!playingTurn.who) return;
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches) {
      turnRefs.current[playingTurn.turn]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [playingTurn]);

  const sceneTurns = new Set(story.scenes.map((s) => s.turn));

  function watchTurn(turn: number) {
    stopSpeaking();
    playerRef.current?.playTurn(turn);
    stageBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function chooseAnswer(idx: number) {
    if (quizWon) return;
    setPickedOption(idx);
    const nextTries = tries + 1;
    setTries(nextTries);
    if (idx === story.quiz.answerIndex) {
      const stars = nextTries === 1 ? 3 : nextTries === 2 ? 2 : 1;
      setQuizWon(true);
      setWonStars(stars);
      recordStars(story.id, "quiz", stars);
      if (settings.sound) chime(true);
    } else if (settings.sound) {
      chime(false);
    }
  }

  return (
    <div className="page story-page">
      <TopBar
        icon={<RealmArt realm={story.realm} size="icon" />}
        title={story.title}
        backLabel={realm.title}
        onBack={() => {
          stopSpeaking();
          window.location.hash = `#/realm/${realm.id}`;
        }}
        stars={earned}
        maxStars={3}
        settings={settings}
      />

      <div className="story-subtitle-bar" style={{ "--bubble": realm.color } as CSSProperties}>
        <span className="story-era-pill">🧭 {story.badge}</span>
        <span>{story.subtitle}</span>
      </div>

      <main className="story-main">
        <div ref={stageBoxRef} className="story-film-col">
          <GeoFilmPlayer
            ref={playerRef}
            story={story}
            sound={settings.sound}
            onToggleSound={() => settings.setSound(!settings.sound)}
            onTurn={onTurn}
          />
        </div>

        <section className="story-chat-col" aria-label="小念和爸爸的地理问答">
          <p className="qa-scene">
            <span aria-hidden="true">📍</span> {story.trigger}
          </p>

          {story.dialogue.map((turn, idx) => {
            const isActiveTurn = playingTurn.turn === idx;
            const nianSpeaking = isActiveTurn && playingTurn.who === "nian";
            const dadSpeaking = isActiveTurn && playingTurn.who === "dad";
            return (
              <div
                key={idx}
                ref={(el) => {
                  turnRefs.current[idx] = el;
                }}
                className={`qa-turn${isActiveTurn ? " is-playing" : ""}`}
              >
                <div className={`qa-line is-nian${nianSpeaking ? " is-speaking" : ""}`}>
                  <span className="qa-avatar">
                    <Avatar who="nian" />
                  </span>
                  <div className="qa-bubble">
                    <div className="qa-head-row">
                      <span className="qa-name">小念</span>
                      <SpeakButton who="nian" text={turn.nian} />
                    </div>
                    <p>{turn.nian}</p>
                  </div>
                </div>

                <div className={`qa-line is-dad${dadSpeaking ? " is-speaking" : ""}`}>
                  <span className="qa-avatar">
                    <Avatar who="dad" />
                  </span>
                  <div className="qa-bubble">
                    <div className="qa-head-row">
                      <span className="qa-name">爸爸</span>
                      <SpeakButton who="dad" text={turn.dad} />
                    </div>
                    <p>{turn.dad}</p>

                    {turn.steps && (
                      <ol className="qa-steps" aria-label="图文步骤">
                        {turn.steps.map((st, sIdx) => (
                          <li key={st.label} style={{ "--i": sIdx } as CSSProperties}>
                            <span aria-hidden="true">{st.icon}</span>
                            <small>{st.label}</small>
                          </li>
                        ))}
                      </ol>
                    )}

                    {turn.figure && <GeoFigure figure={turn.figure} />}

                    {turn.factBadge && (
                      <div className="qa-fact-badge">
                        <span className="qa-fact-icon" aria-hidden="true">
                          {turn.factBadge.icon}
                        </span>
                        <div>
                          <strong>{turn.factBadge.title}</strong>
                          <small>{turn.factBadge.detail}</small>
                        </div>
                      </div>
                    )}

                    {sceneTurns.has(idx) && (
                      <button type="button" className="qa-watch" onClick={() => watchTurn(idx)}>
                        🌍 看这段地理动画
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <section className="card story-quiz-card" aria-label="小念考考你">
        <div className="story-quiz-head">
          <Avatar who="dad" />
          <div>
            <h3>🎯 听完地理故事，来答一道小问题拿星星吧！</h3>
            <p>{story.quiz.prompt}</p>
          </div>
        </div>

        <div className="story-quiz-options">
          {story.quiz.options.map((opt, idx) => {
            const isPicked = pickedOption === idx;
            const isRight = idx === story.quiz.answerIndex;
            const stateClass =
              quizWon && isRight
                ? " is-correct"
                : isPicked && !isRight
                  ? " is-wrong"
                  : "";
            return (
              <button
                key={opt}
                type="button"
                className={`pill-btn story-quiz-opt${stateClass}`}
                onClick={() => chooseAnswer(idx)}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>

        {pickedOption !== null && !quizWon && (
          <p className="banner is-warn">再想一想地球原理哦，爸爸在上面的对话里藏着线索呢！</p>
        )}

        {quizWon && (
          <WinCard
            stars={wonStars}
            verdict="答对啦，小小地理学家！"
            cheer={STORY_QUIZ_WIN_CHEER}
            explain={story.quiz.explain}
            nextLabel={siblings[0] ? `下一集：${siblings[0].title.split("？")[0]} →` : "去自由地球沙盘逛逛 →"}
            onNext={() => {
              stopSpeaking();
              window.location.hash = siblings[0] ? `#/story/${siblings[0].id}` : "#/atlas";
            }}
            onAgain={() => {
              setQuizWon(false);
              setPickedOption(null);
              setTries(0);
            }}
          />
        )}
      </section>

      <section className="story-footer-grid">
        {siblings.length > 0 && (
          <div className="card story-next-card">
            <h3>
              <Avatar who="nian" /> 小念还想看同馆故事
            </h3>
            <div className="story-next-list">
              {siblings.map((sib) => (
                <button
                  key={sib.id}
                  type="button"
                  className="pill-btn story-next-btn"
                  onClick={() => {
                    stopSpeaking();
                    window.location.hash = `#/story/${sib.id}`;
                  }}
                >
                  <RealmArt realm={sib.realm} size="icon" />
                  <span>{sib.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <details className="parent-tip">
          <summary>👨‍👩‍👧 给大人（亲子地理小实验提示{story.sources?.length ? "与权威参考" : ""}）</summary>
          <p>{story.parentTip}</p>
          {story.sources && story.sources.length > 0 && (
            <div className="parent-sources">
              <strong>📚 权威资料参考：</strong>
              <ul>
                {story.sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer">
                      {src.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>
      </section>
    </div>
  );
}
