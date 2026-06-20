import { ALL_LEVELS, LAYERS, LAYERS_ORDER, LEVELS_BY_LAYER } from "@data/locations";

export type TabLevelsProps = {
    setAllLayers: (value: boolean) => void;
    selectedLayers: Record<string, boolean>;
    setLayerSelection: (layer: number | "P", value: boolean) => void;
    setAllLevels: (value: boolean) => void;
    selectedLevels: Record<string, boolean>;
    toggleLevel: (levelId: string) => void;
}

export function TabLevels({
    setAllLayers,
    selectedLayers,
    setLayerSelection,
    setAllLevels,
    selectedLevels,
    toggleLevel
}: TabLevelsProps) {
    return (
        <div className="control-stack">
            {/* Layers */}
            <div className="field-group">
                <div className="field-label-row">
                    <span className="field-label">POOL LAYERS</span>
                </div>
                <div className="action-row">
                    <button type="button" className="mini-action" onClick={() => setAllLayers(true)}>Select all</button>
                    <button type="button" className="mini-action" onClick={() => setAllLayers(false)}>Clear all</button>
                </div>
                <div className="layer-grid">
                    {LAYERS_ORDER.map(layer => {
                        const layerData = LAYERS[layer];
                        const active = selectedLayers[String(layer)];
                        const levelCount = ALL_LEVELS.filter(l => l.layer === layer).length;

                        return (
                            <button
                                key={String(layer)}
                                type="button"
                                className={`layer-card${active ? " active" : ""}`}
                                onClick={() => setLayerSelection(layer, !active)}
                            >
                                <span className="layer-card__swatch" style={{ background: layerData.color }} />
                                <span className="layer-card__meta">
                                    <span className="layer-card__name">LAYER {layer} — {layerData.name}</span>
                                    <span className="layer-card__count">{levelCount} levels</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Individual levels */}
            <div className="field-group">
                <div className="field-label-row">
                    <span className="field-label">POOL LEVELS</span>
                </div>
                <div className="action-row">
                    <button type="button" className="mini-action" onClick={() => setAllLevels(true)}>Select all</button>
                    <button type="button" className="mini-action" onClick={() => setAllLevels(false)}>Clear all</button>
                </div>
                <div className="level-groups">
                    {LEVELS_BY_LAYER.map(group => {
                        const groupKey = String(group.layer);
                        const groupActive = selectedLayers[groupKey];

                        return (
                            <section
                                key={groupKey}
                                className={`layer-group${groupActive ? "" : " inactive"}`}
                            >
                                <div className="layer-group__header">
                                    <div className="layer-group__title">
                                        LAYER {group.layer} — {LAYERS[group.layer].name}
                                    </div>
                                    <div className="layer-group__meta">{group.levels.length} mapped levels</div>
                                </div>
                                <div className="level-chip-grid">
                                    {group.levels.map(level => {
                                        const active = selectedLevels[level.id];
                                        return (
                                            <button
                                                key={level.id}
                                                type="button"
                                                className={`level-chip${active ? " active" : ""}`}
                                                onClick={() => toggleLevel(level.id)}
                                            >
                                                <span className="level-chip__id">{level.id}</span>
                                                <span className="level-chip__name">{level.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}