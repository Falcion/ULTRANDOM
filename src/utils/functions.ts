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

type ChallengeRollOptions = {
    includeBaseChallenges?: boolean;
    includeExtraChallenges?: boolean;
    includePRank?: boolean;
    baseChance?: number;
    extraChance?: number;
    prankChance?: number;
};

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function shuffleChallenges(level: LEVEL, options: ChallengeRollOptions = {}): CHALLENGE_DATA {
    const {
        includeBaseChallenges = true,
        includeExtraChallenges = true,
        includePRank = true,
        baseChance = CHANCE_OF_CHALLENGE,
        extraChance = CHANCE_OF_EXTRA_CHALLENGE,
        prankChance = CHANCE_OF_PRANK_CHALLENGE,
    } = options;

    const BASIC_CHALLENGES: CHALLENGE[] = [];
    const EXTRA_CHALLENGES: CHALLENGE[] = [];

    if (includeBaseChallenges && level.challenges) {
        for (const challenge of level.challenges) {
            if (Math.random() < baseChance)
                BASIC_CHALLENGES.push(challenge);
        }
    }

    if (includeExtraChallenges) {
        const shuffled = shuffle<CHALLENGE>(CHALLENGES_EXTRA);

        for (const challenge of shuffled) {
            if (EXTRA_CHALLENGES.length >= AMOUNT_OF_EXTRA_CHALLENGES_MAX) break;

            if (Math.random() < extraChance)
                EXTRA_CHALLENGES.push(challenge);
        }

        if (EXTRA_CHALLENGES.length < AMOUNT_OF_EXTRA_CHALLENGES_MIN) {
            for (const challenge of shuffled) {
                if (EXTRA_CHALLENGES.length >= AMOUNT_OF_EXTRA_CHALLENGES_MIN) break;
                if (EXTRA_CHALLENGES.includes(challenge)) continue;
                EXTRA_CHALLENGES.push(challenge);
            }
        }
    }

    const PERFECT_RANKING_CHANCE = includePRank ? Math.random() < prankChance : false;

    return { challenges: [...BASIC_CHALLENGES, ...EXTRA_CHALLENGES], perfect_ranking: PERFECT_RANKING_CHANCE };
}