import type { EmberState } from "./types";

export interface AvatarStage {
  index: number;
  name: string;
  tagline: string;
}

export const STAGES: AvatarStage[] = [
  { index: 0, name: "Spark", tagline: "A tiny glimmer of potential." },
  { index: 1, name: "Flicker", tagline: "Finding its rhythm." },
  { index: 2, name: "Flame", tagline: "Burning steady and bright." },
  { index: 3, name: "Blaze", tagline: "Radiating real heat." },
  { index: 4, name: "Inferno", tagline: "Unstoppable momentum." },
  { index: 5, name: "Phoenix", tagline: "Legendary. Reborn daily." },
];

/**
 * XP required to advance from `level` to `level + 1`.
 * Grows gently so early levels feel rewarding.
 */
export function xpToNext(level: number): number {
  return 100 + (level - 1) * 60;
}

export function levelFromXp(totalXp: number): {
  level: number;
  intoLevel: number;
  needed: number;
} {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  let needed = xpToNext(level);
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = xpToNext(level);
  }
  return { level, intoLevel: remaining, needed };
}

export function stageForLevel(level: number): AvatarStage {
  const idx = Math.min(STAGES.length - 1, Math.floor((level - 1) / 3));
  return STAGES[idx];
}

export function dayKey(ts: number = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function totalXp(state: EmberState): number {
  return state.xp;
}
