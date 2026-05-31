# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server with HMR (http://localhost:5173)
npm run build      # type-check (tsc) then bundle to dist/
npm run preview    # serve the production build from dist/
```

There is **no test runner and no linter configured** — `npm run build` (via `tsc`) is the only automated check. TypeScript runs in `strict` mode with `noUnusedLocals`/`noUnusedParameters`, so unused symbols fail the build.

**Windows/Node note:** Node is installed at `C:\Program Files\nodejs` but is often not on `PATH`. If `npm` isn't found, prefix with the full path, e.g. `& "C:\Program Files\nodejs\npm.cmd" run dev`.

## Architecture

A **backend-free single-page app** (Vite + React 18 + TypeScript). There is no server, no API, and no account — all state lives in the browser's `localStorage`. Keep that constraint in mind: any "remind me later" or "sync" style feature is bounded by what a single open browser tab can do.

The whole app is built around one tiny data type, `Habit` (`src/types.ts`). A habit is "done" on a day purely by whether that day's `"YYYY-MM-DD"` key is present in its `completions` array — there is no per-day record object. This keeps storage and logic minimal, so most features are derived calculations over those date arrays rather than stored fields.

Key pieces that span multiple files:

- **State ownership — `src/hooks/useHabits.ts`.** This hook is the single source of truth for the habit list. It seeds from `localStorage` on init and auto-persists via an effect on every change. All mutations (add/remove/rename/toggle/import) flow through here. UI components are otherwise stateless and receive callbacks.

- **Persistence + validation — `src/utils/storage.ts`.** `normalizeHabits()` coerces arbitrary parsed JSON into clean `Habit[]`, dropping malformed entries. It is **shared by both `localStorage` loading and file import** so corrupt-data handling stays identical across both paths. When changing the `Habit` shape, update `normalizeHabits` or old/imported data will be silently dropped.

- **Date handling — `src/utils/date.ts`.** All day keys are **local-calendar `"YYYY-MM-DD"` strings, deliberately not `toISOString()` (UTC)** — a habit completed at 11pm must count for the local day. Comparisons, streaks, and "today" all operate on these string keys via `todayStr`/`addDays`/`dayDiff`. Do not introduce UTC date math.

- **Derived metrics — `src/utils/streak.ts`.** Streaks and completion rate are computed from `completions`, never stored. Current streak uses a "don't break the chain" rule: the chain stays alive if today is done, or if today isn't done yet but yesterday was.

- **Reminders — `src/hooks/useReminders.ts`.** Uses the browser `Notification` API and only fires **while a tab is open**. A 1-minute interval checks the time and notifies at most once per day for pending habits. Settings persist under `dht.reminder` (habits persist under `dht.habits`).

`App.tsx` wires these together: `Dashboard` (overview), `Settings` (import/export + reminders), `AddHabitForm`, and `HabitList`/`HabitItem`/`WeekGrid` (per-day toggling).
