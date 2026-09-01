"use client";

import { useSyncExternalStore } from "react";
import type { EmberState, LogEntry, LogKind } from "./types";
import { dayKey } from "./game";

const STORAGE_KEY = "ember.state.v1";

function seedFriends() {
  return [
    { id: "f1", name: "Maya", emoji: "🦊", xp: 640 },
    { id: "f2", name: "Leo", emoji: "🐉", xp: 420 },
    { id: "f3", name: "Priya", emoji: "🦉", xp: 815 },
    { id: "f4", name: "Sam", emoji: "🐺", xp: 210 },
  ];
}

function initialState(): EmberState {
  return {
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    log: [],
    friends: seedFriends(),
  };
}

// Stable reference used for server render + hydration so snapshots don't tear.
const SERVER_SNAPSHOT: EmberState = initialState();

let uidCounter = 0;
function uid(): string {
  uidCounter += 1;
  return `${Date.now().toString(36)}-${uidCounter}`;
}

function loadFromStorage(): EmberState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<EmberState>;
    return {
      ...initialState(),
      ...parsed,
      friends:
        parsed.friends && parsed.friends.length ? parsed.friends : seedFriends(),
    };
  } catch {
    return initialState();
  }
}

let state: EmberState =
  typeof window === "undefined" ? SERVER_SNAPSHOT : loadFromStorage();

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / serialization errors
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): EmberState {
  return state;
}

function getServerSnapshot(): EmberState {
  return SERVER_SNAPSHOT;
}

export function addEntry(
  kind: LogKind,
  label: string,
  detail: string,
  xp: number,
): void {
  const today = dayKey();
  let streak = state.streak;
  if (state.lastActiveDay !== today) {
    const yesterday = dayKey(Date.now() - 86_400_000);
    streak = state.lastActiveDay === yesterday ? state.streak + 1 : 1;
  } else if (streak === 0) {
    streak = 1;
  }
  const entry: LogEntry = { id: uid(), kind, label, detail, xp, at: Date.now() };
  state = {
    ...state,
    xp: state.xp + xp,
    streak,
    lastActiveDay: today,
    log: [entry, ...state.log].slice(0, 50),
  };
  persist();
  emit();
}

export function reset(): void {
  state = initialState();
  persist();
  emit();
}

export interface EmberApi {
  state: EmberState;
  ready: boolean;
  addEntry: typeof addEntry;
  reset: typeof reset;
}

export function useEmber(): EmberApi {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return {
    state: snapshot,
    ready: snapshot !== SERVER_SNAPSHOT,
    addEntry,
    reset,
  };
}

// Kept as a passthrough so the page can wrap its tree without a required provider.
export function EmberProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
