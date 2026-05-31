import type { Habit } from '../types';
import { completionRate, currentStreak, isDoneOn } from '../utils/streak';

interface Props {
  habits: Habit[];
}

interface Stat {
  label: string;
  value: string;
  hint: string;
}

export function Dashboard({ habits }: Props) {
  const total = habits.length;
  const doneToday = habits.filter((h) => isDoneOn(h)).length;
  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, currentStreak(h.completions)),
    0,
  );
  const avgRate =
    total === 0
      ? 0
      : Math.round(
          habits.reduce((sum, h) => sum + completionRate(h, 7), 0) / total,
        );

  const stats: Stat[] = [
    { label: 'Habits', value: String(total), hint: 'being tracked' },
    { label: 'Done today', value: `${doneToday}/${total}`, hint: 'completed' },
    { label: 'Best streak', value: `${bestStreak}`, hint: 'days in a row' },
    { label: '7-day rate', value: `${avgRate}%`, hint: 'avg completion' },
  ];

  return (
    <section className="dashboard" aria-label="Overview">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <span className="stat-card__value">{s.value}</span>
          <span className="stat-card__label">{s.label}</span>
          <span className="stat-card__hint">{s.hint}</span>
        </div>
      ))}
    </section>
  );
}
