/**
 * Date helpers that operate on local-calendar "YYYY-MM-DD" strings.
 *
 * We deliberately avoid `Date.toISOString()` (which is UTC) for the day key,
 * because a habit completed at 11pm should count for the local day, not the
 * UTC day. All comparisons are done on the string key.
 */

/** Convert a Date to a local "YYYY-MM-DD" key. */
export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today's local date as "YYYY-MM-DD". */
export function todayStr(): string {
  return toDateStr(new Date());
}

/** Parse a "YYYY-MM-DD" key into a local Date (midnight local time). */
export function parseDateStr(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Return the "YYYY-MM-DD" key `days` away from the given key (negative = past). */
export function addDays(key: string, days: number): string {
  const date = parseDateStr(key);
  date.setDate(date.getDate() + days);
  return toDateStr(date);
}

/** Whole-day difference a - b, in days (both are "YYYY-MM-DD" keys). */
export function dayDiff(a: string, b: string): number {
  const ms = parseDateStr(a).getTime() - parseDateStr(b).getTime();
  return Math.round(ms / 86_400_000);
}

/** Human-friendly label, e.g. "May 31, 2026". */
export function formatDate(key: string): string {
  return parseDateStr(key).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
