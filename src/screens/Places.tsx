import { useState } from 'react';
import { useStore } from '../store';
import { MapPin, Plus } from 'lucide-react';
import CreatePlace from '../components/CreatePlace';
import PlaceDetail from '../components/PlaceDetail';

export default function Places() {
  const { places, goals } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  if (showCreate) {
    return <CreatePlace onBack={() => setShowCreate(false)} />;
  }

  const selectedPlace = selectedPlaceId ? places.find(p => p.id === selectedPlaceId) : null;
  if (selectedPlace) {
    return <PlaceDetail place={selectedPlace} onBack={() => setSelectedPlaceId(null)} />;
  }

  const sortedPlaces = [...places].sort((a, b) => {
    const aCount = goals.filter(g => g.places?.includes(a.id)).length;
    const bCount = goals.filter(g => g.places?.includes(b.id)).length;
    return bCount - aCount;
  });

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Places</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary btn-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div className="space-y-3">
        {sortedPlaces.map(place => {
          const associatedGoals = goals.filter(g => g.places?.includes(place.id));
          return (
            <button
              key={place.id}
              onClick={() => setSelectedPlaceId(place.id)}
              className="w-full card hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{place.name}</h3>
                    {place.area && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{place.area}</p>
                    )}
                  </div>
                </div>
              </div>

              {associatedGoals.length > 0 && (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {associatedGoals.length} goal{associatedGoals.length !== 1 ? 's' : ''}
                </div>
              )}
            </button>
          );
        })}

        {places.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No places added yet</p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary"
            >
              Add a place
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
