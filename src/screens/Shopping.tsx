import { useState } from 'react';
import { useStore } from '../store';
import type { ShoppingGoal } from '../types';
import { Plus } from 'lucide-react';
import HaulDetail from '../components/HaulDetail';
import ItemDetail from '../components/ItemDetail';
import CreateGoal from '../components/CreateGoal';

interface ShoppingProps {
  onNavigate: (screen: 'home' | 'shopping' | 'places' | 'bought' | 'settings') => void;
}

export default function Shopping({ onNavigate }: ShoppingProps) {
  const { goals } = useStore();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selectedGoalData = selectedGoal ? goals.find(g => g.id === selectedGoal) : null;

  if (selectedGoalData) {
    return selectedGoalData.type === 'HAUL' ? (
      <HaulDetail
        haul={selectedGoalData as ShoppingGoal}
        onBack={() => setSelectedGoal(null)}
      />
    ) : (
      <ItemDetail
        item={selectedGoalData as ShoppingGoal}
        onBack={() => setSelectedGoal(null)}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateGoal
        onBack={() => setShowCreate(false)}
        onNavigate={onNavigate}
      />
    );
  }

  const sortedGoals = [...goals].sort((a, b) => {
    // Not completed first
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    return b.createdAt - a.createdAt;
  });

  const hauls = sortedGoals.filter(g => g.type === 'HAUL');
  const items = sortedGoals.filter(g => g.type === 'ITEM');

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shopping</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary btn-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Goal</span>
        </button>
      </div>

      {/* Hauls */}
      {hauls.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Hauls ({hauls.length})
          </h2>
          <div className="space-y-2">
            {hauls.map(haul => (
              <button
                key={haul.id}
                onClick={() => setSelectedGoal(haul.id)}
                className="w-full card hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{haul.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {haul.status === 'completed' && '✓ Completed'}
                      {haul.status === 'in-progress' && '◐ In progress'}
                      {haul.status === 'not-started' && '○ Not started'}
                      {haul.status === 'skipped' && '✗ Skipped'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    £{haul.actualCost.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Items ({items.length})
          </h2>
          <div className="space-y-2">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedGoal(item.id)}
                className="w-full card hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.priority === 'must-buy' && '🔴 Must buy'}
                        {item.priority === 'want' && '🟡 Want'}
                        {item.priority === 'maybe' && '⚪ Maybe'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.status === 'bought' && '✓ Bought'}
                        {item.status === 'found' && '◐ Found'}
                        {item.status === 'want' && '○ Want'}
                        {item.status === 'skipped' && '✗ Skipped'}
                      </span>
                    </div>
                  </div>
                  {item.estimatedCost && (
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2">
                      £{item.estimatedCost.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {sortedGoals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No shopping goals yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            Create your first goal
          </button>
        </div>
      )}
    </div>
  );
}
