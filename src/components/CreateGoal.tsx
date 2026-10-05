import { useState } from 'react';
import { useStore } from '../store';
import type { ShoppingGoal, HaulCategory } from '../types';
import { ChevronLeft } from 'lucide-react';

interface CreateGoalProps {
  onBack: () => void;
  onNavigate: (screen: 'home' | 'shopping' | 'places' | 'bought' | 'settings') => void;
}

export default function CreateGoal({ onBack, onNavigate }: CreateGoalProps) {
  const { trip, places, createGoal } = useStore();
  const [type, setType] = useState<'HAUL' | 'ITEM' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [priority, setPriority] = useState('want');
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>(['', '', '', '']);
  const [notes, setNotes] = useState('');

  if (!trip) return null;

  if (!type) {
    return (
      <div className="w-full p-4 sm:p-6 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Goal</h1>
        <p className="text-slate-600 dark:text-slate-400">What would you like to add?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setType('HAUL')}
            className="card hover:shadow-lg transition-all p-6 text-center"
          >
            <div className="text-4xl mb-3">🛍️</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Haul</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A browsing mission with categories (e.g., "Japan Centre")
            </p>
          </button>

          <button
            onClick={() => setType('ITEM')}
            className="card hover:shadow-lg transition-all p-6 text-center"
          >
            <div className="text-4xl mb-3">📦</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Item</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A specific product you want (e.g., "Blue shirt")
            </p>
          </button>
        </div>

        <button
          onClick={onBack}
          className="btn-secondary w-full"
        >
          Cancel
        </button>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!title.trim()) return;

    const now = Date.now();
    const goal: ShoppingGoal = {
      id: `goal-${now}`,
      tripId: trip.id,
      type,
      title,
      description,
      status: 'not-started',
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      actualCost: 0,
      transactions: [],
      places: Array.from(selectedPlaces),
      notes,
      createdAt: now,
      updatedAt: now,
    };

    if (type === 'HAUL') {
      const haulCategories: HaulCategory[] = categories
        .filter(c => c.trim())
        .map((title, idx) => ({
          id: `cat-${now}-${idx}`,
          title,
          completed: false,
        }));
      goal.categories = haulCategories;
    } else {
      goal.priority = priority as ShoppingGoal['priority'];
    }

    await createGoal(goal);
    onNavigate('home');
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 pb-32">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setType(null)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create {type === 'HAUL' ? 'Haul' : 'Item'}
        </h1>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'HAUL' ? 'e.g., Japan Centre Haul' : 'e.g., Blue shirt'}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Estimated Cost (£)
          </label>
          <input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {type === 'ITEM' && (
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="must-buy">🔴 Must Buy</option>
              <option value="want">🟡 Want</option>
              <option value="maybe">⚪ Maybe</option>
            </select>
          </div>
        )}

        {type === 'HAUL' && (
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
              Categories
            </label>
            <div className="space-y-2">
              {categories.map((category, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={category}
                  onChange={(e) => {
                    const newCategories = [...categories];
                    newCategories[idx] = e.target.value;
                    setCategories(newCategories);
                  }}
                  placeholder={`Category ${idx + 1}`}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
            Associated Places
          </label>
          <div className="space-y-2">
            {places.map(place => (
              <label key={place.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlaces.has(place.id)}
                  onChange={() => {
                    const newSet = new Set(selectedPlaces);
                    if (newSet.has(place.id)) {
                      newSet.delete(place.id);
                    } else {
                      newSet.add(place.id);
                    }
                    setSelectedPlaces(newSet);
                  }}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-blue-600"
                />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{place.name}</p>
                  {place.area && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">{place.area}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            placeholder={type === 'HAUL' ? 'Examples to look for...' : 'Details, colors, sizes...'}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:relative sm:border-t-0 space-y-2">
        <button
          onClick={handleCreate}
          disabled={!title.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create {type === 'HAUL' ? 'Haul' : 'Item'}
        </button>
        <button
          onClick={() => setType(null)}
          className="w-full btn-secondary"
        >
          Back
        </button>
      </div>
    </div>
  );
}
