import type { DashboardResultsCardProps } from "@components/props";

import { LAYERS } from "@data/locations";
import { LEVEL_TYPE_META } from "@utils/pages/data";

export function DashboardResultsCard({
    level,
    includeDifficulties,
    rollCount,
    index
}: DashboardResultsCardProps) {
    return (
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

    )
}