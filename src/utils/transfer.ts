import type { Habit } from '../types';
import { normalizeHabits } from './storage';
import { todayStr } from './date';

/** Serialize habits to a downloadable JSON file and trigger the download. */
export function exportToFile(habits: Habit[]): void {
  const blob = new Blob([JSON.stringify(habits, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habits-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Parse imported file text into a validated Habit[].
 * Throws on invalid JSON or a payload with no recognizable habits.
 */
export function parseImport(text: string): Habit[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const habits = normalizeHabits(parsed);
  if (habits.length === 0) {
    throw new Error('No habits found in that file.');
  }
  return habits;
}
