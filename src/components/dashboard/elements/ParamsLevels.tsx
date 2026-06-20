import type { LEVEL_TYPE } from "@data/types";
import { LEVEL_TYPE_META } from "@utils/pages/data";
import type { Dispatch, SetStateAction } from "react";

export type ParamsLevelsProps = {
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

export function ParamsLevels({
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
}: ParamsLevelsProps) {
    return (
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
    )
}