import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { HaulCategory, ShoppingGoal } from '../types';
import { useStore } from '../store';
import { parseAmount } from '../utils';
import MoneyInput from './MoneyInput';
import PlacePicker from './PlacePicker';
import ScreenHeader from './ScreenHeader';

interface EditHaulProps {
  haul: ShoppingGoal;
  onBack: () => void;
}

export default function EditHaul({ haul, onBack }: EditHaulProps) {
  const { trip, updateGoal, updateGoalPlaces } = useStore();
  const [title, setTitle] = useState(haul.title);
  const [description, setDescription] = useState(haul.description || '');
  const [estimatedCost, setEstimatedCost] = useState(
    haul.estimatedCost ? haul.estimatedCost.toFixed(2) : '',
  );
  const [notes, setNotes] = useState(haul.notes || '');
  const [categories, setCategories] = useState<HaulCategory[]>(haul.categories ?? []);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set(haul.places || []));
  const [saving, setSaving] = useState(false);

  const currency = trip?.currency || 'GBP';
  const canSave = title.trim().length > 0 && !saving;

  const togglePlace = (placeId: string) => {
    setSelectedPlaces((current) => {
      const next = new Set(current);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);

    // Categories keep their ids, so editing a title does not reset what is
    // already covered.
    const cleaned = categories
      .map((c) => ({ ...c, title: c.title.trim() }))
      .filter((c) => c.title.length > 0);

    await updateGoal({
      ...haul,
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedCost: parseAmount(estimatedCost) ?? undefined,
      notes: notes.trim() || undefined,
      categories: cleaned,
    });
    await updateGoalPlaces(haul.id, Array.from(selectedPlaces));
    onBack();
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader title="Edit haul" onBack={onBack} />

      <div className="ds-card flex flex-col gap-4">
        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-haul-title">
            Title (required)
          </label>
          <input
            id="edit-haul-title"
            className="ds-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-haul-estimate">
            Estimated cost
          </label>
          <MoneyInput
            id="edit-haul-estimate"
            value={estimatedCost}
            onChange={setEstimatedCost}
            currency={currency}
          />
        </div>

        <div className="ds-field">
          <span className="ds-label">Categories to cover</span>
          <div className="flex flex-col gap-2">
            {categories.map((category, idx) => (
              <div key={category.id} className="flex gap-2">
                <input
                  className="ds-input"
                  type="text"
                  value={category.title}
                  onChange={(e) => {
                    const next = [...categories];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setCategories(next);
                  }}
                />
                <button
                  type="button"
                  className="ds-icon-btn"
                  onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
                  aria-label={`Remove ${category.title || `category ${idx + 1}`}`}
                >
                  <X style={{ width: 18, height: 18 }} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="ds-btn ds-btn--secondary ds-btn--sm self-start"
            onClick={() =>
              setCategories([
                ...categories,
                { id: `cat-${Date.now()}-${categories.length}`, title: '', completed: false },
              ])
            }
          >
            <Plus style={{ width: 16, height: 16 }} aria-hidden="true" />
            Add category
          </button>
        </div>

        <PlacePicker label="Places" selected={selectedPlaces} onToggle={togglePlace} />

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-haul-description">
            Description
          </label>
          <input
            id="edit-haul-description"
            className="ds-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-haul-notes">
            Notes
          </label>
          <textarea
            id="edit-haul-notes"
            className="ds-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-actionbar">
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
          disabled={!canSave}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="ds-btn ds-btn--secondary ds-btn--block" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>
  );
}
