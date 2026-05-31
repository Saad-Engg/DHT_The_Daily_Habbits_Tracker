# 🌟 Daily Habits Tracker (DHT)

A lightweight, privacy-friendly web app for building and tracking daily habits. Add the habits you want to build, check them off each day, and watch your streaks grow. Everything is stored **locally in your browser** — there is no backend, no account, and no data ever leaves your device.

> Built with **Vite + React + TypeScript**.

---

## ✨ Features

- **Add, rename, and remove habits** — manage your habit list at any time.
- **Daily check-off** — mark a habit done for today with a single click.
- **Week grid** — toggle completion for any day of the current week, not just today.
- **Streaks** — see your *current* streak (with a "don't break the chain" rule) and your *longest-ever* streak.
- **Completion rate** — a rolling percentage over the last N days (default 7).
- **Dashboard** — at-a-glance overview of your progress across all habits.
- **Daily reminders** — opt-in browser notifications at a time you choose (fires while the tab is open).
- **Import / export** — back up your habits to a JSON file and restore them later, or move them between browsers.
- **Offline & private** — all data lives in your browser's `localStorage`; nothing is sent to a server.

---

## 🧠 How It Works

### Data model

A habit is a small object (`src/types.ts`):

```ts
interface Habit {
  id: string;          // stable unique id (crypto.randomUUID)
  name: string;        // display name, e.g. "Drink water"
  createdAt: string;   // ISO date "YYYY-MM-DD" the habit was created
  completions: string[]; // sorted "YYYY-MM-DD" dates the habit was completed
}
```

A habit being "done" on a day simply means that day's date is present in its `completions` array. This keeps storage tiny and the logic simple.

### State & persistence

- **`useHabits` hook** (`src/hooks/useHabits.ts`) owns the habit list. It seeds initial state from `localStorage` and **auto-saves on every change**, so your data persists across page reloads.
- **`storage.ts`** handles load/save under the `dht.habits` key. It tolerates missing or corrupt data and **normalizes** any parsed JSON into clean `Habit[]`, dropping malformed entries. This same normalizer is reused for file imports so both paths stay consistent.

### Streak logic (`src/utils/streak.ts`)

- **Current streak** — counts consecutive completed days ending today. The chain stays alive if today is done, *or* if today isn't done yet but yesterday was (you still have today to keep it going), then walks backwards until it hits a gap.
- **Longest streak** — the longest run of consecutive completed days the habit has ever had.
- **Completion rate** — percentage of the last N calendar days (default 7) that were completed.

### Reminders (`src/hooks/useReminders.ts`)

Because the app is backend-free, reminders rely on the browser's **Notification API** and can only fire **while a tab is open**. When enabled (after you grant notification permission), a timer checks once a minute; at or after your chosen time it sends **one notification per day** if you still have incomplete habits. Settings are stored under the `dht.reminder` key.

### Import / export (`src/utils/transfer.ts`)

- **Export** serializes your habits to a downloadable `habits-YYYY-MM-DD.json` file.
- **Import** parses a JSON file, validates it through the shared normalizer, and replaces your current list. Invalid JSON or a file with no recognizable habits throws a clear error.

### Project structure

```
DHT_The_Daily_Habbits_Tracker/
├─ index.html              # Vite entry HTML
├─ package.json            # scripts & dependencies
├─ vite.config.ts          # Vite + React plugin config
├─ tsconfig*.json          # TypeScript configuration
└─ src/
   ├─ main.tsx             # React root / app bootstrap
   ├─ App.tsx              # top-level layout: header, dashboard, settings, list
   ├─ types.ts             # Habit type
   ├─ components/
   │  ├─ AddHabitForm.tsx  # form to add a new habit
   │  ├─ HabitList.tsx     # list of habits
   │  ├─ HabitItem.tsx     # single habit row (toggle / rename / remove)
   │  ├─ WeekGrid.tsx      # per-day toggles for the current week
   │  ├─ Dashboard.tsx     # progress overview
   │  └─ Settings.tsx      # import/export + reminder settings
   ├─ hooks/
   │  ├─ useHabits.ts      # habit state + persistence + mutations
   │  └─ useReminders.ts   # daily reminder scheduling
   ├─ utils/
   │  ├─ date.ts           # date helpers (todayStr, addDays, dayDiff, formatDate)
   │  ├─ storage.ts        # localStorage load/save + normalize
   │  ├─ streak.ts         # streak & completion-rate calculations
   │  └─ transfer.ts       # JSON import/export
   └─ styles/
      └─ index.css         # app styles
```

---

## 🚀 Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** version **18 or newer** (Node 18+ provides `crypto.randomUUID`, which the app uses). Node 20 LTS is recommended.
- **npm** (bundled with Node).

Check your versions:

```bash
node --version
npm --version
```

> **Windows note:** On this machine Node is installed at `C:\Program Files\nodejs` but may not be on the default `PATH`. If `node`/`npm` aren't found, either add that folder to your `PATH` or prefix commands with the full path, e.g. `& "C:\Program Files\nodejs\npm.cmd" install`.

### 1. Install dependencies

```bash
npm install
```

This installs everything declared in `package.json`:

| Package | Type | Purpose |
| --- | --- | --- |
| `react` ^18.3.1 | dependency | UI library |
| `react-dom` ^18.3.1 | dependency | React DOM renderer |
| `vite` ^5.4.11 | dev | Dev server & build tool |
| `@vitejs/plugin-react` ^4.3.4 | dev | React (JSX/Fast Refresh) support for Vite |
| `typescript` ^5.6.3 | dev | TypeScript compiler |
| `@types/react` ^18.3.12 | dev | React type definitions |
| `@types/react-dom` ^18.3.1 | dev | React DOM type definitions |

### 2. Run the development server

```bash
npm run dev
```

Vite prints a local URL (typically **http://localhost:5173**). Open it in your browser; the app supports hot-module reload, so edits appear instantly.

### 3. Build for production

```bash
npm run build
```

This type-checks with `tsc` and then bundles the app into the `dist/` folder.

### 4. Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can verify the production build before deploying.

---

## 📜 Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run build` | Type-check (`tsc`) and produce an optimized production build in `dist/`. |
| `npm run preview` | Serve the built `dist/` locally for final verification. |

---

## 💾 Your Data

- All habit data is stored in your browser's `localStorage` (keys: `dht.habits`, `dht.reminder`).
- Clearing your browser data or using a different browser/device will start you fresh.
- Use **Settings → Export** to back up your habits to a JSON file, and **Import** to restore or transfer them.

---

## 🛠️ Tech Stack

- **React 18** — component-based UI
- **TypeScript** — type safety
- **Vite 5** — fast dev server and bundler
- **Browser APIs** — `localStorage` for persistence, `Notification` for reminders

---

## 📄 License

This project is currently unlicensed (all rights reserved by default). Add a license file if you intend others to reuse it.
