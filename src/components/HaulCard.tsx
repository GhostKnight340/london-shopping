import type { ShoppingGoal } from '../types';
import { getCategoryProgress, getHaulColor, getHaulEmoji, formatCurrency } from '../utils';
import { ChevronRight } from 'lucide-react';

interface HaulCardProps {
  haul: ShoppingGoal;
  index: number;
  onNavigate: (screen: 'home' | 'shopping' | 'places' | 'bought' | 'settings') => void;
}

export default function HaulCard({ haul, index, onNavigate }: HaulCardProps) {
  const progress = getCategoryProgress(haul.categories);
  const color = getHaulColor(index);
  const emoji = getHaulEmoji(index);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'skipped':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <button
      onClick={() => onNavigate('shopping')}
      className={`w-full text-left card hover:shadow-md transition-all active:scale-95 ring-2 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700 ${color.bg}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{emoji}</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{haul.title}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{haul.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(haul.status)}`}>
          {getStatusLabel(haul.status)}
        </span>
      </div>

      {/* Progress */}
      {haul.categories && haul.categories.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{progress.completed}/{progress.total}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Spending */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Spent</p>
          <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(haul.actualCost)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-600 dark:text-slate-400">Estimated</p>
          <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(haul.estimatedCost || 0)}</p>
        </div>
      </div>
    </button>
  );
}
