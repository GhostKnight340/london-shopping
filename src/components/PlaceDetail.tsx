import { useState } from 'react';
import type { Place } from '../types';
import { useStore } from '../store';
import { ChevronLeft, MapPin, Edit2, Trash2, ExternalLink } from 'lucide-react';
import EditPlace from './EditPlace';
import { openMapsUrl } from '../utils';

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
}

export default function PlaceDetail({ place, onBack }: PlaceDetailProps) {
  const { goals, deletePlace } = useStore();
  const [showEdit, setShowEdit] = useState(false);

  const associatedGoals = goals.filter(g => g.places?.includes(place.id));

  const handleDelete = () => {
    if (confirm('Delete this place? Goals associated with it will not be deleted.')) {
      deletePlace(place.id);
      onBack();
    }
  };

  if (showEdit) {
    return <EditPlace place={place} onBack={() => setShowEdit(false)} />;
  }

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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex-1">{place.name}</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      {/* Location Info */}
      <div className="card space-y-3">
        {place.address && (
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Address</p>
              <p className="font-medium text-slate-900 dark:text-white">{place.address}</p>
            </div>
          </div>
        )}

        {place.area && (
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Area / Neighborhood</p>
            <p className="font-medium text-slate-900 dark:text-white">{place.area}</p>
          </div>
        )}

        {place.mapsUrl && (
          <button
            onClick={() => openMapsUrl(place.mapsUrl, place.name)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </button>
        )}
      </div>

      {/* Notes */}
      {place.notes && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notes</h3>
          <p className="text-slate-600 dark:text-slate-400">{place.notes}</p>
        </div>
      )}

      {/* Associated Goals */}
      {associatedGoals.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">
            Associated Goals ({associatedGoals.length})
          </h3>
          <div className="space-y-2">
            {associatedGoals.map(goal => (
              <div
                key={goal.id}
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <p className="font-medium text-slate-900 dark:text-white">{goal.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {goal.type === 'HAUL' ? '🛍️ Haul' : '📦 Item'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Place
      </button>
    </div>
  );
}
