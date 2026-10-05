import { useStore } from '../store';
import { formatCurrency, formatDate } from '../utils';

export default function Bought() {
  const { trip, goals } = useStore();

  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalSpent = completedGoals.reduce((sum, g) => sum + g.actualCost, 0);

  const hauls = completedGoals.filter(g => g.type === 'HAUL');
  const items = completedGoals.filter(g => g.type === 'ITEM');

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Completed</h1>
        <p className="text-slate-600 dark:text-slate-400">Your shopping achievements</p>
      </div>

      {/* Total Spent */}
      {completedGoals.length > 0 && (
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total London Spend</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalSpent, trip?.currency || 'GBP')}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            {completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      )}

      {/* Hauls */}
      {hauls.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Completed Hauls ({hauls.length})
          </h2>
          <div className="space-y-2">
            {hauls.map(haul => (
              <div
                key={haul.id}
                className="card hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{haul.title}</h3>
                    {haul.completedAt && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {formatDate(haul.completedAt)}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(haul.actualCost, trip?.currency || 'GBP')}
                  </span>
                </div>
                {haul.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{haul.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Bought Items ({items.length})
          </h2>
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className="card hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    {item.completedAt && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {formatDate(item.completedAt)}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(item.actualCost, trip?.currency || 'GBP')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedGoals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No completed goals yet. Start shopping!
          </p>
        </div>
      )}
    </div>
  );
}
