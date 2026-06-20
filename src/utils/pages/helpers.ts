export function createSelectionMap(keys: readonly (string | number)[], initialValue = true) {
    return Object.fromEntries(keys.map(key => [String(key), initialValue])) as Record<string, boolean>;
}

export function percentToFloat(value: number) {
    return value / 100;
}