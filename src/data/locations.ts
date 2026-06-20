import type {
    LAYER,
    LAYER_ACT,
    LEVEL
} from "@data/types";

export const LAYERS_ACTS: Record<number | "P", LAYER_ACT> = {
    0: "PRELUDE",
    1: "ACT I: INFINITE HYPERDEATH",
    2: "ACT I: INFINITE HYPERDEATH",
    3: "ACT I: INFINITE HYPERDEATH",
    4: "ACT II: IMPERFECT HATRED",
    5: "ACT II: IMPERFECT HATRED",
    6: "ACT II: IMPERFECT HATRED",
    7: "ACT III: GODFIST SUICIDE",
    8: "ACT III: GODFIST SUICIDE",
    P: "PRIME SANCTUMS",
};

export const LAYERS: Record<number | "P", LAYER> = {
    // OVERTURE: THE MOUTH OF HELL
    0: { name: "PRELUDE", color: "#aaaaaa", act: LAYERS_ACTS[0] },
    // ACT I: INFINITE HYPERDEATH
    1: { name: "LIMBO", color: "#88aaff", act: LAYERS_ACTS[1] },
    2: { name: "LUST", color: "#ff88aa", act: LAYERS_ACTS[2] },
    3: { name: "GLUTTONY", color: "#88cc88", act: LAYERS_ACTS[3] },
    // ACT II: IMPERFECT HATRED
    4: { name: "GREED", color: "#ffcc44", act: LAYERS_ACTS[4] },
    5: { name: "WRATH", color: "#ff6600", act: LAYERS_ACTS[5] },
    6: { name: "HERESY", color: "#cc44cc", act: LAYERS_ACTS[6] },
    // ACT III: GODFIST SUICIDE
    7: { name: "VIOLENCE", color: "#44aaff", act: LAYERS_ACTS[7] },
    8: { name: "FRAUD", color: "#ff4444", act: LAYERS_ACTS[8] },
    // PRIMES
    P: { name: "PRIME", color: "#ffd700", act: LAYERS_ACTS["P"] },
};

export const LAYERS_ORDER: Array<number | "P"> = [0, 1, 2, 3, 4, 5, 6, 7, 8, "P"];

