import { useEffect, useRef, useState } from "react";

import { LAYERS, LEVELS } from "@data/locations";
import type { CHALLENGE, LEVEL, LEVEL_TYPE } from "@data/types";
import { shuffle, shuffleChallenges } from "@utils/functions";

import "./App.css";

type EnrichedLevel = LEVEL & { challenges: CHALLENGE[]; pRank: boolean };
type BackgroundChoice = "red" | "storm" | "rust" | "ash" | "catacombs";

type ChallengeRollConfig = {
  includeBaseChallenges: boolean;
  includeExtraChallenges: boolean;
  includePRank: boolean;
  baseChance: number;
  extraChance: number;
  prankChance: number;
};

const LEVEL_TYPE_META: Record<LEVEL_TYPE, { label: string; image: string; accent: string }> = {
  NORMAL: {
    label: "NORMAL",
    image: wikiFile("01_thumbnail.png"),
    accent: "normal",
  },
  SECRET: {
    label: "SECRET",
    image: wikiFile("QuestionMark.svg"),
    accent: "secret",
  },
  PRIME: {
    label: "PRIME SANCTUMS",
    image: wikiFile("Minos_Prime.webp"),
    accent: "prime",
  },
  BOSS: {
    label: "BOSS",
    image: wikiFile("Gabriel, Judge of Hell.webp"),
    accent: "boss",
  },
};

const LAYER_ORDER: Array<number | "P"> = [0, 1, 2, 3, 4, 5, 6, 7, 8, "P"];
const BACKGROUNDS: Array<{ id: BackgroundChoice; label: string; image?: string }> = [
  { id: "red", label: "Red Field" },
  { id: "storm", label: "Storm Wall", image: "/background/1350597.jpeg" },
  { id: "rust", label: "Rust Veil", image: "/background/1347555.jpeg" },
  { id: "ash", label: "Ash Grid", image: "/background/1270683.png" },
  { id: "catacombs", label: "Catacombs", image: "/background/1168975.png" },
];

const ALL_LEVELS = Object.values(LEVELS);
const LEVELS_BY_LAYER = LAYER_ORDER.map(layer => ({
  layer,
  levels: ALL_LEVELS.filter(level => level.layer === layer),
}));

