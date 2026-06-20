import type {
    LEVEL_TYPE,
    LEVEL_TYPEDATA
} from "@data/types";

import type { BackgroundChoice } from "@utils/pages/types";

export const LEVEL_TYPE_META: Record<LEVEL_TYPE, LEVEL_TYPEDATA> = {
    NORMAL: {
        label: "NORMAL",
        image: "/media/images/normal.png",
        accent: "normal",
    },
    SECRET: {
        label: "SECRET",
        image: "/media/images/secret.svg",
        accent: "secret",
    },
    PRIME: {
        label: "PRIME SANCTUMS",
        image: "/media/images/prime.png",
        accent: "prime",
    },
    BOSS: {
        label: "BOSS",
        image: "/media/images/boss.png",
        accent: "boss",
    },
    ENCORES: {
        label: "ENCORES",
        image: "/media/images/encore.png",
        accent: "encores"
    }
};

export const BACKGROUNDS: Array<{ id: BackgroundChoice; label: string; image?: string }> = [
    { id: "red", label: "Red Field" },
    { id: "storm", label: "Storm Wall", image: "/background/1350597.jpeg" },
    { id: "rust", label: "Rust Veil", image: "/background/1347555.jpeg" },
    { id: "ash", label: "Ash Grid", image: "/background/1270683.png" },
    { id: "catacombs", label: "Catacombs", image: "/background/1168975.png" },
];