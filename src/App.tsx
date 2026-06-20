import { useEffect, useRef, useState } from "react";

import {
  LAYERS,
  LEVELS
} from "@data/locations";

import type {
  LEVEL_TYPE,
  LEVEL_TYPEDATA,
  EnrichedLevel,
} from "@data/types";

import type {
  ChallengeRollConfig
} from "@utils/types";

import {
  shuffle,
  shuffleChallenges
} from "@utils/functions";

import {
  IconMute,
  IconSettings
} from '@components/svg/Icons';

import type {
  SettingsTab,
  BackgroundChoice
} from "@utils/pages/visuals";

import "./App.css";
import { DIFFICULTIES } from "@data/difficulties";

const LEVEL_TYPE_META: Record<LEVEL_TYPE, LEVEL_TYPEDATA> = {
  NORMAL: {
    label: "NORMAL",
    image: "/media/images/normal.png",
    accent: "normal",
  },
  SECRET: {
    label: "SECRET",
    image: "/media/images/secret.svg",
    accent: "secret",
  },
  PRIME: {
    label: "PRIME SANCTUMS",
    image: "/media/images/prime.png",
    accent: "prime",
  },
  BOSS: {
    label: "BOSS",
    image: "/media/images/boss.png",
    accent: "boss",
  },
  ENCORES: {
    label: "ENCORES",
    image: "/media/images/encore.png",
    accent: "encores"
  }
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

function createSelectionMap(keys: readonly (string | number)[], initialValue = true) {
  return Object.fromEntries(keys.map(key => [String(key), initialValue])) as Record<string, boolean>;
}

function percentToFloat(value: number) {
  return value / 100;
}

export default function App() {
  // Main filters (visible on home page)
  const [includeNormal, setIncludeNormal] = useState(true);
  const [includeSecret, setIncludeSecret] = useState(false);
  const [includePrime, setIncludePrime] = useState(false);
  const [includeBoss, setIncludeBoss] = useState(false);
  const [includeEncores, setIncludeEncores] = useState(false);
  const [includeDifficulties, setIncludeDifficulties] = useState(true);

  // Pool selection (inside settings)
  const [selectedLayers, setSelectedLayers] = useState<Record<string, boolean>>(
    () => createSelectionMap(LAYER_ORDER),
  );
  const [selectedLevels, setSelectedLevels] = useState<Record<string, boolean>>(
    () => createSelectionMap(ALL_LEVELS.map(level => level.id)),
  );
  const [selectedDifficulties, setSeletedDifficulties] = useState<Record<string, boolean>>(
    () => createSelectionMap(DIFFICULTIES.map(diff => diff.id)),
  );

  // Count + results
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<EnrichedLevel[]>([]);
  const [rollCount, setRollCount] = useState(0);
  const [noPool, setNoPool] = useState(false);

  // Challenge settings (inside settings)
  const [includeBaseChallenges, setIncludeBaseChallenges] = useState(true);
  const [includeExtraChallenges, setIncludeExtraChallenges] = useState(true);
  const [includePRank, setIncludePRank] = useState(true);
  const [baseChance, setBaseChance] = useState(33);
  const [extraChance, setExtraChance] = useState(10);
  const [prankChance, setPrankChance] = useState(50);
  const [includeWeaponsChallenges, setIncludeWeaponsChallenges] = useState(true);
  const [specifyWeapons, setSpecifyWeapons] = useState(false);
  const [specifyVarieties, setSpecifyVarieties] = useState(false);

  // Visual/audio (inside settings)
  const [selectedBackground, setSelectedBackground] = useState<BackgroundChoice>("red");
  const [bgmVolume, setBgmVolume] = useState(50);
  const [muted, setMuted] = useState(true);

  // Settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("visual");

  // Refs
  const resultRef = useRef<HTMLDivElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const parryRef = useRef<HTMLAudioElement>(null);

  const maxCount = 10;

  // BGM volume sync
  useEffect(() => {
    const bgm = bgmRef.current;
    if (!bgm) return;
    bgm.volume = muted ? 0 : percentToFloat(bgmVolume);
  }, [bgmVolume, muted]);

  // BGM autoplay
  useEffect(() => {
    const bgm = bgmRef.current;
    if (!bgm) return;

    const unlockAudio = async () => {
      try {
        bgm.muted = false;
        bgm.volume = percentToFloat(bgmVolume);

        if (bgm.paused) {
          await bgm.play();
        }

        setMuted(false);

        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [bgmVolume]);

  // Mute/unmute BGM
  const toggleMute = () => {
    const bgm = bgmRef.current;
    if (!bgm) return;
    const next = !muted;
    setMuted(next);
    bgm.volume = next ? 0 : percentToFloat(bgmVolume);
  };

  // Parry SFX
  const playParrySound = () => {
    const sfx = new Audio("/music/ultrakill-parry.mp3");
    sfx.volume = 0.18;

    void sfx.play().catch(() => { });
  };

  // Layer helpers
  const setAllLayers = (value: boolean) =>
    setSelectedLayers(prev => {
      const next = { ...prev };
      for (const layer of LAYER_ORDER) next[String(layer)] = value;
      return next;
    });

  const setLayerSelection = (layer: number | "P", value: boolean) =>
    setSelectedLayers(prev => ({ ...prev, [String(layer)]: value }));

  // ── Level helpers ─────────────────────────────────────────────────────────
  const setAllLevels = (value: boolean) =>
    setSelectedLevels(prev => {
      const next = { ...prev };
      for (const level of ALL_LEVELS) next[level.id] = value;
      return next;
    });

  const toggleLevel = (levelId: string) =>
    setSelectedLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));

  const toggleDifficulty = (diffId: number) =>
    setSeletedDifficulties(prev => ({ ...prev, [diffId]: !prev[diffId] }));

  // ── Roll ──────────────────────────────────────────────────────────────────
  const handleRoll = () => {
    const pool = ALL_LEVELS.filter(level => {
      if (level.type === "NORMAL" && !includeNormal) return false;
      if (level.type === "SECRET" && !includeSecret) return false;
      if (level.type === "PRIME" && !includePrime) return false;
      if (level.type === "BOSS" && !includeBoss) return false;
      if (level.type === "ENCORES" && !includeEncores) return false;
      if (!selectedLayers[String(level.layer)]) return false;
      if (!selectedLevels[level.id]) return false;
      return true;
    });

    if (pool.length === 0) {
      setNoPool(true);
      setResults([]);
      return;
    }

    const bgm = bgmRef.current;

    if (bgm?.paused) {
      void bgm.play().catch(() => { });
    }

    playParrySound();
    setNoPool(false);

    const shuffled = shuffle(pool);
    const picked = shuffled.slice(0, Math.min(count, pool.length));

    const difficulties = DIFFICULTIES.filter(diff => selectedDifficulties[diff.id]);

    const challengeConfig: ChallengeRollConfig = {
      includeBaseChallenges,
      includeExtraChallenges,
      includePRank,
      baseChance: percentToFloat(baseChance),
      extraChance: percentToFloat(extraChance),
      prankChance: percentToFloat(prankChance),
      includeWeaponsChallenges: includeWeaponsChallenges,
      specifyWeapons: specifyWeapons,
      specifyVarieties: specifyVarieties
    };

    const enriched = picked.map(level => {
      const challengesData = shuffleChallenges(level, challengeConfig);
      return {
        ...level,
        challenges: challengesData.challenges,
        difficulty: difficulties.length > 0 ? shuffle(difficulties)[0] : undefined,
        perfect_ranking: challengesData.perfect_ranking,
      };
    });

    setResults(enriched);
    setRollCount(prev => prev + 1);

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const background = BACKGROUNDS.find(item => item.id === selectedBackground);
  const backgroundStyle =
    selectedBackground === "red"
      ? undefined
      : {
        backgroundImage: `linear-gradient(180deg, rgba(4,0,0,0.7), rgba(12,0,0,0.85)), url(${background?.image ?? ""})`,
      };

  const selectedLayerCount = LAYER_ORDER.filter(l => selectedLayers[String(l)]).length;
  const selectedLevelCount = ALL_LEVELS.filter(l => selectedLevels[l.id]).length;
  const filteredLevelCount = ALL_LEVELS.filter(level => {
    if (level.type === "NORMAL" && !includeNormal) return false;
    if (level.type === "SECRET" && !includeSecret) return false;
    if (level.type === "PRIME" && !includePrime) return false;
    if (level.type === "BOSS" && !includeBoss) return false;
    if (level.type === "ENCORES" && !includeEncores) return false;
    if (!selectedLayers[String(level.layer)]) return false;
    if (!selectedLevels[level.id]) return false;
    return true;
  }).length;

  const nothingEnabled =
    (
      !includeNormal &&
      !includeSecret &&
      !includePrime &&
      !includeBoss &&
      !includeEncores) ||
    (
      includeDifficulties &&
      DIFFICULTIES.filter(diff => selectedDifficulties[diff.id]).length < 1
    );

  // Close settings on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSettingsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Render
  return (
    <div className={`app-shell background-${selectedBackground}`} style={backgroundStyle}>
      <audio ref={bgmRef} src="/music/bgm.ogg" loop muted preload="auto" />
      <audio ref={parryRef} src="/music/ultrakill-parry.mp3" preload="auto" />

      <div className="scanlines">
        <div className="app-frame">

          {/* HERO */}
          <header className="hero-panel panel">
            <div className="hero-panel__topline">
              <div className="hero-tag">ULTRAKILL LEVEL RANDOMIZER</div>
              <div className="hero-tag hero-tag--muted">BOILING BLOOD...</div>
            </div>
            <h1 className="hero-title">ULTRANDOM</h1>
            <p className="hero-copy">
              Select level types, set the count, and parry RANDOMIZE. Open SETTINGS to tune the pool, wallpaper, audio, and challenge odds.
            </p>
          </header>

          {/* ── MAIN GRID ────────────────────────────────────────────────── */}
          <main className="dashboard-grid">

            {/* Level type filters */}
            <section className="panel control-panel">
              <div className="panel-header">
                <span className="panel-header-dot" />
                <span className="panel-title">LEVEL TYPE FILTERS</span>
              </div>
              <div className="panel-body control-stack">
                <div className="type-grid">
                  {(
                    [
                      { key: "NORMAL" as LEVEL_TYPE, state: includeNormal, set: setIncludeNormal },
                      { key: "SECRET" as LEVEL_TYPE, state: includeSecret, set: setIncludeSecret },
                      { key: "PRIME" as LEVEL_TYPE, state: includePrime, set: setIncludePrime },
                      { key: "BOSS" as LEVEL_TYPE, state: includeBoss, set: setIncludeBoss },
                      { key: "ENCORES" as LEVEL_TYPE, state: includeEncores, set: setIncludeEncores }
                    ] as const
                  ).map(item => {
                    const meta = LEVEL_TYPE_META[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`type-card${item.state ? " active" : ""}`}
                        onClick={() => item.set(prev => !prev)}
                      >
                        <img className="type-card__icon" src={meta.image} alt="" aria-hidden="true" />
                        <span className="type-card__label">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="summary-line">
                  {selectedLayerCount} layers · {selectedLevelCount} levels marked · {filteredLevelCount} eligible
                </div>
              </div>
            </section>

            {/* Execution parameters */}
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
                    <button className="num-btn" type="button" onClick={() => setCount(p => Math.max(1, p - 1))}>−</button>
                    <div className="num-display">{count}</div>
                    <button className="num-btn" type="button" onClick={() => setCount(p => Math.min(maxCount, p + 1))}>+</button>
                  </div>
                  <div className={`field-group${!includeDifficulties ? ' inactive' : ''}`}>
                    <span className="field-label">DIFFICULTIES</span>
                    <div className="level-chip-grid">
                      {
                        DIFFICULTIES.map(diff => {
                          const active = selectedDifficulties[diff.id];
                          return (
                            <button
                              key={diff.id}
                              type="button"
                              className={`type-card${active ? " active" : ""}`}
                              onClick={() => toggleDifficulty(diff.id)}
                            >
                              <span className="level-chip__name">{diff.name}</span>

                            </button>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="action-row action-row--center">
              <button
                className="fire-btn"
                type="button"
                onClick={handleRoll}
                disabled={nothingEnabled}
              >
                RANDOMIZE
              </button>
            </div>

            {/* Results */}
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
                          ROLL #{rollCount} — {results.length} LEVEL{results.length !== 1 ? "S" : ""} ASSIGNED
                        </span>
                        <div className="separator" />
                        <span className="roll-count">[ STANDING BY<span className="blink">_</span> ]</span>
                      </div>

                      <div className="result-list">
                        {results.map((level, index) => (
                          <article
                            key={`${rollCount}-${level.id}-${index}`}
                            className="result-card"
                            style={{ animationDelay: `${index * 0.08}s` }}
                          >
                            <div className="result-card__accent" style={{ background: LAYERS[level.layer].color }} />
                            <div className="result-card__content">
                              <div className="result-topline">
                                <div>
                                  <div className="result-layer">LAYER {level.layer} — {LAYERS[level.layer]?.name ?? "UNKNOWN"}</div>
                                  <div className="result-name">{level.name}</div>
                                  <div className="result-id">LEVEL {level.id} {(level.difficulty && includeDifficulties) ? `(${level.difficulty.name})` : ''}</div>
                                </div>
                                <div className={`type-badge type-badge--${LEVEL_TYPE_META[level.type].accent}`}>
                                  <img className="type-badge__icon" src={LEVEL_TYPE_META[level.type].image} alt="" aria-hidden="true" />
                                  <span>{LEVEL_TYPE_META[level.type].label}</span>
                                </div>
                              </div>

                              {(level.challenges.length > 0 || level.perfect_ranking) && (
                                <div className="challenge-block">
                                  <div className="challenge-title">CHALLENGES</div>
                                  <div className="challenge-list">
                                    {level.perfect_ranking && (
                                      <span className="challenge-pill challenge-pill--prank">P-RANK</span>
                                    )}
                                    {level.challenges.map((challenge, ci) => (
                                      <span key={`${level.id}-ch-${ci}`} className="challenge-pill">
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

          <footer className="footer-bar">
            <p>ASSET ORIGIN: NEW BLOOD INTERACTIVE // ALL ORIGINAL ULTRAKILL ASSETS (AUDIO, SPRITES, MODELS)</p>
            <p>{">>>"} ARE THE PROPERTY OF ARSI "HAKITA" PATALA & NEW BLOOD INTERACTIVE. {"<<<"}</p>
          </footer>
        </div>
      </div>

      {/* ── CORNER CONTROLS ────────────────────────────────────────────────── */}
      <div className="corner-controls">
        {/* Quick mute toggle */}
        <button
          type="button"
          className={`corner-btn mute-btn${muted ? " mute-btn--muted" : ""}`}
          onClick={toggleMute}
          title={muted ? "Unmute audio" : "Mute audio"}
          aria-label={muted ? "Unmute audio" : "Mute audio"}
        >
          <IconMute muted={muted} />
        </button>

        {/* Settings button */}
        <button
          type="button"
          className="corner-btn settings-btn"
          onClick={() => setSettingsOpen(true)}
          title="Open settings"
          aria-label="Open settings"
        >
          <IconSettings />
          <span>SETTINGS</span>
        </button>
      </div>

      {/* ── SETTINGS MODAL ──────────────────────────────────────────────────── */}
      {settingsOpen && (
        <div
          className="settings-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
          onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false); }}
        >
          <div className="settings-modal">
            {/* Modal header */}
            <div className="settings-modal__header">
              <div className="settings-modal__title-row">
                <span className="panel-header-dot" />
                <span className="panel-title">SETTINGS</span>
              </div>
              <button
                type="button"
                className="settings-close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            {/* Tab bar */}
            <div className="settings-tabs" role="tablist">
              {(
                [
                  { id: "visual" as SettingsTab, label: "VISUAL / AUDIO" },
                  { id: "pool" as SettingsTab, label: "LEVEL POOL" },
                  { id: "challenges" as SettingsTab, label: "CHALLENGES" },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`settings-tab${activeTab === tab.id ? " settings-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="settings-modal__body">

              {/* ── VISUAL / AUDIO tab ──────────────────────────────────── */}
              {activeTab === "visual" && (
                <div className="control-stack">
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
                          <span
                            className="background-card__preview"
                            style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                          >
                            {item.image ? null : (
                              <span className="background-card__preview-text">RED</span>
                            )}
                          </span>
                          <span className="background-card__label">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <div className="field-label-row">
                      <span className="field-label">BGM VOLUME</span>
                      <span className="field-value">{muted ? "MUTED" : `${bgmVolume}%`}</span>
                    </div>
                    <input
                      className="range-input"
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={bgmVolume}
                      disabled={muted}
                      onChange={e => setBgmVolume(Number(e.target.value))}
                    />
                    <div className="field-hint">
                      bgm.ogg starts after your first interaction at 50%. Use the mute button (bottom-left) for quick toggle.
                    </div>
                  </div>
                </div>
              )}

              {/* ── LEVEL POOL tab ──────────────────────────────────────── */}
              {activeTab === "pool" && (
                <div className="control-stack">
                  {/* Layers */}
                  <div className="field-group">
                    <div className="field-label-row">
                      <span className="field-label">POOL LAYERS</span>
                    </div>
                    <div className="action-row">
                      <button type="button" className="mini-action" onClick={() => setAllLayers(true)}>Select all</button>
                      <button type="button" className="mini-action" onClick={() => setAllLayers(false)}>Clear all</button>
                    </div>
                    <div className="layer-grid">
                      {LAYER_ORDER.map(layer => {
                        const layerData = LAYERS[layer];
                        const active = selectedLayers[String(layer)];
                        const levelCount = ALL_LEVELS.filter(l => l.layer === layer).length;

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

                  {/* Individual levels */}
                  <div className="field-group">
                    <div className="field-label-row">
                      <span className="field-label">POOL LEVELS</span>
                    </div>
                    <div className="action-row">
                      <button type="button" className="mini-action" onClick={() => setAllLevels(true)}>Select all</button>
                      <button type="button" className="mini-action" onClick={() => setAllLevels(false)}>Clear all</button>
                    </div>
                    <div className="level-groups">
                      {LEVELS_BY_LAYER.map(group => {
                        const groupKey = String(group.layer);
                        const groupActive = selectedLayers[groupKey];

                        return (
                          <section
                            key={groupKey}
                            className={`layer-group${groupActive ? "" : " inactive"}`}
                          >
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
                </div>
              )}

              {/* ── CHALLENGES tab ──────────────────────────────────────── */}
              {activeTab === "challenges" && (
                <div className="control-stack">
                  <div className="toggle-stack">
                    {(
                      [
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
                      ] as const
                    ).map(item => (
                      <button
                        key={item.title}
                        type="button"
                        className={`switch-row${item.value ? " active" : ""}`}
                        onClick={() => item.setter(prev => !prev)}
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
                    {(
                      [
                        { label: "BASE CHANCE", value: baseChance, set: setBaseChance },
                        { label: "EXTRA CHANCE", value: extraChance, set: setExtraChance },
                        { label: "P-RANK CHANCE", value: prankChance, set: setPrankChance },
                      ] as const
                    ).map(item => (
                      <div key={item.label} className="slider-card">
                        <div className="field-label-row">
                          <span className="field-label">{item.label}</span>
                          <span className="field-value">{item.value}%</span>
                        </div>
                        <input
                          className="range-input"
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={item.value}
                          onChange={e => item.set(Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="toggle-stack">
                    {(
                      [
                        {
                          title: "DIFFICULTIES",
                          value: includeDifficulties,
                          setter: setIncludeDifficulties,
                          hint: "Enable difficulty randomizer for each level.",
                        },
                        {
                          title: "ENABLE WEAPON-RELATED CHALLENGES",
                          value: includeWeaponsChallenges,
                          setter: setIncludeWeaponsChallenges,
                          hint: "Include weapon- or weapon varieties-specific challenges in extra challenges pool."
                        },
                        {
                          title: "SPECIFY WEAPONS CHALLENGE",
                          value: specifyWeapons,
                          setter: setSpecifyWeapons,
                          hint: "Weapon challenges will directly point to a random weapon of a challenge."
                        },
                        {
                          title: "SPECIFY VARIATIONS CHALLENGE",
                          value: specifyVarieties,
                          setter: setSpecifyVarieties,
                          hint: "Variation challenges will directly point to a random variation of a weapon."
                        }
                      ] as const
                    ).map(item => (
                      <button
                        key={item.title}
                        type="button"
                        className={`switch-row${item.value ? " active" : ""}`}
                        onClick={() => item.setter(prev => !prev)}
                      >
                        <span className="switch-row__check" />
                        <span className="switch-row__text">
                          <span className="switch-row__title">{item.title}</span>
                          <span className="switch-row__hint">{item.hint}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>{/* end settings-modal__body */}
          </div>
        </div>
      )}
    </div>
  );
}
