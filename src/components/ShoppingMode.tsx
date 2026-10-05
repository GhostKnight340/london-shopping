import { useState } from 'react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { X } from 'lucide-react';

interface ShoppingModeProps {
  haul: ShoppingGoal;
  onExit: () => void;
}

export default function ShoppingMode({ haul, onExit }: ShoppingModeProps) {
  const { trip, toggleCategory, updateGoalStatus, addTransaction } = useStore();
  const [customAmount, setCustomAmount] = useState('');

  const quickAmounts = [5, 10, 20];

  const handleQuickAdd = async (amount: number) => {
    await addTransaction(haul.id, amount);
  };

  const handleCustomAdd = async () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      await addTransaction(haul.id, amount);
      setCustomAmount('');
    }
  };

  const handleComplete = async () => {
    await updateGoalStatus(haul.id, 'completed');
    onExit();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 dark:bg-slate-950 z-50 flex flex-col text-white">
      {/* Top Bar */}
      <div className="bg-blue-600 dark:bg-blue-700 p-4 flex items-center justify-between sticky top-0">
        <div>
          <h2 className="text-xl font-bold">{haul.title}</h2>
          <p className="text-sm text-blue-100">Shopping Mode</p>
        </div>
        <button
          onClick={onExit}
          className="p-2 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Categories */}
        {haul.categories && haul.categories.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-200">Coverage</h3>
            {haul.categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(haul.id, category.id)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 transition-colors text-left"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  category.completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-slate-600'
                }`}>
                  {category.completed && '✓'}
                </div>
                <span className={`flex-1 text-lg font-semibold ${
                  category.completed ? 'text-slate-400 line-through' : 'text-white'
                }`}>
                  {category.title}
                </span>
                <span className="text-sm text-slate-400">
                  {category.completed ? '✓' : '○'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Spending */}
        <div className="space-y-3 bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-lg font-bold">Current Spend</h3>
          <p className="text-4xl font-bold text-blue-400">
            {formatCurrency(haul.actualCost, trip?.currency || 'GBP')}
          </p>

          <div className="space-y-2 pt-2">
            <p className="text-sm text-slate-400">Quick Add</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => handleQuickAdd(amount)}
                  className="py-3 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-bold transition-colors text-base"
                >
                  +£{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm text-slate-400">Custom Amount</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-6 pr-3 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  step="0.01"
                />
              </div>
              <button
                onClick={handleCustomAdd}
                disabled={!customAmount || parseFloat(customAmount) <= 0}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions - Sticky */}
      <div className="sticky bottom-0 bg-slate-800/95 border-t border-slate-700 p-4 space-y-2">
        <button
          onClick={handleComplete}
          className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-bold text-lg transition-colors"
        >
          ✓ Mark as Complete
        </button>
        <button
          onClick={onExit}
          className="w-full py-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-xl font-bold text-lg transition-colors"
        >
          Exit Shopping Mode
        </button>
      </div>
    </div>
  );
}
