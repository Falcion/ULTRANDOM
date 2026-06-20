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

    // Secret challenges
    { task: "Find the secret encounter", type: "IN-GAME" },
    { task: "Beat the secret encounter", type: "IN-GAME" },
    { task: "Find all secret areas", type: "IN-GAME" },
    { task: "Reach the secret exit", type: "IN-GAME" },

    // Difficulty modifiers
    { task: "No checkpoint deaths", type: "DIFFICULTY" },
    { task: "No damage taken", type: "DIFFICULTY" },
    { task: "No damage taken in phase", type: "DIFFICULTY" },

    { task: "MELEE-ONLY", type: "DIFFICULTY" },
    { task: "NO-MELEE", type: "DIFFICULTY" },

    // Randomized modifiers
    { task: "Kill {0} enemies with {1}", type: "RANDOMIZED-KILLCOUNT" },
    { task: "Kill {0} enemies with {1} weapon variety", type: "RANDOMIZED-KILLCOUNT" },
    { task: "Kill an enemy with {0}", type: "RANDOMIZED" },
    { task: "Complete with {0} only", type: "RANDOMIZED" },
    { task: "Complete without using {0}", type: "RANDOMIZED" },
    { task: "Complete using {0} weapon variety only", type: "RANDOMIZED-VARIETY" },
    { task: "Complete without using {0} weapon variety", type: "RANDOMIZED-VARIETY" }
];

export default CHALLENGES_EXTRA;