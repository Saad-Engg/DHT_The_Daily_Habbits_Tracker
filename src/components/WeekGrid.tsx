import type { Habit } from '../types';
import { addDays, formatDate, parseDateStr, todayStr } from '../utils/date';

interface Props {
  habit: Habit;
  onToggleDay: (id: string, day: string) => void;
}

const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** A row of the last 7 days; click a cell to toggle that day's completion. */
export function WeekGrid({ habit, onToggleDay }: Props) {
  const today = todayStr();
  const done = new Set(habit.completions);

  // Oldest -> newest (today on the right).
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  return (
    <div className="week-grid" role="group" aria-label="Last 7 days">
      {days.map((day) => {
        const isDone = done.has(day);
        const isToday = day === today;
        const weekday = WEEKDAY[parseDateStr(day).getDay()];
        return (
          <button
            type="button"
            key={day}
            className={`week-cell${isDone ? ' week-cell--done' : ''}${
              isToday ? ' week-cell--today' : ''
            }`}
            onClick={() => onToggleDay(habit.id, day)}
            title={`${formatDate(day)}${isDone ? ' — done' : ''}`}
            aria-pressed={isDone}
            aria-label={`${formatDate(day)}${isDone ? ', done' : ', not done'}`}
          >
            {weekday}
          </button>
        );
      })}
    </div>
  );
}
