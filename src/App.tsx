import { LEVELS, LAYERS } from "@data/locations";
import { shuffle, shuffleChallenges } from "@utils/functions";

import { useState, useRef } from "react";
import "./App.css";
import type { LEVEL, CHALLENGE } from "@data/types";

const TYPE_ICONS = { NORMAL: "⚔", SECRET: "🔮", PRIME: "★", BOSS: "💀" };
const TYPE_LABELS = { NORMAL: "NORMAL", SECRET: "SECRET", PRIME: "PRIME SANCTUM", BOSS: "BOSS" };

type EnrichedLevel = LEVEL & { challenges: CHALLENGE[]; pRank?: boolean };

export default function App() {
  const [includeNormal, setIncludeNormal] = useState(true);
  const [includeSecret, setIncludeSecret] = useState(true);
  const [includePrime, setIncludePrime] = useState(false);
  const [includeBoss, setIncludeBoss] = useState(false);
  const [count, setCount] = useState(1);
  const [withChallenges, setWithChallenges] = useState(false);
  const [results, setResults] = useState<EnrichedLevel[]>([]);
  const [rollCount, setRollCount] = useState(0);
  const [noPool, setNoPool] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const maxCount = 10;

  const handleRoll = () => {
    const LEVELS_DATA = Object.values(LEVELS);

    const pool = LEVELS_DATA.filter(l => {
      if (l.type === "NORMAL" && !includeNormal) return false;
      if (l.type === "SECRET" && !includeSecret) return false;
      if (l.type === "PRIME" && !includePrime) return false;
      if (l.type === "BOSS" && !includeBoss) return false;
      return true;
    });

    if (pool.length === 0) { setNoPool(true); setResults([]); return; }

    setNoPool(false);

    const shuffled = shuffle(pool);
    const picked = shuffled.slice(0, Math.min(count, pool.length));

    const enriched = picked.map(level => ({
      ...level,
      ...(withChallenges ? shuffleChallenges(level) : { challenges: [], pRank: false }),
    }));

    setResults(enriched);
    setRollCount(r => r + 1);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const layerColor = (layerId: number | "P") => LAYERS[layerId]?.color ?? "#aaaaaa";

  return (
    <>
      <div className="scanlines">
        <div className="app-wrapper">
          {/* Header */}
          <header className="header">
            <div className="header-blood" />
            <div className="game-title">
              <span className="glitch">ULTRANDOM</span>
            </div>
            <div className="subtitle">// ULTRAKILL LEVEL RANDOMIZER //</div>
            <div className="tagline">MANKIND IS ACCIDENT. UNCERTAINTY IS FUEL. FORTUNE IS FULL.</div>
          </header>
          <div className="main-container">
            {/* Level Type Filters */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-header-dot" />
                <span className="panel-title">LEVEL FILTER CONFIGURATION</span>
              </div>
              <div className="panel-body">
                <div className="options-grid">
                  {[
                    { key: "NORMAL", state: includeNormal, set: setIncludeNormal, label: "NORMAL LEVELS", icon: "⚔" },
                    { key: "SECRET", state: includeSecret, set: setIncludeSecret, label: "SECRET LEVELS", icon: "🔮" },
                    { key: "PRIME", state: includePrime, set: setIncludePrime, label: "PRIME SANCTUMS", icon: "★" },
                    { key: "BOSS", state: includeBoss, set: setIncludeBoss, label: "BOSS LEVELS", icon: "💀" },
                  ].map(({ key, state, set, label, icon }) => (
                    <div
                      key={key}
                      className={`toggle-label${state ? " active" : ""}`}
                      onClick={() => set(s => !s)}
                    >
                      <div className="toggle-checkbox" />
                      <span className="toggle-text">{label}</span>
                      <span className="toggle-icon">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-header-dot" />
                <span className="panel-title">EXECUTION PARAMETERS</span>
              </div>
              <div className="panel-body">
                <div className="number-row">
                  <span className="number-label">LEVELS TO RANDOMIZE</span>
                  <div className="number-control">
                    <button className="num-btn" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
                    <div className="num-display">{count}</div>
                    <button className="num-btn" onClick={() => setCount(c => Math.min(maxCount, c + 1))}>+</button>
                  </div>
                </div>

                <div className="challenge-toggle">
                  <div
                    className={`toggle-label${withChallenges ? " active" : ""}`}
                    onClick={() => setWithChallenges(s => !s)}
                    style={{ maxWidth: 380 }}
                  >
                    <div className="toggle-checkbox" />
                    <span className="toggle-text">RANDOMIZE CHALLENGES / P-RANK</span>
                    <span className="toggle-icon">🏆</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fire Button */}
            <div className="fire-btn-wrapper">
              <button
                className="fire-btn"
                onClick={handleRoll}
                disabled={!includeNormal && !includeSecret && !includePrime && !includeBoss}
              >
                ▶ RANDOMIZE ◀
              </button>
            </div>

            {/* Results */}
            {(results.length > 0 || noPool) && (
              <div className="panel results-panel" ref={resultRef}>
                <div className="panel-header">
                  <div className="panel-header-dot" />
                  <span className="panel-title">MISSION ASSIGNMENT</span>
                </div>
                <div className="panel-body" style={{ position: "relative" }}>
                  <div className="blood-drip" />

                  {noPool ? (
                    <div className="no-results">⚠ NO LEVELS MATCH CRITERIA — ENABLE AT LEAST ONE TYPE ⚠</div>
                  ) : (
                    <>
                      <div className="counter-bar">
                        <span className="counter-text">ROLL #{rollCount} — {results.length} LEVEL{results.length !== 1 ? "S" : ""} ASSIGNED</span>
                        <div className="separator" />
                        <span className="roll-count">[ STANDING BY<span className="blink">_</span> ]</span>
                      </div>

                      {results.map((level, i) => (
                        <div
                          key={`${rollCount}-${i}`}
                          className="result-card"
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          <div className="result-card-inner">
                            <div
                              className="card-layer-badge"
                              style={{ background: layerColor(level.layer) }}
                            />
                            <div className="card-content">
                              <div className="card-top">
                                <div>
                                  <div className="card-layer-label">
                                    LAYER {level.layer} — {LAYERS[level.layer]?.name ?? "UNKNOWN"}
                                  </div>
                                  <div className="card-level-name">{level.name}</div>
                                  <div className="card-level-id">LEVEL {level.id}</div>
                                </div>
                                <div className={`card-type-badge badge-${level.type}`}>
                                  {TYPE_ICONS[level.type]} {TYPE_LABELS[level.type]}
                                </div>
                              </div>

                              {withChallenges && (level.challenges && level.challenges.length > 0 || level.pRank) && (
                                <div className="challenge-block">
                                  <div className="challenge-header">⬡ CHALLENGES</div>
                                  <div className="challenge-list">
                                    {level.pRank && (
                                      <span className="challenge-tag prank">★ P-RANK REQUIRED</span>
                                    )}
                                    {level.challenges?.map((ch, ci) => (
                                      <span key={ci} className="challenge-tag">{typeof ch === 'string' ? ch : ch.task}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="footer-bar">
            // V1.0 — MACHINE UNIT V1-00 — BLOOD ENGINE ACTIVE //
          </div>
        </div>
      </div>
    </>
  );
}