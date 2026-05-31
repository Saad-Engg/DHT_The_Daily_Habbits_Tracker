import { useState, type FormEvent } from 'react';

interface Props {
  onAdd: (name: string) => void;
}

export function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName('');
  }

  return (
    <form className="add-habit" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-habit__input"
        placeholder="Add a new habit…  (e.g. Drink water)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="New habit name"
      />
      <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
        Add habit
      </button>
    </form>
  );
}
