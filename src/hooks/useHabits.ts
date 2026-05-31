import { useEffect, useState } from 'react';
import type { Habit } from '../types';
import { loadHabits, saveHabits } from '../utils/storage';
import { todayStr } from '../utils/date';

export interface UseHabits {
  habits: Habit[];
  addHabit: (name: string) => void;
  removeHabit: (id: string) => void;
  renameHabit: (id: string, name: string) => void;
  toggleDay: (id: string, day: string) => void;
  toggleToday: (id: string) => void;
  importHabits: (habits: Habit[]) => void;
}

/**
 * Owns the habits list: seeds from localStorage, auto-persists on change,
 * and exposes the mutation actions the UI needs.
 */
export function useHabits(): UseHabits {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  // Persist whenever the list changes.
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function addHabit(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: todayStr(),
      completions: [],
    };
    setHabits((prev) => [...prev, habit]);
  }

  function removeHabit(id: string): void {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function renameHabit(id: string, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h)),
    );
  }

  /** Toggle completion on/off for an arbitrary day ("YYYY-MM-DD"). */
  function toggleDay(id: string, day: string): void {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(day);
        const completions = done
          ? h.completions.filter((d) => d !== day)
          : [...h.completions, day].sort();
        return { ...h, completions };
      }),
    );
  }

  function toggleToday(id: string): void {
    toggleDay(id, todayStr());
  }

  /** Replace the whole list (used by file import). */
  function importHabits(next: Habit[]): void {
    setHabits(next);
  }

  return {
    habits,
    addHabit,
    removeHabit,
    renameHabit,
    toggleDay,
    toggleToday,
    importHabits,
  };
}
