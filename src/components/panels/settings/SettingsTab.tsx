import type {
    SettingsTab
} from "@utils/pages/types";

export type SettingsTabElProps = {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

export function SettingsTabEl({
    activeTab,
    setActiveTab
}: SettingsTabElProps) {
    return (
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
    )
}