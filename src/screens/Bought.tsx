import { useStore } from '../store';
import { formatCurrency, formatDate, isDone } from '../utils';
import StatTile from '../components/StatTile';

export default function Bought() {
  const { trip, goals } = useStore();
  const currency = trip?.currency || 'GBP';

  const done = goals.filter(isDone);
  const totalSpent = done.reduce((sum, g) => sum + g.actualCost, 0);
  const hauls = done.filter((g) => g.type === 'HAUL');
  const items = done.filter((g) => g.type === 'ITEM');

  const byDate = <T extends { completedAt?: number; createdAt: number }>(list: T[]) =>
    [...list].sort((a, b) => (b.completedAt ?? b.createdAt) - (a.completedAt ?? a.createdAt));

  return (
    <div className="ds-screen">
      <header>
        <h1 className="ds-display">Bought</h1>
        <p className="ds-body ds-muted mt-1">What is finished, and what it cost.</p>
      </header>

      {done.length === 0 ? (
        <div className="ds-empty">
          <p className="ds-body ds-muted">
            Nothing finished yet. Hauls and items land here once you mark them done.
          </p>
        </div>
      ) : (
        <>
          <StatTile
            lead
            label="Total spent"
            value={formatCurrency(totalSpent, currency)}
            sub={`${done.length} ${done.length === 1 ? 'goal' : 'goals'} finished`}
          />

          {hauls.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="ds-eyebrow">Hauls · {hauls.length}</h2>
              <div className="flex flex-col gap-2">
                {byDate(hauls).map((haul) => (
                  <div key={haul.id} className="ds-card">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="ds-heading min-w-0 truncate">{haul.title}</h3>
                      {/* The amount is ink, not green: the pill already says it is done,
                          and green-600 on white was 3.3:1 at this size. */}
                      <span className="ds-money flex-none">
                        {formatCurrency(haul.actualCost, currency)}
                      </span>
                    </div>
                    <p className="ds-caption ds-subtle mt-1">
                      {haul.completedAt ? formatDate(haul.completedAt) : 'Date not recorded'}
                    </p>
                    {haul.notes && <p className="ds-body-sm ds-muted mt-2">{haul.notes}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {items.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="ds-eyebrow">Items · {items.length}</h2>
              <div className="flex flex-col gap-2">
                {byDate(items).map((item) => (
                  <div key={item.id} className="ds-card">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="ds-heading min-w-0 truncate">{item.title}</h3>
                      <span className="ds-money flex-none">
                        {formatCurrency(item.actualCost, currency)}
                      </span>
                    </div>
                    <p className="ds-caption ds-subtle mt-1">
                      {item.completedAt ? formatDate(item.completedAt) : 'Date not recorded'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
