import { WorkoutEntry } from '@/lib/storage';

/**
 * Payload structure from Apple Watch
 */
export interface WatchPayload {
  day: string; // "YYYY-MM-DD"
  workouts: Array<{
    id: string;
    name: string;
    minutes: number;
    kcal: number;
    at: string; // ISO timestamp
  }>;
}

/**
 * Encodes a WatchPayload to base64url format
 */
export function encodeWatchPayload(payload: WatchPayload): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(json);
  // Convert base64 to base64url
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Decodes a base64url string to WatchPayload
 */
export function decodeWatchPayload(base64url: string): WatchPayload | null {
  try {
    // Convert base64url to base64
    let base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const json = atob(base64);
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decode watch payload:', error);
    return null;
  }
}

/**
 * Converts watch payload workouts to WorkoutEntry array
 */
export function watchRowsFromPayload(payload: WatchPayload): WorkoutEntry[] {
  return payload.workouts.map((workout) => ({
    id: `watch-${workout.id}`,
    name: workout.name,
    calories: workout.kcal,
    timestamp: new Date(workout.at).getTime(),
  }));
}

/**
 * Checks if an exercise ID is from Apple Watch
 */
export function isWatchExerciseId(id: string): boolean {
  return id.startsWith('watch-');
}
