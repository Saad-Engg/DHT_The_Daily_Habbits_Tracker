export interface Habit {
  /** Stable unique id. */
  id: string;
  /** Display name, e.g. "Drink water". */
  name: string;
  /** ISO date string "YYYY-MM-DD" the habit was created. */
  createdAt: string;
  /** Sorted list of "YYYY-MM-DD" dates on which the habit was completed. */
  completions: string[];
}
