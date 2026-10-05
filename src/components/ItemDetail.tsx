import { useState } from 'react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import SpendingTracker from './SpendingTracker';
import EditItem from './EditItem';

interface ItemDetailProps {
  item: ShoppingGoal;
  onBack: () => void;
}

export default function ItemDetail({ item, onBack }: ItemDetailProps) {
  const { trip, places, updateGoalStatus, deleteGoal } = useStore();
  const [showEdit, setShowEdit] = useState(false);

  const itemPlaces = item.places?.map(pid => places.find(p => p.id === pid)).filter(Boolean) || [];

  const handleDelete = () => {
    if (confirm('Delete this item? This cannot be undone.')) {
      deleteGoal(item.id);
      onBack();
    }
  };

  if (showEdit) {
    return <EditItem item={item} onBack={() => setShowEdit(false)} />;
  }

  const statusOptions = {
    want: { label: 'Want', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    found: { label: 'Found', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    bought: { label: 'Bought', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    skipped: { label: 'Skipped', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  };

  const priorityOptions = {
    'must-buy': { label: '🔴 Must Buy', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
    want: { label: '🟡 Want', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
    maybe: { label: '⚪ Maybe', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex-1">{item.title}</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      {item.image && (
        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Status & Priority */}
      <div className="card space-y-3">
        <div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(statusOptions) as Array<[string, any]>).map(([status, config]) => (
              <button
                key={status}
                onClick={() => updateGoalStatus(item.id, status as ShoppingGoal['status'])}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                  item.status === status
                    ? `${config.color}`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Priority</p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(priorityOptions) as Array<[string, any]>).map(([priority, config]) => (
              <button
                key={priority}
                onClick={() => {
                  // This would need an update to store to change priority
                  // For now, just show the display
                }}
                className={`px-3 py-2 rounded-full text-xs font-medium ${
                  item.priority === priority ? config.color : 'opacity-50'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="card">
          <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
        </div>
      )}

      {/* Places */}
      {itemPlaces.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Preferred Store</h3>
          <div className="space-y-2">
            {itemPlaces.map(place => (
              <div
                key={place?.id}
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <p className="font-medium text-slate-900 dark:text-white">{place?.name}</p>
                {place?.area && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">{place.area}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending */}
      {item.estimatedCost && (
        <SpendingTracker
          goalId={item.id}
          actualCost={item.actualCost}
          estimatedCost={item.estimatedCost}
          transactions={item.transactions}
          currency={trip?.currency || 'GBP'}
        />
      )}

      {/* Notes */}
      {item.notes && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notes</h3>
          <p className="text-slate-600 dark:text-slate-400">{item.notes}</p>
        </div>
      )}

      {/* URL */}
      {item.url && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Reference</h3>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
          >
            {item.url}
          </a>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Item
      </button>
    </div>
  );
}
