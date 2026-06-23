import type { RandomizeProps } from '@components/props'

import './Randomize.css'

export function Randomize({
    handleRoll,
    nothingEnabled
}: RandomizeProps) {
    return (
        <div className="action-row action-row--center">
            <button
                className="fire-btn"
                type="button"
                onClick={handleRoll}
                disabled={nothingEnabled}
            >
                RANDOMIZE
            </button>
        </div>
    )
}