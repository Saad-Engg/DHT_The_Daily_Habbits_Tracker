import type { Habit } from '../types';
import { addDays, dayDiff, todayStr } from './date';

/**
 * Current streak using a "don't break the chain" rule.
 *
 * The streak is the number of consecutive completed days ending at today.
 * It stays alive if *today* is done, or if today isn't done yet but
 * *yesterday* was (you still have today to keep it going). Counting then
 * walks backwards over consecutive days until a gap is found.
 */
export function currentStreak(completions: string[], today = todayStr()): number {
  if (completions.length === 0) return 0;
  const done = new Set(completions);

  // Decide where the chain ends: today if done, else yesterday if done, else broken.
  let cursor: string;
  if (done.has(today)) {
    cursor = today;
  } else if (done.has(addDays(today, -1))) {
    cursor = addDays(today, -1);
  } else {
    return 0;
  }

  let count = 0;
  while (done.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Longest run of consecutive completed days the habit has ever had. */
export function longestStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...new Set(completions)].sort();

  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (dayDiff(sorted[i], sorted[i - 1]) === 1) {
      run++;
    } else {
      run = 1;
    }
    if (run > best) best = run;
  }
  return best;
}

/**
 * Percentage (0–100) of the last `days` calendar days that were completed,
 * counting today as the final day.
 */
export function completionRate(
  habit: Habit,
  days = 7,
  today = todayStr(),
): number {
  if (days <= 0) return 0;
  const done = new Set(habit.completions);
  let hits = 0;
  for (let i = 0; i < days; i++) {
    if (done.has(addDays(today, -i))) hits++;
  }
  return Math.round((hits / days) * 100);
}

/** Whether the habit is marked done for the given day (defaults to today). */
export function isDoneOn(habit: Habit, day = todayStr()): boolean {
  return habit.completions.includes(day);
}
