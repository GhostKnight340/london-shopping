import { useState } from 'react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import { getCategoryProgress } from '../utils';
import { ChevronLeft, Edit2, Trash2, MapPin } from 'lucide-react';
import SpendingTracker from './SpendingTracker';
import ShoppingMode from './ShoppingMode';
import EditHaul from './EditHaul';

interface HaulDetailProps {
  haul: ShoppingGoal;
  onBack: () => void;
}

export default function HaulDetail({ haul, onBack }: HaulDetailProps) {
  const { trip, places, toggleCategory, updateGoalStatus, deleteGoal } = useStore();
  const [shoppingMode, setShoppingMode] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const progress = getCategoryProgress(haul.categories);

  const haulPlaces = haul.places?.map(pid => places.find(p => p.id === pid)).filter(Boolean) || [];

  const handleDelete = () => {
    if (confirm('Delete this haul? This cannot be undone.')) {
      deleteGoal(haul.id);
      onBack();
    }
  };

  if (showEdit) {
    return <EditHaul haul={haul} onBack={() => setShowEdit(false)} />;
  }

  if (shoppingMode) {
    return (
      <ShoppingMode
        haul={haul}
        onExit={() => setShoppingMode(false)}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex-1">{haul.title}</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      {/* Description & Status */}
      <div className="space-y-3">
        {haul.description && (
          <p className="text-slate-600 dark:text-slate-400">{haul.description}</p>
        )}
        <div className="flex items-center gap-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(haul.status)}`}>
            {haul.status === 'completed' && '✓ Completed'}
            {haul.status === 'in-progress' && '◐ In progress'}
            {haul.status === 'not-started' && '○ Not started'}
            {haul.status === 'skipped' && '✗ Skipped'}
          </span>
        </div>
      </div>

      {/* Places */}
      {haulPlaces.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Places</h3>
          <div className="space-y-2">
            {haulPlaces.map(place => (
              <div
                key={place?.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{place?.name}</p>
                    {place?.area && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">{place.area}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {haul.categories && haul.categories.length > 0 && (
        <div className="card space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Coverage</h3>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-2">
            {haul.categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(haul.id, category.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  category.completed
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {category.completed && '✓'}
                </div>
                <span className={`flex-1 font-medium ${
                  category.completed
                    ? 'text-slate-500 dark:text-slate-500 line-through'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spending */}
      <SpendingTracker
        goalId={haul.id}
        actualCost={haul.actualCost}
        estimatedCost={haul.estimatedCost}
        transactions={haul.transactions}
        currency={trip?.currency || 'GBP'}
      />

      {/* Notes */}
      {haul.notes && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notes</h3>
          <p className="text-slate-600 dark:text-slate-400">{haul.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-4">
        {haul.status !== 'completed' && (
          <button
            onClick={() => setShoppingMode(true)}
            className="w-full btn-primary"
          >
            Enter Shopping Mode
          </button>
        )}

        {haul.status === 'not-started' && (
          <button
            onClick={() => updateGoalStatus(haul.id, 'in-progress')}
            className="w-full btn-secondary"
          >
            Mark as In Progress
          </button>
        )}

        {haul.status === 'in-progress' && (
          <button
            onClick={() => updateGoalStatus(haul.id, 'completed')}
            className="w-full btn-secondary"
          >
            Mark as Completed
          </button>
        )}

        <button
          onClick={handleDelete}
          className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Haul
        </button>
      </div>
    </div>
  );
}
