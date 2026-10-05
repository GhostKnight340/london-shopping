import { useState } from 'react';
import type { Place } from '../types';
import { useStore } from '../store';
import { ChevronLeft } from 'lucide-react';

interface EditPlaceProps {
  place: Place;
  onBack: () => void;
}

export default function EditPlace({ place, onBack }: EditPlaceProps) {
  const { updatePlace } = useStore();
  const [name, setName] = useState(place.name);
  const [address, setAddress] = useState(place.address || '');
  const [area, setArea] = useState(place.area || '');
  const [mapsUrl, setMapsUrl] = useState(place.mapsUrl || '');
  const [notes, setNotes] = useState(place.notes || '');

  const handleSave = async () => {
    await updatePlace({
      ...place,
      name,
      address,
      area,
      mapsUrl,
      notes,
    });
    onBack();
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Place</h1>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Area / Neighborhood
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Google Maps URL
          </label>
          <input
            type="url"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
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
          />
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
