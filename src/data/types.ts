export type LAYER = {
    name: string;
    color: string;
    act: LAYER_ACT;
}

export type LAYER_ACT =
    | "PRELUDE"
    | "ACT I: INFINITE HYPERDEATH"
    | "ACT II: IMPERFECT HATRED"
    | "ACT III: GODFIST SUICIDE"
    | "PRIME SANCTUMS";

export type LEVEL = {
    id: string;
    name: string;
    type: LEVEL_TYPE;
    layer: number | "P";
    challenges?: CHALLENGE[];
};

export type LEVEL_TYPE =
    | "NORMAL"
    | "SECRET"
    | "PRIME"
    | "BOSS";


export type CHALLENGE = {
    task: string;
    type: CHALLENGE_TYPE;
}

export type CHALLENGE_TYPE =
    | "IN-GAME"
    | "TIMER"
    | "STYLE"
    | "ENVIRONMENTAL"
    | "SKILL"
    | "DIFFICULTY";

export type CHALLENGE_DATA = {
    challenges: CHALLENGE[];
    perfect_ranking: boolean;
}