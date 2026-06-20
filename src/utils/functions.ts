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
    KILLCOUNT_MIN,
    KILLCOUNT_MAX,
} from "@const/variables";

import {
    WEAPONS,
    WEAPONS_VARIETIES
} from "@data/weapons";

import type { ChallengeRollConfig } from "@utils/types";

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function shuffleSelect<T>(arr: T[]): T | undefined {
    return shuffle(arr).at(0);
}

export function rngNum(min = 0, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function format(str: string, ...values: any) {
    return str.replace(/{(\d+)}/g, function (match, index) {
        return typeof values[index] !== 'undefined' ? values[index] : match;
    });
}

export function shuffleChallenges(level: LEVEL, options: ChallengeRollConfig): CHALLENGE_DATA {
    const {
        includeBaseChallenges = true,
        includeExtraChallenges = true,
        includePRank = true,
        baseChance = CHANCE_OF_CHALLENGE,
        extraChance = CHANCE_OF_EXTRA_CHALLENGE,
        prankChance = CHANCE_OF_PRANK_CHALLENGE,
        includeWeaponsChallenges = true,
        specifyWeapons = false,
        specifyVarieties = false
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

            if (Math.random() < extraChance) {
                if (challenge.type === "RANDOMIZED" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, specifyWeapons ? shuffleSelect(WEAPONS) : 'any specific weapon'),
                        type: challenge.type
                    });
                else if (challenge.type === "RANDOMIZED-VARIETY" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, specifyVarieties ? shuffleSelect(WEAPONS_VARIETIES) : 'any specific'),
                        type: challenge.type
                    });
                else if (challenge.type === "RANDOMIZED-KILLCOUNT" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, rngNum(KILLCOUNT_MIN, KILLCOUNT_MAX),
                            challenge.task.includes('variety')
                                ? (specifyVarieties ? shuffleSelect(WEAPONS_VARIETIES) : 'any specific')
                                : (specifyWeapons ? shuffleSelect(WEAPONS) : 'any specific weapon')),
                        type: challenge.type
                    });
                else
                    EXTRA_CHALLENGES.push(challenge);
            }
        }

        if (EXTRA_CHALLENGES.length < AMOUNT_OF_EXTRA_CHALLENGES_MIN) {
            for (const challenge of shuffled) {
                if (EXTRA_CHALLENGES.length >= AMOUNT_OF_EXTRA_CHALLENGES_MIN) break;
                if (EXTRA_CHALLENGES.includes(challenge)) continue;
                if (challenge.type === "RANDOMIZED" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, specifyWeapons ? shuffleSelect(WEAPONS) : 'any specific weapon'),
                        type: challenge.type
                    });
                else if (challenge.type === "RANDOMIZED-VARIETY" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, specifyVarieties ? shuffleSelect(WEAPONS_VARIETIES) : 'any specific'),
                        type: challenge.type
                    });
                else if (challenge.type === "RANDOMIZED-KILLCOUNT" && includeWeaponsChallenges)
                    EXTRA_CHALLENGES.push({
                        task: format(challenge.task, rngNum(KILLCOUNT_MIN, KILLCOUNT_MAX),
                            challenge.task.includes('variety')
                                ? (specifyVarieties ? shuffleSelect(WEAPONS_VARIETIES) : 'any specific')
                                : (specifyWeapons ? shuffleSelect(WEAPONS) : 'any specific weapon')),
                        type: challenge.type
                    });
                else
                    EXTRA_CHALLENGES.push(challenge);
            }
        }
    }

    const PERFECT_RANKING_CHANCE = includePRank ? Math.random() < prankChance : false;

    return { challenges: [...BASIC_CHALLENGES, ...EXTRA_CHALLENGES], perfect_ranking: PERFECT_RANKING_CHANCE };
}