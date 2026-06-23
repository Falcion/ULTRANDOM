import type { SettingsTabFXProps } from "@components/props";

import { BACKGROUNDS } from "@utils/pages/data";

export function SettingsTabFX({
    background,
    selectedBackground,
    setSelectedBackground,
    muted,
    bgmVolume,
    setBgmVolume
}: SettingsTabFXProps) {
    return (
        (
            <div className="control-stack">
                <div className="field-group">
                    <div className="field-label-row">
                        <span className="field-label">WALLPAPER</span>
                        <span className="field-value">{background?.label ?? "Red Field"}</span>
                    </div>
                    <div className="background-grid">
                        {BACKGROUNDS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                className={`background-card${selectedBackground === item.id ? " active" : ""}`}
                                onClick={() => setSelectedBackground(item.id)}
                            >
                                <span
                                    className="background-card__preview"
                                    style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                                >
                                    {item.image ? null : (
                                        <span className="background-card__preview-text">RED</span>
                                    )}
                                </span>
                                <span className="background-card__label">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="field-group">
                    <div className="field-label-row">
                        <span className="field-label">BGM VOLUME</span>
                        <span className="field-value">{muted ? "MUTED" : `${bgmVolume}%`}</span>
                    </div>
                    <input
                        className="range-input"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={bgmVolume}
                        disabled={muted}
                        onChange={e => setBgmVolume(Number(e.target.value))}
                    />
                    <div className="field-hint">
                        bgm.ogg starts after your first interaction at 50%. Use the mute button (bottom-left) for quick toggle.
                    </div>
                </div>
            </div>
        )
    )
}