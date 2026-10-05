import { useState } from 'react';
import { Edit2, ExternalLink, MapPin, Trash2 } from 'lucide-react';
import type { ItemPriority, ShoppingGoal } from '../types';
import { useStore } from '../store';
import { priorityLabel, statusLabel } from '../utils';
import { scrollToTop, useBackGuard } from '../useBackGuard';
import ScreenHeader from './ScreenHeader';
import SpendingTracker from './SpendingTracker';
import StatusPill from './StatusPill';
import EditItem from './EditItem';
import { useToast } from './Toast';

interface ItemDetailProps {
  item: ShoppingGoal;
  onBack: () => void;
}

const STATUSES: Array<ShoppingGoal['status']> = ['want', 'found', 'bought', 'skipped'];
const PRIORITIES: ItemPriority[] = ['must-buy', 'want', 'maybe'];

export default function ItemDetail({ item, onBack }: ItemDetailProps) {
  const { trip, places, updateGoal, updateGoalStatus, deleteGoal } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const currency = trip?.currency || 'GBP';
  const status = statusLabel(item.status);
  const itemPlaces = (item.places ?? [])
    .map((pid) => places.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  useBackGuard(editing, () => setEditing(false));

  if (editing) {
    return (
      <EditItem
        item={item}
        onBack={() => {
          setEditing(false);
          scrollToTop();
        }}
      />
    );
  }

  const handleDelete = () => {
    if (confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      void deleteGoal(item.id);
      onBack();
    }
  };

  const setStatus = async (next: ShoppingGoal['status']) => {
    if (next === item.status) return;
    const previous = item.status;
    await updateGoalStatus(item.id, next);
    toast(`Marked ${statusLabel(next).label.toLowerCase()}`, () => {
      void updateGoalStatus(item.id, previous);
    });
  };

  /* Priority was a dead control before: the buttons had an empty handler and a
     comment saying the store needed an action. updateGoal already exists. */
  const setPriority = async (next: ItemPriority) => {
    if (next === item.priority) return;
    await updateGoal({ ...item, priority: next });
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader
        title={item.title}
        onBack={onBack}
        action={
          <button
            type="button"
            className="ds-icon-btn"
            onClick={() => {
              setEditing(true);
              scrollToTop();
            }}
            aria-label="Edit item"
          >
            <Edit2 style={{ width: 20, height: 20 }} aria-hidden="true" />
          </button>
        }
        subtitle={
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill label={status.label} tone={status.tone} />
            <StatusPill {...priorityLabel(item.priority)} />
            {item.quantity && item.quantity > 1 && (
              <span className="ds-caption ds-muted">× {item.quantity}</span>
            )}
          </div>
        }
      />

      {item.image && (
        <div
          className="overflow-hidden"
          style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)' }}
        >
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}

      <section className="ds-card flex flex-col gap-4">
        <div>
          <p className="ds-eyebrow mb-2">Status</p>
          <div className="ds-segment" role="group" aria-label="Item status">
            {STATUSES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={item.status === value}
                onClick={() => void setStatus(value)}
              >
                {statusLabel(value).label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="ds-eyebrow mb-2">Priority</p>
          <div className="ds-segment" role="group" aria-label="Item priority">
            {PRIORITIES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={(item.priority ?? 'want') === value}
                onClick={() => void setPriority(value)}
              >
                {priorityLabel(value).label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {item.description && (
        <section className="ds-card">
          <p className="ds-body ds-muted">{item.description}</p>
        </section>
      )}

      <SpendingTracker
        goalId={item.id}
        actualCost={item.actualCost}
        estimatedCost={item.estimatedCost}
        transactions={item.transactions}
        currency={currency}
      />

      {itemPlaces.length > 0 && (
        <section className="ds-card">
          <h2 className="ds-heading mb-3">Where to look</h2>
          <div className="flex flex-col gap-1">
            {itemPlaces.map((place) => (
              <div key={place.id} className="ds-inset flex items-center gap-2">
                <MapPin style={{ width: 18, height: 18, color: 'var(--ink-muted)' }} aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="ds-body-sm font-semibold block truncate">{place.name}</span>
                  {place.area && <span className="ds-caption ds-muted block truncate">{place.area}</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {item.notes && (
        <section className="ds-card">
          <h2 className="ds-heading mb-2">Notes</h2>
          <p className="ds-body ds-muted">{item.notes}</p>
        </section>
      )}

      {item.url && (
        <section className="ds-card">
          <h2 className="ds-heading mb-2">Reference</h2>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn ds-btn--secondary ds-btn--block"
          >
            <ExternalLink style={{ width: 18, height: 18 }} aria-hidden="true" />
            Open link
          </a>
        </section>
      )}

      <section style={{ marginTop: 'var(--space-6)' }}>
        <button type="button" className="ds-btn ds-btn--danger ds-btn--block" onClick={handleDelete}>
          <Trash2 style={{ width: 18, height: 18 }} aria-hidden="true" />
          Delete item
        </button>
      </section>
    </div>
  );
}
