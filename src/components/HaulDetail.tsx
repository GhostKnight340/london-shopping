import { useState } from 'react';
import { Check, Edit2, MapPin, Trash2 } from 'lucide-react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import { getCategoryProgress, statusLabel, tapFeedback } from '../utils';
import { scrollToTop, useBackGuard } from '../useBackGuard';
import ProgressBar from './ProgressBar';
import ScreenHeader from './ScreenHeader';
import ShoppingMode from './ShoppingMode';
import SpendingTracker from './SpendingTracker';
import StatusPill from './StatusPill';
import EditHaul from './EditHaul';
import { useToast } from './Toast';

interface HaulDetailProps {
  haul: ShoppingGoal;
  onBack: () => void;
}

export default function HaulDetail({ haul, onBack }: HaulDetailProps) {
  const { trip, places, toggleCategory, updateGoalStatus, deleteGoal } = useStore();
  const { toast } = useToast();
  const [inStore, setInStore] = useState(false);
  const [editing, setEditing] = useState(false);

  const currency = trip?.currency || 'GBP';
  const progress = getCategoryProgress(haul.categories);
  const status = statusLabel(haul.status);
  const haulPlaces = (haul.places ?? [])
    .map((pid) => places.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  useBackGuard(editing, () => setEditing(false));

  if (editing) {
    return (
      <EditHaul
        haul={haul}
        onBack={() => {
          setEditing(false);
          scrollToTop();
        }}
      />
    );
  }

  if (inStore) {
    return <ShoppingMode haul={haul} onExit={() => setInStore(false)} />;
  }

  /* Deleting a haul is the one place a blocking confirm is still right: it is
     not reversible and it takes its categories and transactions with it. */
  const handleDelete = () => {
    const count = haul.transactions.length;
    const detail = [
      haul.categories?.length ? `${haul.categories.length} categories` : null,
      count ? `${count} ${count === 1 ? 'entry' : 'entries'}` : null,
    ]
      .filter(Boolean)
      .join(' and ');

    const message = detail
      ? `Delete "${haul.title}"? This also removes its ${detail}.`
      : `Delete "${haul.title}"?`;

    if (confirm(message)) {
      void deleteGoal(haul.id);
      onBack();
    }
  };

  const setStatus = async (next: ShoppingGoal['status']) => {
    const previous = haul.status;
    await updateGoalStatus(haul.id, next);
    toast(`Marked ${statusLabel(next).label.toLowerCase()}`, () => {
      void updateGoalStatus(haul.id, previous);
    });
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader
        title={haul.title}
        onBack={onBack}
        action={
          <button
            type="button"
            className="ds-icon-btn"
            onClick={() => {
              setEditing(true);
              scrollToTop();
            }}
            aria-label="Edit haul"
          >
            <Edit2 style={{ width: 20, height: 20 }} aria-hidden="true" />
          </button>
        }
        subtitle={
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill label={status.label} tone={status.tone} />
            {haul.description && <span className="ds-body-sm ds-muted">{haul.description}</span>}
          </div>
        }
      />

      <SpendingTracker
        goalId={haul.id}
        actualCost={haul.actualCost}
        estimatedCost={haul.estimatedCost}
        transactions={haul.transactions}
        currency={currency}
      />

      {haul.categories && haul.categories.length > 0 && (
        <section className="ds-card flex flex-col gap-3">
          <ProgressBar completed={progress.completed} total={progress.total} />
          <div className="flex flex-col gap-1">
            {haul.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="ds-row"
                role="checkbox"
                aria-checked={category.completed}
                onClick={() => {
                  tapFeedback();
                  void toggleCategory(haul.id, category.id);
                }}
              >
                <span className="ds-check" aria-hidden="true" data-checked={category.completed}>
                  {category.completed && <Check style={{ width: 16, height: 16 }} />}
                </span>
                {/* No strike-through: a covered category still has to be readable. */}
                <span className="ds-body flex-1 font-medium">{category.title}</span>
                <span className="ds-caption ds-muted">{category.completed ? 'Covered' : 'To do'}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {haulPlaces.length > 0 && (
        <section className="ds-card">
          <h2 className="ds-heading mb-3">Places</h2>
          <div className="flex flex-col gap-1">
            {haulPlaces.map((place) => (
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

      {haul.notes && (
        <section className="ds-card">
          <h2 className="ds-heading mb-2">Notes</h2>
          <p className="ds-body ds-muted">{haul.notes}</p>
        </section>
      )}

      <section className="flex flex-col gap-2">
        {haul.status !== 'completed' && (
          <button
            type="button"
            className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
            onClick={() => setInStore(true)}
          >
            I'm in the shop
          </button>
        )}

        {haul.status === 'not-started' && (
          <button
            type="button"
            className="ds-btn ds-btn--secondary ds-btn--block"
            onClick={() => void setStatus('in-progress')}
          >
            Mark in progress
          </button>
        )}

        {haul.status === 'in-progress' && (
          <button
            type="button"
            className="ds-btn ds-btn--secondary ds-btn--block"
            onClick={() => void setStatus('completed')}
          >
            Mark completed
          </button>
        )}

        {haul.status === 'completed' && (
          <button
            type="button"
            className="ds-btn ds-btn--secondary ds-btn--block"
            onClick={() => void setStatus('in-progress')}
          >
            Reopen haul
          </button>
        )}
      </section>

      {/* Isolated from the actions above, so it is never the next thing a thumb finds. */}
      <section style={{ marginTop: 'var(--space-6)' }}>
        <button
          type="button"
          className="ds-btn ds-btn--danger ds-btn--block"
          onClick={handleDelete}
        >
          <Trash2 style={{ width: 18, height: 18 }} aria-hidden="true" />
          Delete haul
        </button>
      </section>
    </div>
  );
}
