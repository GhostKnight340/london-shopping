import { Plus } from 'lucide-react';
import type { Screen } from '../App';
import { useStore } from '../store';
import {
  formatCurrency,
  getDaysRemaining,
  getUrgencyMessage,
  isDone,
  isUrgent,
} from '../utils';
import GoalCard from '../components/GoalCard';
import StatTile from '../components/StatTile';

interface HomeProps {
  onNavigate: (screen: Screen, goalId?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { trip, goals } = useStore();

  if (!trip) return null;

  const currency = trip.currency || 'GBP';
  const daysRemaining = getDaysRemaining(trip.departureDate);
  const urgent = isUrgent(daysRemaining);

  const hauls = goals.filter((g) => g.type === 'HAUL');
  const items = goals.filter((g) => g.type === 'ITEM');

  const openHauls = [...hauls].sort((a, b) => {
    if (isDone(a) !== isDone(b)) return isDone(a) ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const totalSpent = goals.reduce((sum, g) => sum + g.actualCost, 0);
  const planned = goals.reduce((sum, g) => sum + (g.estimatedCost || 0), 0);

  return (
    <div className="ds-screen">
      {/* The title is a label; the number below it is what the screen is for. */}
      <header>
        <h1 className="ds-display">Trip</h1>
        <p
          className="ds-body mt-1"
          style={{ color: urgent ? 'var(--warn)' : 'var(--ink-muted)' }}
        >
          {getUrgencyMessage(daysRemaining)} in {trip.location || 'London'}
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <StatTile
          lead
          label="Spent so far"
          value={formatCurrency(totalSpent, currency)}
          sub={planned > 0 ? `of ${formatCurrency(planned, currency)} planned` : undefined}
        />

        <div className="grid grid-cols-3 gap-2">
          <StatTile
            label="Days left"
            value={daysRemaining < 0 ? '—' : daysRemaining}
            tone={urgent ? 'warn' : 'default'}
          />
          <StatTile label="Hauls" value={`${hauls.filter(isDone).length}/${hauls.length}`} />
          <StatTile label="Items" value={`${items.filter(isDone).length}/${items.length}`} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="ds-heading">Hauls</h2>
          {/* Full label on mobile too: this is the way into the create flow, so
              it should not be the smallest target on the screen. */}
          <button
            type="button"
            className="ds-btn ds-btn--secondary ds-btn--sm"
            onClick={() => onNavigate('shopping')}
          >
            <Plus style={{ width: 18, height: 18 }} aria-hidden="true" />
            Add
          </button>
        </div>

        {openHauls.length > 0 ? (
          <div className="flex flex-col gap-2">
            {openHauls.map((haul) => (
              <GoalCard
                key={haul.id}
                goal={haul}
                currency={currency}
                onOpen={() => onNavigate('shopping', haul.id)}
              />
            ))}
          </div>
        ) : (
          <div className="ds-empty">
            <p className="ds-body ds-muted">Nothing planned yet.</p>
            <button
              type="button"
              className="ds-btn ds-btn--primary"
              onClick={() => onNavigate('shopping')}
            >
              Add your first haul
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
