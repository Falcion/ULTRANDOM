import { DashboardParamsExec } from "@dashboard/el/DashboardParamsExec";
import { DashboardParamsLevels } from "@dashboard/el/DashboardParamsLevels";
import { DashboardResults } from "@dashboard/el/DashboardResults";
import { Randomize } from "@components/controls/Randomize";

import type { DashboardProps } from "@components/props";

import './Dashboard.css'

export function Dashboard({
    propsParamsExec,
    propsParamsLevels,
    propsResults,
    propsRandomize,
    results,
    noPool
}: DashboardProps) {
    return (
        <main className="dashboard-grid">
            <DashboardParamsLevels {...propsParamsLevels} />
            <DashboardParamsExec {...propsParamsExec} />

            <Randomize {...propsRandomize} />

            {/* Results */}
            {(results.length > 0 || noPool) && <DashboardResults {...propsResults} />}
        </main>
    )
}