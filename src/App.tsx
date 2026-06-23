import { useEffect, useRef, useState } from "react";

import type {
  EnrichedLevel
} from "@data/types";

import type {
  ChallengeRollConfig
} from "@utils/types";

import type {
  SettingsTab,
  BackgroundChoice
} from "@utils/pages/types";

import {
  ALL_LEVELS,
  LAYERS_ORDER,
} from "@data/locations";

import { DIFFICULTIES } from "@data/difficulties";

import {
  shuffle,
  shuffleChallenges
} from "@utils/functions";

import { BACKGROUNDS } from "@utils/pages/data";

import { createSelectionMap, percentToFloat } from "@utils/pages/helpers";

import { Hero } from '@components/panels/Hero';
import { Footer } from "@components/panels/Footer";
import { Controls } from "@components/Controls";
import { Settings } from "@components/panels/Settings";
import { Dashboard } from "@components/dashboard/Dashboard";

import "./App.css";

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
    () => createSelectionMap(LAYERS_ORDER),
  );
  const [selectedLevels, setSelectedLevels] = useState<Record<string, boolean>>(
    () => createSelectionMap(ALL_LEVELS.map(level => level.id)),
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<number, boolean>>(
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
      for (const layer of LAYERS_ORDER) next[String(layer)] = value;
      return next;
    });

  const setLayerSelection = (layer: number | "P", value: boolean) =>
    setSelectedLayers(prev => ({ ...prev, [String(layer)]: value }));

  // Level helpers
  const setAllLevels = (value: boolean) =>
    setSelectedLevels(prev => {
      const next = { ...prev };
      for (const level of ALL_LEVELS) next[level.id] = value;
      return next;
    });

  const toggleLevel = (levelId: string) =>
    setSelectedLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));

  const toggleDifficulty = (diffId: number) =>
    setSelectedDifficulties(prev => ({ ...prev, [diffId]: !prev[diffId] }));

  // Roll
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

  // Derived
  const background = BACKGROUNDS.find(item => item.id === selectedBackground) ?? BACKGROUNDS[0];
  const backgroundStyle =
    selectedBackground === "red"
      ? undefined
      : {
        backgroundImage: `linear-gradient(180deg, rgba(4,0,0,0.7), rgba(12,0,0,0.85)), url(${background?.image ?? ""})`,
      };

  const selectedLayerCount = LAYERS_ORDER.filter(l => selectedLayers[String(l)]).length;
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
          <Hero />
          {/* ── MAIN GRID ────────────────────────────────────────────────── */}
          <Dashboard
            propsParamsExec={{
              count,
              setCount,
              maxCount,
              includeDifficulties,
              selectedDifficulties,
              toggleDifficulty,
            }}
            propsParamsLevels={{
              includeNormal,
              setIncludeNormal,
              includeSecret,
              setIncludeSecret,
              includePrime,
              setIncludePrime,
              includeBoss,
              setIncludeBoss,
              includeEncores,
              setIncludeEncores,
              selectedLayerCount,
              selectedLevelCount,
              filteredLevelCount
            }}
            propsResults={{
              resultRef,
              rollCount,
              results,
              noPool,
              includeDifficulties
            }}
            propsRandomize={{
              handleRoll,
              nothingEnabled
            }}
            results={results}
            noPool={noPool}
          />
          <Footer />
        </div>
      </div>

      <Controls
        muted={muted}
        toggleMute={toggleMute}
        setSettingsOpen={setSettingsOpen}
      />

      {
        settingsOpen && <Settings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          propsFX={{
            background,
            selectedBackground,
            setSelectedBackground,
            muted,
            bgmVolume,
            setBgmVolume
          }}
          propsLevels={{
            selectedLayers,
            selectedLevels,
            setLayerSelection,
            toggleLevel,
            setAllLayers,
            setAllLevels
          }}
          propsChallenges={{
            includeBaseChallenges,
            setIncludeBaseChallenges,
            includeExtraChallenges,
            setIncludeExtraChallenges,
            includePRank,
            setIncludePRank,
            baseChance,
            setBaseChance,
            extraChance,
            setExtraChance,
            prankChance,
            setPrankChance,
            includeDifficulties,
            setIncludeDifficulties,
            includeWeaponsChallenges,
            setIncludeWeaponsChallenges,
            specifyWeapons,
            setSpecifyWeapons,
            specifyVarieties,
            setSpecifyVarieties
          }}
          setSettingsOpen={setSettingsOpen}
        />
      }
    </div >
  );
}
