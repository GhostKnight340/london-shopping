import { useStore } from '../store';
import { getDaysRemaining, getUrgencyMessage, formatCurrency } from '../utils';
import HaulCard from '../components/HaulCard';
import { Plus } from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: 'home' | 'shopping' | 'places' | 'bought' | 'settings') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { trip, goals } = useStore();

  if (!trip) return null;

  const daysRemaining = getDaysRemaining(trip.departureDate);
  const urgencyMessage = getUrgencyMessage(daysRemaining);

  const hauls = goals.filter(g => g.type === 'HAUL').sort((a, b) => {
    // Not completed first, then by creation date
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    return b.createdAt - a.createdAt;
  });

  const completedCount = hauls.filter(h => h.status === 'completed').length;
  const totalSpent = hauls.reduce((sum, h) => sum + h.actualCost, 0);
  const estimatedTotal = hauls.reduce((sum, h) => sum + (h.estimatedCost || 0), 0);

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          Trip
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {urgencyMessage}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card">
          <p className="text-sm text-slate-600 dark:text-slate-400">Goals</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {completedCount}/{hauls.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 dark:text-slate-400">Spent</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalSpent, trip.currency)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 dark:text-slate-400">Estimated</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(estimatedTotal, trip.currency)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 dark:text-slate-400">Days Left</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{daysRemaining}</p>
        </div>
      </div>

      {/* Hauls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shopping Goals</h2>
          <button
            onClick={() => onNavigate('shopping')}
            className="btn-secondary btn-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        <div className="space-y-3">
          {hauls.map((haul, index) => (
            <HaulCard
              key={haul.id}
              haul={haul}
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {hauls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No shopping goals yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