function wikiFile(fileName: string) {
  return `https://ultrakill.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

function createSelectionMap(keys: readonly (string | number)[], initialValue = true) {
  return Object.fromEntries(keys.map(key => [String(key), initialValue])) as Record<string, boolean>;
}

function percentToFloat(value: number) {
  return value / 100;
}

export default function App() {
  const [includeNormal, setIncludeNormal] = useState(true);
  const [includeSecret, setIncludeSecret] = useState(true);
  const [includePrime, setIncludePrime] = useState(false);
  const [includeBoss, setIncludeBoss] = useState(false);

  const [selectedLayers, setSelectedLayers] = useState<Record<string, boolean>>(() => createSelectionMap(LAYER_ORDER));
  const [selectedLevels, setSelectedLevels] = useState<Record<string, boolean>>(() => createSelectionMap(ALL_LEVELS.map(level => level.id)));

  const [count, setCount] = useState(1);
  const [results, setResults] = useState<EnrichedLevel[]>([]);
  const [rollCount, setRollCount] = useState(0);
  const [noPool, setNoPool] = useState(false);

  const [includeBaseChallenges, setIncludeBaseChallenges] = useState(true);
  const [includeExtraChallenges, setIncludeExtraChallenges] = useState(true);
  const [includePRank, setIncludePRank] = useState(true);
  const [baseChance, setBaseChance] = useState(33);
  const [extraChance, setExtraChance] = useState(10);
  const [prankChance, setPrankChance] = useState(50);

  const [selectedBackground, setSelectedBackground] = useState<BackgroundChoice>("red");
  const [bgmVolume, setBgmVolume] = useState(50);

  const resultRef = useRef<HTMLDivElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const parryRef = useRef<HTMLAudioElement>(null);
  const autoplayAttemptedRef = useRef(false);

  const maxCount = 10;

  useEffect(() => {
    const bgm = bgmRef.current;

    if (!bgm) {
      return;
    }

    bgm.volume = percentToFloat(bgmVolume);
  }, [bgmVolume]);

  useEffect(() => {
    const bgm = bgmRef.current;

    if (!bgm || autoplayAttemptedRef.current) {
      return;
    }

    autoplayAttemptedRef.current = true;
    bgm.volume = percentToFloat(bgmVolume);
    bgm.loop = true;

    const tryPlay = () => {
      void bgm.play().catch(() => {});
    };

    tryPlay();

    const retryPlay = () => {
      tryPlay();
    };

    window.addEventListener("pointerdown", retryPlay, { once: true });
    window.addEventListener("keydown", retryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", retryPlay);
      window.removeEventListener("keydown", retryPlay);
    };
  }, [bgmVolume]);

  const playParrySound = () => {
    const parry = parryRef.current;

    if (!parry) {
      return;
    }

    parry.currentTime = 0;
    parry.volume = 0.18;
    void parry.play().catch(() => {});
  };

  const setAllLayers = (value: boolean) => {
    setSelectedLayers(previous => {
      const next = { ...previous };

      for (const layer of LAYER_ORDER) {
        next[String(layer)] = value;
      }

      return next;
    });
  };

  const setLayerSelection = (layer: number | "P", value: boolean) => {
    setSelectedLayers(previous => ({
      ...previous,
      [String(layer)]: value,
    }));
  };

  const setAllLevels = (value: boolean) => {
    setSelectedLevels(previous => {
      const next = { ...previous };

      for (const level of ALL_LEVELS) {
        next[level.id] = value;
      }

      return next;
    });
  };

  const toggleLevel = (levelId: string) => {
    setSelectedLevels(previous => ({
      ...previous,
      [levelId]: !previous[levelId],
    }));
  };

  const handleRoll = () => {
    const pool = ALL_LEVELS.filter(level => {
      if (level.type === "NORMAL" && !includeNormal) return false;
      if (level.type === "SECRET" && !includeSecret) return false;
      if (level.type === "PRIME" && !includePrime) return false;
      if (level.type === "BOSS" && !includeBoss) return false;
      if (!selectedLayers[String(level.layer)]) return false;
      if (!selectedLevels[level.id]) return false;
      return true;
    });

    if (pool.length === 0) {
      setNoPool(true);
      setResults([]);
      return;
    }

    playParrySound();
    setNoPool(false);

    const shuffled = shuffle(pool);
    const picked = shuffled.slice(0, Math.min(count, pool.length));

    const challengeConfig: ChallengeRollConfig = {
      includeBaseChallenges,
      includeExtraChallenges,
      includePRank,
      baseChance: percentToFloat(baseChance),
      extraChance: percentToFloat(extraChance),
      prankChance: percentToFloat(prankChance),
    };

    const enriched = picked.map(level => {
      const challengeData = shuffleChallenges(level, challengeConfig);

      return {
        ...level,
        challenges: challengeData.challenges,
        pRank: challengeData.perfect_ranking,
      };
    });

    setResults(enriched);
    setRollCount(previous => previous + 1);

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const background = BACKGROUNDS.find(item => item.id === selectedBackground);
  const backgroundStyle =
    selectedBackground === "red"
      ? undefined
      : {
          backgroundImage: `linear-gradient(180deg, rgba(4, 0, 0, 0.7), rgba(12, 0, 0, 0.85)), url(${background?.image ?? ""})`,
        };

  const selectedLayerCount = LAYER_ORDER.filter(layer => selectedLayers[String(layer)]).length;
  const selectedLevelCount = ALL_LEVELS.filter(level => selectedLevels[level.id]).length;
  const filteredLevelCount = ALL_LEVELS.filter(level => {
    if (level.type === "NORMAL" && !includeNormal) return false;
    if (level.type === "SECRET" && !includeSecret) return false;
    if (level.type === "PRIME" && !includePrime) return false;
    if (level.type === "BOSS" && !includeBoss) return false;
    if (!selectedLayers[String(level.layer)]) return false;
    if (!selectedLevels[level.id]) return false;
    return true;
  }).length;

  return (
    <div className={`app-shell background-${selectedBackground}`} style={backgroundStyle}>
      <audio ref={bgmRef} src="/music/bgm.ogg" loop preload="auto" />
      <audio ref={parryRef} src="/music/ultrakill-parry.mp3" preload="auto" />

      <div className="scanlines">
        <div className="app-frame">
          <header className="hero-panel panel">
            <div className="hero-panel__topline">
              <div className="hero-tag">ULTRAKILL LEVEL RANDOMIZER</div>
              <div className="hero-tag hero-tag--muted">VISUAL / AUDIO / POOL CONTROL</div>
            </div>
            <h1 className="hero-title">ULTRANDOM</h1>
            <p className="hero-copy">
              Tune the atmosphere, narrow the pool, and reroll the mission set with a single strike.
            </p>
          </header>

          <main className="dashboard-grid">
            <section className="panel control-panel control-panel--wide">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">VISUAL / AUDIO LOADOUT</span>
              </div>
              <div className="panel-body control-stack">
                <div className="field-group">
                  <div className="field-label-row">
                    <span className="field-label">WALLPAPER</span>
                    <span className="field-value">{background?.label ?? "Red Field"}</span>
                  </div>
                  <div className="background-grid">
                    {BACKGROUNDS.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        className={`background-card${selectedBackground === item.id ? " active" : ""}`}
                        onClick={() => setSelectedBackground(item.id)}
                      >
                        <span className="background-card__preview" style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
                          {item.image ? null : <span className="background-card__preview-text">RED</span>}
                        </span>
                        <span className="background-card__label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <div className="field-label-row">
                    <span className="field-label">BGM VOLUME</span>
                    <span className="field-value">{bgmVolume}%</span>
                  </div>
                  <input
                    className="range-input"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={bgmVolume}
                    onChange={event => setBgmVolume(Number(event.target.value))}
                  />
                  <div className="field-hint">bgm.ogg starts automatically at 50% and follows this slider.</div>
                </div>
              </div>
            </section>

            <section className="panel control-panel">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">LEVEL TYPE FILTERS</span>
              </div>
              <div className="panel-body control-stack">
                <div className="type-grid">
                  {[
                    { key: "NORMAL", state: includeNormal, set: setIncludeNormal },
                    { key: "SECRET", state: includeSecret, set: setIncludeSecret },
                    { key: "PRIME", state: includePrime, set: setIncludePrime },
                    { key: "BOSS", state: includeBoss, set: setIncludeBoss },
                  ].map(item => {
                    const meta = LEVEL_TYPE_META[item.key as LEVEL_TYPE];

                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`type-card${item.state ? " active" : ""}`}
                        onClick={() => item.set(previous => !previous)}
                      >
                        <img className="type-card__icon" src={meta.image} alt="" aria-hidden="true" />
                        <span className="type-card__label">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="summary-line">{selectedLayerCount} layers selected, {selectedLevelCount} levels marked, {filteredLevelCount} currently eligible.</div>
              </div>
            </section>

            <section className="panel control-panel control-panel--wide">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">POOL LAYERS</span>
              </div>
              <div className="panel-body control-stack">
                <div className="action-row">
                  <button type="button" className="mini-action" onClick={() => setAllLayers(true)}>
                    Select all layers
                  </button>
                  <button type="button" className="mini-action" onClick={() => setAllLayers(false)}>
                    Clear layers
                  </button>
                </div>
                <div className="layer-grid">
                  {LAYER_ORDER.map(layer => {
                    const layerData = LAYERS[layer];
                    const active = selectedLayers[String(layer)];
                    const levelCount = ALL_LEVELS.filter(level => level.layer === layer).length;

                    return (
                      <button
                        key={String(layer)}
                        type="button"
                        className={`layer-card${active ? " active" : ""}`}
                        onClick={() => setLayerSelection(layer, !active)}
                      >
                        <span className="layer-card__swatch" style={{ background: layerData.color }} />
                        <span className="layer-card__meta">
                          <span className="layer-card__name">LAYER {layer} — {layerData.name}</span>
                          <span className="layer-card__count">{levelCount} levels</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="panel control-panel control-panel--wide">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">POOL LEVELS</span>
              </div>
              <div className="panel-body control-stack">
                <div className="action-row">
                  <button type="button" className="mini-action" onClick={() => setAllLevels(true)}>
                    Select all levels
                  </button>
                  <button type="button" className="mini-action" onClick={() => setAllLevels(false)}>
                    Clear levels
                  </button>
                </div>
                <div className="level-groups">
                  {LEVELS_BY_LAYER.map(group => {
                    const groupKey = String(group.layer);
                    const groupActive = selectedLayers[groupKey];

                    return (
                      <section key={groupKey} className={`layer-group${groupActive ? "" : " inactive"}`}>
                        <div className="layer-group__header">
                          <div className="layer-group__title">
                            LAYER {group.layer} — {LAYERS[group.layer].name}
                          </div>
                          <div className="layer-group__meta">{group.levels.length} mapped levels</div>
                        </div>
                        <div className="level-chip-grid">
                          {group.levels.map(level => {
                            const active = selectedLevels[level.id];

                            return (
                              <button
                                key={level.id}
                                type="button"
                                className={`level-chip${active ? " active" : ""}`}
                                onClick={() => toggleLevel(level.id)}
                              >
                                <span className="level-chip__id">{level.id}</span>
                                <span className="level-chip__name">{level.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="panel control-panel">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">CHALLENGE RULES</span>
              </div>
              <div className="panel-body control-stack">
                <div className="toggle-stack">
                  {[
                    {
                      title: "LEVEL CHALLENGES",
                      value: includeBaseChallenges,
                      setter: setIncludeBaseChallenges,
                      hint: "Uses the base challenge lines already attached to each level.",
                    },
                    {
                      title: "ADDITIONAL CHALLENGES",
                      value: includeExtraChallenges,
                      setter: setIncludeExtraChallenges,
                      hint: "Adds extra randomized objectives from the shared pool.",
                    },
                    {
                      title: "P-RANK",
                      value: includePRank,
                      setter: setIncludePRank,
                      hint: "Adds a separate P-RANK objective to the output card.",
                    },
                  ].map(item => (
                    <button
                      key={item.title}
                      type="button"
                      className={`switch-row${item.value ? " active" : ""}`}
                      onClick={() => item.setter(previous => !previous)}
                    >
                      <span className="switch-row__check" />
                      <span className="switch-row__text">
                        <span className="switch-row__title">{item.title}</span>
                        <span className="switch-row__hint">{item.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="slider-grid">
                  <div className="slider-card">
                    <div className="field-label-row">
                      <span className="field-label">BASE CHANCE</span>
                      <span className="field-value">{baseChance}%</span>
                    </div>
                    <input className="range-input" type="range" min={0} max={100} step={1} value={baseChance} onChange={event => setBaseChance(Number(event.target.value))} />
                  </div>
                  <div className="slider-card">
                    <div className="field-label-row">
                      <span className="field-label">EXTRA CHANCE</span>
                      <span className="field-value">{extraChance}%</span>
                    </div>
                    <input className="range-input" type="range" min={0} max={100} step={1} value={extraChance} onChange={event => setExtraChance(Number(event.target.value))} />
                  </div>
                  <div className="slider-card">
                    <div className="field-label-row">
                      <span className="field-label">P-RANK CHANCE</span>
                      <span className="field-value">{prankChance}%</span>
                    </div>
                    <input className="range-input" type="range" min={0} max={100} step={1} value={prankChance} onChange={event => setPrankChance(Number(event.target.value))} />
                  </div>
                </div>
              </div>
            </section>

            <section className="panel control-panel">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">EXECUTION PARAMETERS</span>
              </div>
              <div className="panel-body control-stack">
                <div className="field-group">
                  <div className="field-label-row">
                    <span className="field-label">LEVELS TO RANDOMIZE</span>
                    <span className="field-value">{count}</span>
                  </div>
                  <div className="number-control">
                    <button className="num-btn" type="button" onClick={() => setCount(previous => Math.max(1, previous - 1))}>−</button>
                    <div className="num-display">{count}</div>
                    <button className="num-btn" type="button" onClick={() => setCount(previous => Math.min(maxCount, previous + 1))}>+</button>
                  </div>
                </div>

                <div className="action-row action-row--center">
                  <button
                    className="fire-btn"
                    type="button"
                    onClick={handleRoll}
                    disabled={!includeNormal && !includeSecret && !includePrime && !includeBoss}
                  >
                    RANDOMIZE
                  </button>
                </div>
              </div>
            </section>

            {(results.length > 0 || noPool) && (
              <section className="panel results-panel" ref={resultRef}>
                <div className="panel-header">
                  <span className="panel-header-dot" />
                  <span className="panel-title">MISSION ASSIGNMENT</span>
                </div>
                <div className="panel-body results-body">
                  {noPool ? (
                    <div className="no-results">NO LEVELS MATCH THE CURRENT FILTERS.</div>
                  ) : (
                    <>
                      <div className="counter-bar">
                        <span className="counter-text">
                          ROLL #{rollCount} - {results.length} LEVEL{results.length !== 1 ? "S" : ""} ASSIGNED
                        </span>
                        <div className="separator" />
                        <span className="roll-count">[ STANDING BY<span className="blink">_</span> ]</span>
                      </div>

                      <div className="result-list">
                        {results.map((level, index) => (
                          <article key={`${rollCount}-${level.id}-${index}`} className="result-card" style={{ animationDelay: `${index * 0.08}s` }}>
                            <div className="result-card__accent" style={{ background: LAYERS[level.layer].color }} />
                            <div className="result-card__content">
                              <div className="result-topline">
                                <div>
                                  <div className="result-layer">LAYER {level.layer} - {LAYERS[level.layer]?.name ?? "UNKNOWN"}</div>
                                  <div className="result-name">{level.name}</div>
                                  <div className="result-id">LEVEL {level.id}</div>
                                </div>
                                <div className={`type-badge type-badge--${LEVEL_TYPE_META[level.type].accent}`}>
                                  <img className="type-badge__icon" src={LEVEL_TYPE_META[level.type].image} alt="" aria-hidden="true" />
                                  <span>{LEVEL_TYPE_META[level.type].label}</span>
                                </div>
                              </div>

                              {(level.challenges.length > 0 || level.pRank) && (
                                <div className="challenge-block">
                                  <div className="challenge-title">CHALLENGES</div>
                                  <div className="challenge-list">
                                    {level.pRank && <span className="challenge-pill challenge-pill--prank">P-RANK</span>}
                                    {level.challenges.map((challenge, challengeIndex) => (
                                      <span key={`${level.id}-challenge-${challengeIndex}`} className="challenge-pill">
                                        {challenge.task}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}
          </main>

          <footer className="footer-bar">ULTRARANDOM // BLOOD ENGINE ACTIVE // BGM + RANDOMIZED POOL CONTROL</footer>
        </div>
      </div>
    </div>
  );
}
