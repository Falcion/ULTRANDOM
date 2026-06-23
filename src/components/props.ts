import type { EnrichedLevel } from "@data/types";

import type {
    Background,
    BackgroundChoice,
    SettingsTab
} from "@utils/pages/types";

import type { Dispatch, RefObject, SetStateAction } from "react";

//#region Dashboard props
export type DashboardParamsExecProps = {
    count: number;
    setCount: Dispatch<SetStateAction<number>>;
    maxCount: number;
    includeDifficulties: boolean;
    selectedDifficulties: Record<number, boolean>;
    toggleDifficulty: (difficultyId: number) => void;
}

export type DashboardParamsLevelsProps = {
    includeNormal: boolean;
    setIncludeNormal: Dispatch<SetStateAction<boolean>>;
    includeSecret: boolean;
    setIncludeSecret: Dispatch<SetStateAction<boolean>>;
    includePrime: boolean;
    setIncludePrime: Dispatch<SetStateAction<boolean>>;
    includeBoss: boolean;
    setIncludeBoss: Dispatch<SetStateAction<boolean>>;
    includeEncores: boolean;
    setIncludeEncores: Dispatch<SetStateAction<boolean>>;
    selectedLayerCount: number;
    selectedLevelCount: number;
    filteredLevelCount: number;
};

export type DashboardResultsProps = {
    resultRef: RefObject<HTMLDivElement | null>;
    noPool: boolean;
    rollCount: number;
    results: EnrichedLevel[];
    includeDifficulties: boolean;
};

export type DashboardResultsCardProps = {
    level: EnrichedLevel;
    includeDifficulties: boolean;
    rollCount: number;
    index: number;
};

export type DashboardProps = {
    propsParamsExec: DashboardParamsExecProps;
    propsParamsLevels: DashboardParamsLevelsProps;
    propsResults: DashboardResultsProps;
    propsRandomize: RandomizeProps;
    results: EnrichedLevel[];
    noPool: boolean;
};
//#endregion

export type RandomizeProps = {
    handleRoll: () => void;
    nothingEnabled: boolean;
}

//#region Settings props
export type SettingsTabChallengesProps = {
    includeBaseChallenges: boolean;
    setIncludeBaseChallenges: Dispatch<SetStateAction<boolean>>;
    includeExtraChallenges: boolean;
    setIncludeExtraChallenges: Dispatch<SetStateAction<boolean>>;
    includePRank: boolean;
    setIncludePRank: Dispatch<SetStateAction<boolean>>;
    baseChance: number;
    setBaseChance: Dispatch<SetStateAction<number>>;
    extraChance: number;
    setExtraChance: Dispatch<SetStateAction<number>>;
    prankChance: number;
    setPrankChance: Dispatch<SetStateAction<number>>;
    includeDifficulties: boolean;
    setIncludeDifficulties: Dispatch<SetStateAction<boolean>>;
    includeWeaponsChallenges: boolean;
    setIncludeWeaponsChallenges: Dispatch<SetStateAction<boolean>>;
    specifyWeapons: boolean;
    setSpecifyWeapons: Dispatch<SetStateAction<boolean>>;
    specifyVarieties: boolean;
    setSpecifyVarieties: Dispatch<SetStateAction<boolean>>;
};

export type SettingsTabFXProps = {
    background: Background;
    selectedBackground: BackgroundChoice;
    setSelectedBackground: Dispatch<SetStateAction<BackgroundChoice>>;
    muted: boolean;
    bgmVolume: number;
    setBgmVolume: Dispatch<SetStateAction<number>>;
}

export type SettingsTabLevelsProps = {
    setAllLayers: (value: boolean) => void;
    selectedLayers: Record<string, boolean>;
    setLayerSelection: (layer: number | "P", value: boolean) => void;
    setAllLevels: (value: boolean) => void;
    selectedLevels: Record<string, boolean>;
    toggleLevel: (levelId: string) => void;
}

export type SettingsTabElProps = {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

export type SettingsProps = {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
    propsFX: SettingsTabFXProps;
    propsLevels: SettingsTabLevelsProps;
    propsChallenges: SettingsTabChallengesProps;
    setSettingsOpen: (value: React.SetStateAction<boolean>) => void;
}
//#endregion

export type ControlsProps = {
    muted: boolean;
    toggleMute: () => void;
    setSettingsOpen: (value: React.SetStateAction<boolean>) => void;
}
