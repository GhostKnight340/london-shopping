import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import {
  compareToEstimate,
  formatCurrency,
  getCategoryProgress,
  parseAmount,
  tapFeedback,
} from '../utils';
import AnimatedMoney from './AnimatedMoney';
import MoneyInput from './MoneyInput';
import ProgressBar from './ProgressBar';
import { useToast } from './Toast';
import { useBackGuard } from '../useBackGuard';

interface ShoppingModeProps {
  haul: ShoppingGoal;
  onExit: () => void;
}

const QUICK_AMOUNTS = [5, 10, 20];

/**
 * In-store mode. Biggest number, biggest targets, nothing else on screen.
 * It is a takeover, so it carries both safe-area insets itself — the old one
 * put its action bar under the home indicator.
 */
export default function ShoppingMode({ haul, onExit }: ShoppingModeProps) {
  const { trip, toggleCategory, updateGoalStatus, addTransaction, removeTransaction } = useStore();
  const { toast } = useToast();
  const [custom, setCustom] = useState('');

  const currency = trip?.currency || 'GBP';
  const progress = getCategoryProgress(haul.categories);
  const estimate = compareToEstimate(haul.actualCost, haul.estimatedCost, currency);
  const parsed = parseAmount(custom);

  useBackGuard(true, onExit);

  const add = async (amount: number) => {
    tapFeedback();
    await addTransaction(haul.id, amount);
    const latest = useStore
      .getState()
      .goals.find((g) => g.id === haul.id)
      ?.transactions.at(-1);
    toast(`Added ${formatCurrency(amount, currency)}`, () => {
      if (latest) void removeTransaction(haul.id, latest.id);
    });
  };

  const complete = async () => {
    await updateGoalStatus(haul.id, 'completed');
    onExit();
  };

  return (
    <div className="ds-takeover">
      <header
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: 'var(--surface-raised)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex-1 min-w-0">
          <p className="ds-eyebrow">In store</p>
          <h2 className="ds-title truncate">{haul.title}</h2>
        </div>
        <button type="button" className="ds-icon-btn" onClick={onExit} aria-label="Close in-store mode">
          <X style={{ width: 24, height: 24 }} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
          <section className="ds-card">
            <p className="ds-eyebrow">Spent here</p>
            <p className="mt-1">
              <AnimatedMoney value={haul.actualCost} currency={currency} />
            </p>
            {estimate && (
              <p
                className="ds-caption ds-num mt-1 font-semibold"
                style={{ color: estimate.tone === 'danger' ? 'var(--danger)' : 'var(--ink-muted)' }}
              >
                {estimate.text}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 mt-4">
              {QUICK_AMOUNTS.map((amount) => (
                <button key={amount} type="button" className="ds-chip" onClick={() => void add(amount)}>
                  +{formatCurrency(amount, currency).replace(/\.00$/, '')}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <MoneyInput
                  value={custom}
                  onChange={setCustom}
                  currency={currency}
                  onEnter={() => {
                    if (parsed) {
                      void add(parsed);
                      setCustom('');
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="ds-btn ds-btn--primary"
                disabled={!parsed}
                onClick={() => {
                  if (!parsed) return;
                  void add(parsed);
                  setCustom('');
                }}
              >
                Add
              </button>
            </div>
          </section>

          {haul.categories && haul.categories.length > 0 && (
            <section className="flex flex-col gap-2">
              <ProgressBar completed={progress.completed} total={progress.total} />
              {haul.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="ds-row shadow-card"
                  style={{ minHeight: 'var(--control-lg)' }}
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
                  <span className="ds-body font-semibold flex-1">{category.title}</span>
                  <span className="ds-caption ds-muted">
                    {category.completed ? 'Covered' : 'To do'}
                  </span>
                </button>
              ))}
            </section>
          )}
        </div>
      </div>

      <div className="ds-actionbar ds-actionbar--static">
        <button type="button" className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block" onClick={() => void complete()}>
          Mark haul complete
        </button>
        <button type="button" className="ds-btn ds-btn--secondary ds-btn--block" onClick={onExit}>
          Keep shopping
        </button>
      </div>
    </div>
  );
}
