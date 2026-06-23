import type { DashboardResultsProps } from "@components/props";

import { DashboardResultsCard } from "@dashboard/el/DashboardResultsCard";

export function DashboardResults({
    resultRef,
    noPool,
    rollCount,
    results,
    includeDifficulties
}: DashboardResultsProps) {
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
                                <DashboardResultsCard
                                    key={`${rollCount}-${level.id}-${index}`}
                                    level={level}
                                    includeDifficulties={includeDifficulties}
                                    rollCount={rollCount}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}