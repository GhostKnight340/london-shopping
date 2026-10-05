import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store';
import type { ShoppingGoal } from '../types';
import { isDone } from '../utils';
import { scrollToTop, useBackGuard } from '../useBackGuard';
import GoalCard from '../components/GoalCard';
import HaulDetail from '../components/HaulDetail';
import ItemDetail from '../components/ItemDetail';
import CreateGoal from '../components/CreateGoal';

interface ShoppingProps {
  initialGoalId?: string | null;
  onConsumeInitialGoal?: () => void;
}

export default function Shopping({ initialGoalId, onConsumeInitialGoal }: ShoppingProps) {
  const { trip, goals } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const currency = trip?.currency || 'GBP';
  const selected = selectedId ? goals.find((g) => g.id === selectedId) : null;

  // Opened from another screen (a haul card on Home).
  useEffect(() => {
    if (initialGoalId) {
      setSelectedId(initialGoalId);
      onConsumeInitialGoal?.();
    }
  }, [initialGoalId, onConsumeInitialGoal]);

  // The device back gesture closes the open view instead of leaving the app.
  useBackGuard(Boolean(selected), () => setSelectedId(null));
  useBackGuard(creating, () => setCreating(false));

  const open = (id: string) => {
    setSelectedId(id);
    scrollToTop();
  };

  const close = () => {
    setSelectedId(null);
    scrollToTop();
  };

  if (selected) {
    return selected.type === 'HAUL' ? (
      <HaulDetail haul={selected as ShoppingGoal} onBack={close} />
    ) : (
      <ItemDetail item={selected as ShoppingGoal} onBack={close} />
    );
  }

  if (creating) {
    return (
      <CreateGoal
        onBack={() => {
          setCreating(false);
          scrollToTop();
        }}
        onCreated={(id) => {
          setCreating(false);
          open(id);
        }}
      />
    );
  }

  const sorted = [...goals].sort((a, b) => {
    if (isDone(a) !== isDone(b)) return isDone(a) ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const hauls = sorted.filter((g) => g.type === 'HAUL');
  const items = sorted.filter((g) => g.type === 'ITEM');

  return (
    <div className="ds-screen">
      <header className="flex items-center justify-between gap-3">
        <h1 className="ds-display">Shopping</h1>
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--sm"
          onClick={() => {
            setCreating(true);
            scrollToTop();
          }}
        >
          <Plus style={{ width: 18, height: 18 }} aria-hidden="true" />
          Add goal
        </button>
      </header>

      {hauls.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="ds-eyebrow">Hauls · {hauls.length}</h2>
          <div className="flex flex-col gap-2">
            {hauls.map((haul) => (
              <GoalCard
                key={haul.id}
                goal={haul}
                currency={currency}
                onOpen={() => open(haul.id)}
              />
            ))}
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="ds-eyebrow">Items · {items.length}</h2>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <GoalCard
                key={item.id}
                goal={item}
                currency={currency}
                onOpen={() => open(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {sorted.length === 0 && (
        <div className="ds-empty">
          <p className="ds-body ds-muted">
            Nothing in the plan yet. A haul is a shop to browse; an item is one
            thing to find.
          </p>
          <button
            type="button"
            className="ds-btn ds-btn--primary"
            onClick={() => setCreating(true)}
          >
            Add your first goal
          </button>
        </div>
      )}
    </div>
  );
}
