import type { SettingsTab } from "@utils/pages/types";
import { TabChallenges, type TabChallengesProps } from "./settings/tabs/TabChallenges";
import { TabFX, type TabFXProps } from "./settings/tabs/TabFX";
import { TabLevels, type TabLevelsProps } from "./settings/tabs/TabLevels";
import { SettingsTabEl } from "./settings/SettingsTab";

import './Settings.css'

export type SettingsProps = {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
    propsFX: TabFXProps;
    propsLevels: TabLevelsProps;
    propsChallenges: TabChallengesProps;
    setSettingsOpen: (value: React.SetStateAction<boolean>) => void;
}

export function Settings({
    activeTab,
    setActiveTab,
    propsFX,
    propsLevels,
    propsChallenges,
    setSettingsOpen
}: SettingsProps) {
    return (
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

                <SettingsTabEl activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tab content */}
                <div className="settings-modal__body">

                    {/* ── VISUAL / AUDIO tab ──────────────────────────────────── */}
                    {activeTab === "visual" && <TabFX {...propsFX} />}

                    {/* ── LEVEL POOL tab ──────────────────────────────────────── */}
                    {activeTab === "pool" && <TabLevels {...propsLevels} />}

                    {/* ── CHALLENGES tab ──────────────────────────────────────── */}
                    {activeTab === "challenges" && <TabChallenges {...propsChallenges} />}

                </div>{/* end settings-modal__body */}
            </div>
        </div>
    )
}