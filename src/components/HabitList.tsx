import type { Habit } from '../types';
import { HabitItem } from './HabitItem';

interface Props {
  habits: Habit[];
  onToggle: (id: string) => void;
  onToggleDay: (id: string, day: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function HabitList({ habits, onToggle, onToggleDay, onRemove, onRename }: Props) {
  if (habits.length === 0) {
    return (
      <p className="empty">
        No habits yet. Add your first one above to start a streak! 🌱
      </p>
    );
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onToggleDay={onToggleDay}
          onRemove={onRemove}
          onRename={onRename}
        />
      ))}
    </ul>
  );
}
