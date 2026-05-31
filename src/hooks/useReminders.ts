import { useEffect, useRef, useState } from 'react';
import type { Habit } from '../types';
import { isDoneOn } from '../utils/streak';
import { todayStr } from '../utils/date';

const SETTINGS_KEY = 'dht.reminder';

export interface ReminderSettings {
  enabled: boolean;
  /** Time of day to remind, "HH:MM" (24h). */
  time: string;
}

export interface UseReminders {
  settings: ReminderSettings;
  /** 'default' | 'granted' | 'denied' | 'unsupported' */
  permission: NotificationPermission | 'unsupported';
  setTime: (time: string) => void;
  /** Toggle reminders; enabling requests notification permission. */
  setEnabled: (enabled: boolean) => Promise<void>;
}

function loadSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        enabled: !!parsed.enabled,
        time: typeof parsed.time === 'string' ? parsed.time : '09:00',
      };
    }
  } catch {
    /* fall through to default */
  }
  return { enabled: false, time: '09:00' };
}

const supported = typeof Notification !== 'undefined';

/**
 * Manages a single daily reminder. Because this is a backend-free local app,
 * notifications can only fire while the tab is open: a timer checks once a
 * minute and, at/after the chosen time, notifies once per day if any habit is
 * still incomplete.
 */
export function useReminders(habits: Habit[]): UseReminders {
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    supported ? Notification.permission : 'unsupported',
  );
  // The last date we already fired a notification for, to avoid repeats.
  const lastNotified = useRef<string | null>(null);
  // Keep latest habits accessible inside the interval without resetting it.
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!settings.enabled || permission !== 'granted') return;

    function check() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const nowStr = `${hh}:${mm}`;
      const today = todayStr();

      if (nowStr >= settings.time && lastNotified.current !== today) {
        const pending = habitsRef.current.filter((h) => !isDoneOn(h, today));
        if (pending.length > 0) {
          new Notification('Daily Habits Tracker', {
            body:
              pending.length === 1
                ? `Don't forget: ${pending[0].name}`
                : `You have ${pending.length} habits left today.`,
          });
        }
        // Mark as handled for today even if nothing was pending.
        lastNotified.current = today;
      }
    }

    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [settings.enabled, settings.time, permission]);

  function setTime(time: string): void {
    setSettings((s) => ({ ...s, time }));
  }

  async function setEnabled(enabled: boolean): Promise<void> {
    if (!enabled) {
      setSettings((s) => ({ ...s, enabled: false }));
      return;
    }
    if (!supported) return;
    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }
    setPermission(perm);
    // Only switch on if the user actually granted permission.
    setSettings((s) => ({ ...s, enabled: perm === 'granted' }));
  }

  return { settings, permission, setTime, setEnabled };
}
