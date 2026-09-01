export type LogKind = "meal" | "workout";

export interface LogEntry {
  id: string;
  kind: LogKind;
  label: string;
  detail: string;
  xp: number;
  at: number;
}

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  xp: number;
}

export interface EmberState {
  xp: number;
  streak: number;
  lastActiveDay: string | null;
  log: LogEntry[];
  friends: Friend[];
}
