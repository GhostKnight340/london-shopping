import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import type { Transaction } from '../types';
import { useStore } from '../store';
import { compareToEstimate, formatCurrency, formatDate, parseAmount, tapFeedback } from '../utils';
import AnimatedMoney from './AnimatedMoney';
import MoneyInput from './MoneyInput';
import { useToast } from './Toast';

interface SpendingTrackerProps {
  goalId: string;
  actualCost: number;
  estimatedCost?: number;
  transactions: Transaction[];
  currency: string;
}

const QUICK_AMOUNTS = [5, 10, 20];

export default function SpendingTracker({
  goalId,
  actualCost,
  estimatedCost,
  transactions,
  currency,
}: SpendingTrackerProps) {
  const { addTransaction, removeTransaction } = useStore();
  const { toast } = useToast();
  const [custom, setCustom] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const parsed = parseAmount(custom);
  const estimate = compareToEstimate(actualCost, estimatedCost, currency);

  /** Every add is acknowledged and reversible — no confirm, no silent write. */
  const add = async (amount: number, notes?: string) => {
    tapFeedback();
    await addTransaction(goalId, amount, notes);
    const latest = useStore
      .getState()
      .goals.find((g) => g.id === goalId)
      ?.transactions.at(-1);

    toast(`Added ${formatCurrency(amount, currency)}`, () => {
      if (latest) void removeTransaction(goalId, latest.id);
    });
  };

  const remove = async (transaction: Transaction) => {
    await removeTransaction(goalId, transaction.id);
    // Undo re-adds the amount and its note. The timestamp becomes "now" — the
    // alternative was a blocking confirm on a reversible action.
    toast(`Removed ${formatCurrency(transaction.amount, currency)}`, () => {
      void addTransaction(goalId, transaction.amount, transaction.notes);
    });
  };

  return (
    <div className="ds-card flex flex-col gap-4">
      <div>
        <p className="ds-eyebrow">Spent</p>
        <p className="mt-1">
          <AnimatedMoney value={actualCost} currency={currency} />
        </p>
        {estimate && (
          <p
            className="ds-caption ds-num mt-1 font-semibold"
            style={{ color: estimate.tone === 'danger' ? 'var(--danger)' : 'var(--ink-muted)' }}
          >
            {estimate.text}
          </p>
        )}
      </div>

      <div>
        <p className="ds-eyebrow mb-2">Quick add</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className="ds-chip"
              onClick={() => void add(amount)}
            >
              +{formatCurrency(amount, currency).replace(/\.00$/, '')}
            </button>
          ))}
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor={`amount-${goalId}`}>
          Other amount
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <MoneyInput
              id={`amount-${goalId}`}
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
        {custom && !parsed && (
          <p className="ds-hint" style={{ color: 'var(--danger)' }}>
            Enter an amount above 0.
          </p>
        )}
      </div>

      {transactions.length > 0 && (
        <div>
          <hr className="ds-divider mb-3" />
          <button
            type="button"
            className="ds-row justify-between"
            style={{ padding: 0, minHeight: 'var(--tap-min)', background: 'transparent' }}
            onClick={() => setShowHistory((v) => !v)}
            aria-expanded={showHistory}
          >
            <span className="ds-body-sm font-semibold">
              {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
            </span>
            {showHistory ? (
              <ChevronUp style={{ width: 18, height: 18 }} aria-hidden="true" />
            ) : (
              <ChevronDown style={{ width: 18, height: 18 }} aria-hidden="true" />
            )}
          </button>

          {showHistory && (
            <ul className="flex flex-col gap-1 mt-2 list-none p-0 m-0">
              {[...transactions].reverse().map((transaction) => (
                <li key={transaction.id} className="flex items-center gap-2 ds-inset">
                  <span className="flex-1 min-w-0">
                    <span className="ds-money-sm block">
                      {formatCurrency(transaction.amount, currency)}
                    </span>
                    <span className="ds-caption ds-subtle block">
                      {formatDate(transaction.timestamp)}
                      {transaction.notes ? ` · ${transaction.notes}` : ''}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="ds-icon-btn"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => void remove(transaction)}
                    aria-label={`Remove ${formatCurrency(transaction.amount, currency)}`}
                  >
                    <Trash2 style={{ width: 18, height: 18 }} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
