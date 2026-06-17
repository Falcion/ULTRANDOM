import type { CHALLENGE } from "@data/types";

export const CHALLENGES_EXTRA: Array<CHALLENGE> = [
    // Time challenges
    { task: "Complete in under 2:30", type: "TIMER" },
    { task: "Complete in under 4:30", type: "TIMER" },
    { task: "Complete in under 5:00", type: "TIMER" },
    { task: "Complete in under 6:00", type: "TIMER" },

    // Kill/style rank challenges
    { task: "Kill all enemies in the level", type: "STYLE" },
    { task: "Defeat boss without taking damage", type: "STYLE" },

    // Environmental challenges
    { task: "Don't touch any water", type: "ENVIRONMENTAL" },
    { task: "Don't pick up any skulls", type: "ENVIRONMENTAL" },
    { task: "Don't open any normal doors", type: "ENVIRONMENTAL" },
    { task: "Don't fall off the level", type: "ENVIRONMENTAL" },
    { task: "Don't activate any enemies", type: "ENVIRONMENTAL" },

    // Combat challenges
    { task: "Parry an attack", type: "SKILL" },
    { task: "Parry 5 attacks", type: "SKILL" },
    { task: "Parry 10 attacks", type: "SKILL" },
    { task: "Kill 5 enemies with a single weapon", type: "SKILL" },
    { task: "Kill an enemy with a specific weapon", type: "SKILL" },

    // Secret challenges
    { task: "Find the secret encounter", type: "IN-GAME" },
    { task: "Beat the secret encounter", type: "IN-GAME" },
    { task: "Find all secret areas", type: "IN-GAME" },
    { task: "Reach the secret exit", type: "IN-GAME" },

    // Difficulty modifiers
    { task: "Complete on ULTRAKILL difficulty", type: "DIFFICULTY" },
    { task: "P-rank the level (All requirements)", type: "DIFFICULTY" },
    { task: "No checkpoint deaths", type: "DIFFICULTY" },
    { task: "No damage taken in phase", type: "DIFFICULTY" },
    { task: "Iron Fist: only parry, no blocking", type: "DIFFICULTY" },
    { task: "Only use melee weapons", type: "DIFFICULTY" },
    { task: "Only use ranged weapons", type: "DIFFICULTY" },
    { task: "Only use one weapon", type: "DIFFICULTY" },
    { task: "Only use one variety of weapons", type: "DIFFICULTY" },
    { task: "Complete with pistol only", type: "DIFFICULTY" },
    { task: "Complete without using a specific weapon", type: "DIFFICULTY" },
];

export default CHALLENGES_EXTRA;