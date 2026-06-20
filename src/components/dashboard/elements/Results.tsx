import { LAYERS } from "@data/locations";
import type { EnrichedLevel } from "@data/types";
import { LEVEL_TYPE_META } from "@utils/pages/data";
import type { RefObject } from "react";

export type ResultsProps = {
    resultRef: RefObject<HTMLDivElement | null>;
    noPool: boolean;
    rollCount: number;
    results: EnrichedLevel[];
    includeDifficulties: boolean;
};

export function Results({
    resultRef,
    noPool,
    rollCount,
    results,
    includeDifficulties
}: ResultsProps) {
    return (
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
    )
}