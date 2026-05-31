import { AddHabitForm } from './components/AddHabitForm';
import { Dashboard } from './components/Dashboard';
import { HabitList } from './components/HabitList';
import { Settings } from './components/Settings';
import { useHabits } from './hooks/useHabits';
import { useReminders } from './hooks/useReminders';
import { formatDate, todayStr } from './utils/date';

export default function App() {
  const {
    habits,
    addHabit,
    removeHabit,
    renameHabit,
    toggleDay,
    toggleToday,
    importHabits,
  } = useHabits();
  const reminders = useReminders(habits);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🌟 Daily Habits Tracker</h1>
        <p className="app__date">{formatDate(todayStr())}</p>
      </header>

      <Dashboard habits={habits} />

      <Settings habits={habits} onImport={importHabits} reminders={reminders} />

      <main className="app__main">
        <AddHabitForm onAdd={addHabit} />
        <HabitList
          habits={habits}
          onToggle={toggleToday}
          onToggleDay={toggleDay}
          onRemove={removeHabit}
          onRename={renameHabit}
        />
      </main>

      <footer className="app__footer">
        Your data is saved locally in this browser only.
      </footer>
    </div>
  );
}
