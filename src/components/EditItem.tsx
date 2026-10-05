import { useState } from 'react';
import type { ShoppingGoal } from '../types';
import { useStore } from '../store';
import { ChevronLeft } from 'lucide-react';

interface EditItemProps {
  item: ShoppingGoal;
  onBack: () => void;
}

export default function EditItem({ item, onBack }: EditItemProps) {
  const { places, updateGoal, updateGoalPlaces } = useStore();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [estimatedCost, setEstimatedCost] = useState(item.estimatedCost?.toString() || '');
  const [priority, setPriority] = useState(item.priority || 'want');
  const [quantity, setQuantity] = useState(item.quantity?.toString() || '1');
  const [url, setUrl] = useState(item.url || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(
    new Set(item.places || [])
  );

  const handleSave = async () => {
    await updateGoal({
      ...item,
      title,
      description,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      priority: priority as ShoppingGoal['priority'],
      quantity: quantity ? parseInt(quantity) : 1,
      url,
      notes,
    });
    await updateGoalPlaces(item.id, Array.from(selectedPlaces));
    onBack();
  };

  const togglePlace = (placeId: string) => {
    const newSet = new Set(selectedPlaces);
    if (newSet.has(placeId)) {
      newSet.delete(placeId);
    } else {
      newSet.add(placeId);
    }
    setSelectedPlaces(newSet);
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 pb-32">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Item</h1>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="must-buy">🔴 Must Buy</option>
              <option value="want">🟡 Want</option>
              <option value="maybe">⚪ Maybe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Estimated Price (£)
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

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            URL / Link
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            placeholder="Details, colors, sizes..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
            Where to Buy
          </label>
          <div className="space-y-2">
            {places.map(place => (
              <label key={place.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlaces.has(place.id)}
                  onChange={() => togglePlace(place.id)}
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:relative sm:border-t-0">
        <button
          onClick={handleSave}
          className="w-full btn-primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
