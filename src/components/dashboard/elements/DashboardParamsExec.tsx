import { DIFFICULTIES } from "@data/difficulties";

import type { DashboardParamsExecProps } from "@components/props";

export function DashboardParamsExec({
    count,
    setCount,
    maxCount,
    includeDifficulties,
    selectedDifficulties,
    toggleDifficulty
}: DashboardParamsExecProps) {
    return (
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
        </section >
    )
}