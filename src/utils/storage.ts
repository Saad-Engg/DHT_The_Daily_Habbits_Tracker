import type { Habit } from '../types';

const STORAGE_KEY = 'dht.habits';

/**
 * Coerce arbitrary parsed JSON into a clean Habit[], dropping anything that
 * doesn't look like a habit. Shared by both localStorage loading and file
 * import so the two stay consistent.
 */
export function normalizeHabits(parsed: unknown): Habit[] {
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (h): h is Habit =>
        !!h && typeof h.id === 'string' && typeof h.name === 'string',
    )
    .map((h) => ({
      id: h.id,
      name: h.name,
      createdAt: typeof h.createdAt === 'string' ? h.createdAt : '',
      completions: Array.isArray(h.completions)
        ? [...new Set(h.completions.filter((d: unknown) => typeof d === 'string'))].sort()
        : [],
    }));
}

/** Load habits from localStorage, tolerating missing/corrupt data. */
export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeHabits(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Persist habits to localStorage. */
export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // Storage may be full or unavailable (e.g. private mode); fail silently.
  }
}
