import './Randomize.css'

export type RandomizeProps = {
    handleRoll: () => void;
    nothingEnabled: boolean;
}

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