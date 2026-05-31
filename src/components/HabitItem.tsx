import { useState, type KeyboardEvent } from 'react';
import type { Habit } from '../types';
import { completionRate, currentStreak, isDoneOn, longestStreak } from '../utils/streak';
import { WeekGrid } from './WeekGrid';

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onToggleDay: (id: string, day: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function HabitItem({ habit, onToggle, onToggleDay, onRemove, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);

  const done = isDoneOn(habit);
  const streak = currentStreak(habit.completions);
  const best = longestStreak(habit.completions);
  const rate = completionRate(habit, 7);

  function commitRename() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== habit.name) onRename(habit.id, trimmed);
    else setDraft(habit.name);
    setEditing(false);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') {
      setDraft(habit.name);
      setEditing(false);
    }
  }

  return (
    <li className={`habit ${done ? 'habit--done' : ''}`}>
      <div className="habit__row">
        <label className="habit__check">
          <input
            type="checkbox"
            checked={done}
            onChange={() => onToggle(habit.id)}
            aria-label={`Mark "${habit.name}" done today`}
          />
          {editing ? (
            <input
              type="text"
              className="habit__edit"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={onKey}
              aria-label="Edit habit name"
            />
          ) : (
            <span className="habit__name">{habit.name}</span>
          )}
        </label>

        <div className="habit__meta">
          <span className="habit__streak" title="Current streak">
            🔥 {streak} {streak === 1 ? 'day' : 'days'}
          </span>
          <span className="habit__best" title="Longest streak">
            🏆 {best}
          </span>
          <span className="habit__rate" title="Last 7 days">
            {rate}%
          </span>
          {!editing && (
            <button
              type="button"
              className="btn btn--ghost habit__action"
              onClick={() => {
                setDraft(habit.name);
                setEditing(true);
              }}
              aria-label={`Rename "${habit.name}"`}
              title="Rename"
            >
              ✎
            </button>
          )}
          <button
            type="button"
            className="btn btn--ghost habit__action habit__delete"
            onClick={() => onRemove(habit.id)}
            aria-label={`Delete "${habit.name}"`}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      <WeekGrid habit={habit} onToggleDay={onToggleDay} />
    </li>
  );
}
