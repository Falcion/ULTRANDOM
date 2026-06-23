import type { ControlsProps } from "@components/props";

import {
    IconMute,
    IconSettings
} from "@components/svg/Icons";

import './Controls.css'

export function Controls({
    muted,
    toggleMute,
    setSettingsOpen
}: ControlsProps) {
    return (
        <div className="corner-controls">
            {/* Quick mute toggle */}
            <button
                type="button"
                className={`corner-btn mute-btn${muted ? " mute-btn--muted" : ""}`}
                onClick={toggleMute}
                title={muted ? "Unmute audio" : "Mute audio"}
                aria-label={muted ? "Unmute audio" : "Mute audio"}
            >
                <IconMute muted={muted} />
            </button>

            {/* Settings button */}
            <button
                type="button"
                className="corner-btn settings-btn"
                onClick={() => setSettingsOpen(true)}
                title="Open settings"
                aria-label="Open settings"
            >
                <IconSettings />
                <span>SETTINGS</span>
            </button>
        </div>
    )
}