export const LEVELS: Record<string, LEVEL> = {
    // PRELUDE
    "0-1": { id: "0-1", name: "INTO THE FIRE", layer: 0, type: "NORMAL", challenges: [{ "task": "Get 5 kills with a single glass panel", "type": "IN-GAME" }] },
    "0-2": { id: "0-2", name: "THE MEATGRINDER", layer: 0, type: "NORMAL", challenges: [{ "task": "Beat the secret encounter", "type": "IN-GAME" }] },
    "0-3": { id: "0-3", name: "DOUBLE DOWN", layer: 0, type: "NORMAL", challenges: [{ "task": "Kill only 1 enemy", "type": "IN-GAME" }] },
    "0-4": { id: "0-4", name: "A ONE-MACHINE ARMY", layer: 0, type: "NORMAL", challenges: [{ "task": "Slide uninterrupted for 17 seconds", "type": "IN-GAME" }] },
    "0-5": { id: "0-5", name: "CERBERUS", layer: 0, type: "BOSS", challenges: [{ "task": "Don't inflict fatal damage to any enemy", "type": "IN-GAME" }] },
    "0-S": { id: "0-S", name: "SOMETHING WICKED", layer: 0, type: "SECRET", challenges: [{ "task": "Not shitting yourself", "type": "IN-GAME" }] },
    "0-E": { id: "0-E", name: "THIS HEAT, AN EVIL HEAT", layer: 0, type: "ENCORES", challenges: [] },
    // LIMBO    
    "1-1": { id: "1-1", name: "HEART OF THE SUNRISE", layer: 1, type: "NORMAL", challenges: [{ "task": "Complete the level in under 10 seconds", "type": "IN-GAME" }] },
    "1-2": { id: "1-2", name: "THE BURNING WORLD", layer: 1, type: "NORMAL", challenges: [{ "task": "Do not pick up any skulls", "type": "IN-GAME" }] },
    "1-3": { id: "1-3", name: "HALLS OF SACRED REMAINS", layer: 1, type: "NORMAL", challenges: [{ "task": "Beat the secret encounter", "type": "IN-GAME" }] }, "1-4": { id: "1-4", name: "CLAIR DE LUNE", layer: 1, type: "BOSS", challenges: [{ "task": "Do not pick up any skulls", "type": "IN-GAME" }] },
    "1-S": { id: "1-S", name: "THE WITLESS", layer: 1, type: "SECRET", challenges: [{ "task": "DON'T LOOK UP THE ANSWERS", "type": "IN-GAME" }] },
    "1-E": { id: "1-E", name: "...THEN FELL THE ASHES", layer: 1, type: "ENCORES", challenges: [] },
    // LUST
    "2-1": { id: "2-1", name: "BRIDGEBURNER", layer: 2, type: "NORMAL", challenges: [{ "task": "Don't open any normal doors", "type": "IN-GAME" }] },
    "2-2": { id: "2-2", name: "DEATH AT 20,000 VOLTS", layer: 2, type: "NORMAL", challenges: [{ "task": "Beat the level in under 60 seconds", "type": "IN-GAME" }] },
    "2-3": { id: "2-3", name: "SHEER HEART ATTACK", layer: 2, type: "NORMAL", challenges: [{ "task": "Don't touch any water", "type": "IN-GAME" }] },
    "2-4": { id: "2-4", name: "COURT OF THE CORPSE KING", layer: 2, type: "BOSS", challenges: [{ "task": "Parry a punch", "type": "IN-GAME" }] },
    "2-S": { id: "2-S", name: "ALL-IMPERFECT LOVE SONG", layer: 2, type: "SECRET", challenges: [{ "task": "Successfully date her", "type": "IN-GAME" }] },
    // GLUTTONY
    "3-1": { id: "3-1", name: "BELLY OF THE BEAST", layer: 3, type: "NORMAL", challenges: [{ "task": "Kill a Mindflayer with acid", "type": "IN-GAME" }] },
    "3-2": { id: "3-2", name: "IN THE FLESH", layer: 3, type: "BOSS", challenges: [{ "task": "Drop Gabriel in a pit", "type": "IN-GAME" }] },
    // GREED
    "4-1": { id: "4-1", name: "SLAVES TO POWER", layer: 4, type: "NORMAL", challenges: [{ "task": "Don't activate any enemies", "type": "IN-GAME" }] },
    "4-2": { id: "4-2", name: "GOD DAMN THE SUN", layer: 4, type: "NORMAL", challenges: [{ "task": "Kill the Insurrectionist in under 10 seconds", "type": "IN-GAME" }] },
    "4-3": { id: "4-3", name: "A SHOT IN THE DARK", layer: 4, type: "NORMAL", challenges: [{ "task": "Don't pick up the torch", "type": "IN-GAME" }] },
    "4-4": { id: "4-4", name: "CLAIR DE SOLEIL", layer: 4, type: "BOSS", challenges: [{ "task": "Reach the boss gate in under 18 seconds", "type": "IN-GAME" }] },
    "4-S": { id: "4-S", name: "CLASH OF THE BRANDICOOT", layer: 4, type: "SECRET", challenges: [{ "task": "Break all 78 crates", "type": "IN-GAME" }] },
    // WRATH
    "5-1": { id: "5-1", name: "IN THE WAKE OF POSEIDON", layer: 5, type: "NORMAL", challenges: [{ "task": "Don't touch any water", "type": "IN-GAME" }] },
    "5-2": { id: "5-2", name: "WAVES OF THE STARLESS SEA", layer: 5, type: "NORMAL", challenges: [{ "task": "Don't fight the Ferryman", "type": "IN-GAME" }] },
    "5-3": { id: "5-3", name: "SHIP OF FOOLS", layer: 5, type: "NORMAL", challenges: [{ "task": "Don't touch any water", "type": "IN-GAME" }] },
    "5-4": { id: "5-4", name: "LEVIATHAN", layer: 5, type: "BOSS", challenges: [{ "task": "Reach the surface in under 10 seconds", "type": "IN-GAME" }] },
    "5-S": { id: "5-S", name: "I ONLY SAY MORNING", layer: 5, type: "SECRET", challenges: [{ "task": "Find THE SIZE", "type": "IN-GAME" }] },
    // HERESY
    "6-1": { id: "6-1", name: "CRY FOR THE WEEPER", layer: 6, type: "NORMAL", challenges: [{ "task": "Beat the secret encounter", "type": "IN-GAME" }] },
    "6-2": { id: "6-2", name: "AESTHETICS OF HATE", layer: 6, type: "BOSS", challenges: [{ "task": "Hit Gabriel into the ceiling", "type": "IN-GAME" }] },
    // VIOLENCE
    "7-1": { id: "7-1", name: "GARDEN OF FORKING PATHS", layer: 7, type: "NORMAL", challenges: [{ "task": "Beat the secret encounter", "type": "IN-GAME" }] },
    "7-2": { id: "7-2", name: "LIGHT UP THE NIGHT", layer: 7, type: "NORMAL", challenges: [{ "task": "Don't kill any enemies", "type": "IN-GAME" }] },
    "7-3": { id: "7-3", name: "NO SOUND, NO MEMORY", layer: 7, type: "NORMAL", challenges: [{ "task": "Become marked for death", "type": "IN-GAME" }] },
    "7-4": { id: "7-4", name: "...LIKE ANTENNAS TO HEAVEN", layer: 7, type: "BOSS", challenges: [{ "task": "Don't fight the security system", "type": "IN-GAME" }] },
    "7-S": { id: "7-S", name: "HELL BATH NO FURY", layer: 7, type: "SECRET", challenges: [{ "task": "Don't use the dishwasher", "type": "IN-GAME" }] },
    // FRAUD
    "8-1": { id: "8-1", name: "HURTBREAK WONDERLAND", layer: 8, type: "NORMAL", challenges: [{ "task": "Parry a Providence", "type": "IN-GAME" }] },
    "8-2": { id: "8-2", name: "THROUGH THE MIRROR", layer: 8, type: "NORMAL", challenges: [{ "task": "Finish the level upside down", "type": "IN-GAME" }] },
    "8-3": { id: "8-3", name: "DISINTEGRATION LOOP", layer: 8, type: "NORMAL", challenges: [{ "task": "Kill a Power with terminal velocity", "type": "IN-GAME" }] },
    "8-4": { id: "8-4", name: "FINAL FLIGHT", layer: 8, type: "BOSS", challenges: [{ "task": "Do not pick up any skulls", "type": "IN-GAME" }] },
    // PRIME SANCTUMS
    "P-1": { id: "P-1", name: "SOUL SURVIVOR", layer: "P", type: "PRIME", challenges: undefined },
    "P-2": { id: "P-2", name: "WAIT OF THE WORLD", layer: "P", type: "PRIME", challenges: undefined },
};

export const ALL_LEVELS = Object.values(LEVELS);
export const LEVELS_BY_LAYER = LAYERS_ORDER.map(layer => ({
    layer,
    levels: ALL_LEVELS.filter(level => level.layer === layer),
}));