export type SettingsTab =
    | "visual"
    | "pool"
    | "challenges";

export type BackgroundChoice =
    | "red"
    | "storm"
    | "rust"
    | "ash"
    | "catacombs";

export type Background = {
    id: BackgroundChoice;
    label: string;
    image?: string
}