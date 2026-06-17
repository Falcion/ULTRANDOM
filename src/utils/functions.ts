import CHALLENGES_EXTRA from "@data/challenges";

import type {
    CHALLENGE,
    CHALLENGE_DATA,
    LEVEL
} from "@data/types";

import {
    AMOUNT_OF_EXTRA_CHALLENGES_MAX,
    AMOUNT_OF_EXTRA_CHALLENGES_MIN,
    CHANCE_OF_EXTRA_CHALLENGE,
    CHANCE_OF_PRANK_CHALLENGE,
    CHANCE_OF_CHALLENGE,
} from "@const/variables";

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function shuffleChallenges(level: LEVEL, base = true, extra = true): CHALLENGE_DATA {
    const BASIC_CHALLENGES: CHALLENGE[] = [];
    const EXTRA_CHALLENGES: CHALLENGE[] = [];

    if (base && level.challenges) {
        for (const challenge of level.challenges) {
            if (Math.random() < CHANCE_OF_CHALLENGE)
                BASIC_CHALLENGES.push(challenge);
        }
    }

    if (extra) {
        const shuffled = shuffle<CHALLENGE>(CHALLENGES_EXTRA);

        while (EXTRA_CHALLENGES.length < AMOUNT_OF_EXTRA_CHALLENGES_MIN) {
            for (const challenge of shuffled) {
                if (EXTRA_CHALLENGES.length >= AMOUNT_OF_EXTRA_CHALLENGES_MAX) break;

                if (Math.random() < CHANCE_OF_EXTRA_CHALLENGE)
                    EXTRA_CHALLENGES.push(challenge);
            }
        }
    }

    const PERFECT_RANKING_CHANCE = Math.random() < CHANCE_OF_PRANK_CHALLENGE;

    return { challenges: [...BASIC_CHALLENGES, ...EXTRA_CHALLENGES], perfect_ranking: PERFECT_RANKING_CHANCE };
}