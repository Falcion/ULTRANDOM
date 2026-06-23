import type { SettingsTabChallengesProps } from "@components/props";

export function SettingsTabChallenges({
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
}: SettingsTabChallengesProps) {
    return (
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
    )
}