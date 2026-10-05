import { useState } from 'react';
import type { ItemPriority, ShoppingGoal } from '../types';
import { useStore } from '../store';
import { parseAmount, priorityLabel } from '../utils';
import MoneyInput from './MoneyInput';
import PlacePicker from './PlacePicker';
import ScreenHeader from './ScreenHeader';

interface EditItemProps {
  item: ShoppingGoal;
  onBack: () => void;
}

const PRIORITIES: ItemPriority[] = ['must-buy', 'want', 'maybe'];

export default function EditItem({ item, onBack }: EditItemProps) {
  const { trip, updateGoal, updateGoalPlaces } = useStore();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [estimatedCost, setEstimatedCost] = useState(
    item.estimatedCost ? item.estimatedCost.toFixed(2) : '',
  );
  const [priority, setPriority] = useState<ItemPriority>(item.priority ?? 'want');
  const [quantity, setQuantity] = useState(String(item.quantity ?? 1));
  const [url, setUrl] = useState(item.url || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set(item.places || []));
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

    const parsedQuantity = Number.parseInt(quantity, 10);

    await updateGoal({
      ...item,
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedCost: parseAmount(estimatedCost) ?? undefined,
      priority,
      quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    await updateGoalPlaces(item.id, Array.from(selectedPlaces));
    onBack();
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader title="Edit item" onBack={onBack} />

      <div className="ds-card flex flex-col gap-4">
        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-item-title">
            Title (required)
          </label>
          <input
            id="edit-item-title"
            className="ds-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div className="ds-field">
            <label className="ds-label" htmlFor="edit-item-estimate">
              Estimated price
            </label>
            <MoneyInput
              id="edit-item-estimate"
              value={estimatedCost}
              onChange={setEstimatedCost}
              currency={currency}
            />
          </div>

          <div className="ds-field">
            <label className="ds-label" htmlFor="edit-item-quantity">
              Quantity
            </label>
            <input
              id="edit-item-quantity"
              className="ds-input ds-num"
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>

        <PlacePicker label="Where to look" selected={selectedPlaces} onToggle={togglePlace} />

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-item-description">
            Description
          </label>
          <input
            id="edit-item-description"
            className="ds-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-item-url">
            Link
          </label>
          <input
            id="edit-item-url"
            className="ds-input"
            type="url"
            inputMode="url"
            autoCapitalize="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-item-notes">
            Notes
          </label>
          <textarea
            id="edit-item-notes"
            className="ds-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sizes, colours, brands"
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
