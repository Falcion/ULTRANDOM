import type { SettingsProps } from "@components/props";

import { SettingsTabChallenges } from "@settings/tabs/SettingsTabChallenges";
import { SettingsTabFX } from "@settings/tabs/SettingsTabFX";
import { SettingsTabLevels } from "@settings/tabs/SettingsTabLevels";
import { SettingsTabEl } from "@settings/SettingsTabs";

import './Settings.css'
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
                    {activeTab === "visual" && <SettingsTabFX {...propsFX} />}

                    {/* ── LEVEL POOL tab ──────────────────────────────────────── */}
                    {activeTab === "pool" && <SettingsTabLevels {...propsLevels} />}

                    {/* ── CHALLENGES tab ──────────────────────────────────────── */}
                    {activeTab === "challenges" && <SettingsTabChallenges {...propsChallenges} />}

                </div>{/* end settings-modal__body */}
            </div>
        </div>
    )
}