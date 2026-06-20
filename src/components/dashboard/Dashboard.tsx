import { ParamsExec, type ParamsExecProps } from "./elements/ParamsExec";
import { ParamsLevels, type ParamsLevelsProps } from "./elements/ParamsLevels";
import { Results, type ResultsProps } from "./elements/Results";
import { Randomize, type RandomizeProps } from "@components/controls/Randomize";

import type {
    EnrichedLevel
} from "@data/types";

import './Dashboard.css'

export type DashboardProps = {
    propsParamsExec: ParamsExecProps;
    propsParamsLevels: ParamsLevelsProps;
    propsResults: ResultsProps;
    propsRandomize: RandomizeProps;
    results: EnrichedLevel[];
    noPool: boolean;
};

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
            <ParamsLevels {...propsParamsLevels} />
            <ParamsExec {...propsParamsExec} />

            <Randomize {...propsRandomize} />

            {/* Results */}
            {(results.length > 0 || noPool) && <Results {...propsResults} />}
        </main>
    )
}