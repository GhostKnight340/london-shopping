import { useState } from 'react';
import type { Transaction } from '../types';
import { useStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface SpendingTrackerProps {
  goalId: string;
  actualCost: number;
  estimatedCost?: number;
  transactions: Transaction[];
  currency: string;
}

export default function SpendingTracker({
  goalId,
  actualCost,
  estimatedCost,
  transactions,
  currency,
}: SpendingTrackerProps) {
  const { addTransaction, removeTransaction } = useStore();
  const [customAmount, setCustomAmount] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const quickAmounts = [5, 10, 20];

  const handleQuickAdd = async (amount: number) => {
    await addTransaction(goalId, amount);
  };

  const handleCustomAdd = async () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      await addTransaction(goalId, amount);
      setCustomAmount('');
    }
  };

  const handleRemoveTransaction = async (transactionId: string) => {
    if (confirm('Remove this transaction?')) {
      await removeTransaction(goalId, transactionId);
    }
  };

  const difference = estimatedCost ? actualCost - estimatedCost : 0;
  const overspent = difference > 0;

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Spending</h3>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Actual</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(actualCost, currency)}
            </p>
          </div>
          {estimatedCost && (
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Estimated
              </p>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(estimatedCost, currency)}
                </p>
                <p className={`text-xs font-medium mt-1 ${
                  overspent ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {overspent ? '+' : '-'}{formatCurrency(Math.abs(difference), currency)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Quick Add</p>
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => handleQuickAdd(amount)}
              className="py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold transition-colors active:scale-95"
            >
              +£{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Custom Amount</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">£</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
          </div>
          <button
            onClick={handleCustomAdd}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-left"
          >
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Transaction History ({transactions.length})
            </p>
            {showHistory ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2">
              {[...transactions].reverse().map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(transaction.timestamp)}
                    </p>
                    {transaction.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveTransaction(transaction.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
