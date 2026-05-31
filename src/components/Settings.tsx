import { useRef, useState, type ChangeEvent } from 'react';
import type { Habit } from '../types';
import type { UseReminders } from '../hooks/useReminders';
import { exportToFile, parseImport } from '../utils/transfer';

interface Props {
  habits: Habit[];
  onImport: (habits: Habit[]) => void;
  reminders: UseReminders;
}

export function Settings({ habits, onImport, reminders }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const { settings, permission, setTime, setEnabled } = reminders;

  function notify(text: string, error = false) {
    setMessage({ text, error });
    window.setTimeout(() => setMessage(null), 4000);
  }

  function handleExport() {
    if (habits.length === 0) {
      notify('Nothing to export yet.', true);
      return;
    }
    exportToFile(habits);
    notify('Exported your habits.');
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = parseImport(await file.text());
      if (
        habits.length > 0 &&
        !window.confirm(
          `Replace your current ${habits.length} habit(s) with ${imported.length} from the file?`,
        )
      ) {
        return;
      }
      onImport(imported);
      notify(`Imported ${imported.length} habit(s).`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Import failed.', true);
    } finally {
      e.target.value = ''; // allow re-importing the same file
    }
  }

  return (
    <section className="settings" aria-label="Settings">
      <div className="settings__group">
        <span className="settings__label">Data</span>
        <button type="button" className="btn btn--soft" onClick={handleExport}>
          ⬇ Export
        </button>
        <button
          type="button"
          className="btn btn--soft"
          onClick={() => fileRef.current?.click()}
        >
          ⬆ Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleFile}
        />
      </div>

      <div className="settings__group">
        <label className="settings__label settings__remind">
          <input
            type="checkbox"
            checked={settings.enabled}
            disabled={permission === 'unsupported' || permission === 'denied'}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Daily reminder
        </label>
        <input
          type="time"
          className="settings__time"
          value={settings.time}
          onChange={(e) => setTime(e.target.value)}
          disabled={!settings.enabled}
          aria-label="Reminder time"
        />
      </div>

      {permission === 'denied' && (
        <p className="settings__note settings__note--error">
          Notifications are blocked in your browser settings.
        </p>
      )}
      {permission === 'unsupported' && (
        <p className="settings__note">Notifications aren't supported here.</p>
      )}
      {message && (
        <p className={`settings__note${message.error ? ' settings__note--error' : ''}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}
