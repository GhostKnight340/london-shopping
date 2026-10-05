import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useStore } from '../store';
import type { HaulCategory, ItemPriority, ShoppingGoal } from '../types';
import { parseAmount, priorityLabel } from '../utils';
import MoneyInput from './MoneyInput';
import PlacePicker from './PlacePicker';
import ScreenHeader from './ScreenHeader';

interface CreateGoalProps {
  onBack: () => void;
  onCreated: (goalId: string) => void;
}

const PRIORITIES: ItemPriority[] = ['must-buy', 'want', 'maybe'];

export default function CreateGoal({ onBack, onCreated }: CreateGoalProps) {
  const { trip, createGoal } = useStore();
  const [type, setType] = useState<'HAUL' | 'ITEM' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [priority, setPriority] = useState<ItemPriority>('want');
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!trip) return null;

  const currency = trip.currency || 'GBP';

  const togglePlace = (placeId: string) => {
    setSelectedPlaces((current) => {
      const next = new Set(current);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  };

  if (!type) {
    return (
      <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
        <ScreenHeader title="Add a goal" onBack={onBack} />
        <p className="ds-body ds-muted">Which of the two is it?</p>

        <div className="flex flex-col gap-2">
          {/* Words, not emoji: the difference between these two is the only
              thing this screen has to explain. */}
          <button
            type="button"
            className="ds-card ds-tappable text-left"
            onClick={() => setType('HAUL')}
          >
            <h2 className="ds-heading">Haul</h2>
            <p className="ds-body-sm ds-muted mt-1">
              A shop to browse, with a few categories to cover. "Japan Centre".
            </p>
          </button>

          <button
            type="button"
            className="ds-card ds-tappable text-left"
            onClick={() => setType('ITEM')}
          >
            <h2 className="ds-heading">Item</h2>
            <p className="ds-body-sm ds-muted mt-1">
              One specific thing to find, with a priority. "Blue oxford shirt".
            </p>
          </button>
        </div>
      </div>
    );
  }

  const canSave = title.trim().length > 0 && !saving;

  const handleCreate = async () => {
    if (!canSave) return;
    setSaving(true);

    const now = Date.now();
    const goal: ShoppingGoal = {
      id: `goal-${now}`,
      tripId: trip.id,
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      status: type === 'HAUL' ? 'not-started' : 'want',
      estimatedCost: parseAmount(estimatedCost) ?? undefined,
      actualCost: 0,
      transactions: [],
      places: Array.from(selectedPlaces),
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    if (type === 'HAUL') {
      const haulCategories: HaulCategory[] = categories
        .map((c) => c.trim())
        .filter(Boolean)
        .map((categoryTitle, idx) => ({
          id: `cat-${now}-${idx}`,
          title: categoryTitle,
          completed: false,
        }));
      goal.categories = haulCategories;
    } else {
      goal.priority = priority;
    }

    await createGoal(goal);
    // Lands on the thing just created rather than bouncing to Home.
    onCreated(goal.id);
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader
        title={type === 'HAUL' ? 'New haul' : 'New item'}
        onBack={() => setType(null)}
      />

      <div className="ds-card flex flex-col gap-4">
        <div className="ds-field">
          <label className="ds-label" htmlFor="goal-title">
            Title (required)
          </label>
          <input
            id="goal-title"
            className="ds-input"
            type="text"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'HAUL' ? 'Japan Centre' : 'Blue oxford shirt'}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="goal-estimate">
            Estimated cost
          </label>
          <MoneyInput
            id="goal-estimate"
            value={estimatedCost}
            onChange={setEstimatedCost}
            currency={currency}
          />
          <p className="ds-hint">Rough is fine — it only drives the over/under line.</p>
        </div>

        {type === 'ITEM' && (
          <div className="ds-field">
            <span className="ds-label">Priority</span>
            <div className="ds-segment" role="group" aria-label="Priority">
              {PRIORITIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={priority === value}
                  onClick={() => setPriority(value)}
                >
                  {priorityLabel(value).label}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'HAUL' && (
          <div className="ds-field">
            <span className="ds-label">Categories to cover</span>
            {/* Rows are added as needed, instead of four empty boxes to stare at. */}
            <div className="flex flex-col gap-2">
              {categories.map((category, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="ds-input"
                    type="text"
                    value={category}
                    onChange={(e) => {
                      const next = [...categories];
                      next[idx] = e.target.value;
                      setCategories(next);
                    }}
                    placeholder={idx === 0 ? 'Snacks' : 'Another category'}
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      className="ds-icon-btn"
                      onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
                      aria-label={`Remove category ${idx + 1}`}
                    >
                      <X style={{ width: 18, height: 18 }} aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="ds-btn ds-btn--secondary ds-btn--sm self-start"
              onClick={() => setCategories([...categories, ''])}
            >
              <Plus style={{ width: 16, height: 16 }} aria-hidden="true" />
              Add category
            </button>
          </div>
        )}

        <PlacePicker
          label={type === 'HAUL' ? 'Places' : 'Where to look'}
          selected={selectedPlaces}
          onToggle={togglePlace}
        />

        <div className="ds-field">
          <label className="ds-label" htmlFor="goal-description">
            Description
          </label>
          <input
            id="goal-description"
            className="ds-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="One line, shown on the card"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="goal-notes">
            Notes
          </label>
          <textarea
            id="goal-notes"
            className="ds-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={type === 'HAUL' ? 'What to look for' : 'Sizes, colours, brands'}
          />
        </div>
      </div>

      <div className="ds-actionbar">
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
          disabled={!canSave}
          onClick={() => void handleCreate()}
        >
          {saving ? 'Saving…' : type === 'HAUL' ? 'Create haul' : 'Create item'}
        </button>
        {!title.trim() && <p className="ds-hint text-center">A title is all it needs.</p>}
      </div>
    </div>
  );
}
