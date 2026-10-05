import { useState } from 'react';
import { ChevronRight, MapPin, Plus } from 'lucide-react';
import { useStore } from '../store';
import { scrollToTop, useBackGuard } from '../useBackGuard';
import CreatePlace from '../components/CreatePlace';
import PlaceDetail from '../components/PlaceDetail';

export default function Places() {
  const { places, goals } = useStore();
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? places.find((p) => p.id === selectedId) : null;

  useBackGuard(Boolean(selected), () => setSelectedId(null));
  useBackGuard(creating, () => setCreating(false));

  if (creating) {
    return (
      <CreatePlace
        onBack={() => {
          setCreating(false);
          scrollToTop();
        }}
      />
    );
  }

  if (selected) {
    return (
      <PlaceDetail
        place={selected}
        onBack={() => {
          setSelectedId(null);
          scrollToTop();
        }}
      />
    );
  }

  const sorted = [...places].sort((a, b) => {
    const count = (id: string) => goals.filter((g) => g.places?.includes(id)).length;
    const diff = count(b.id) - count(a.id);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  return (
    <div className="ds-screen">
      <header className="flex items-center justify-between gap-3">
        <h1 className="ds-display">Places</h1>
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--sm"
          onClick={() => {
            setCreating(true);
            scrollToTop();
          }}
        >
          <Plus style={{ width: 18, height: 18 }} aria-hidden="true" />
          Add place
        </button>
      </header>

      {sorted.length > 0 ? (
        <section className="flex flex-col gap-2">
          {sorted.map((place) => {
            const linked = goals.filter((g) => g.places?.includes(place.id)).length;
            return (
              <button
                key={place.id}
                type="button"
                className="ds-row shadow-card"
                onClick={() => {
                  setSelectedId(place.id);
                  scrollToTop();
                }}
              >
                <MapPin
                  style={{ width: 20, height: 20, color: 'var(--ink-muted)' }}
                  aria-hidden="true"
                />
                <span className="flex-1 min-w-0">
                  <span className="ds-heading block truncate">{place.name}</span>
                  <span className="ds-caption ds-muted block truncate">
                    {[place.area, linked > 0 ? `${linked} goal${linked === 1 ? '' : 's'}` : null]
                      .filter(Boolean)
                      .join(' · ') || 'No area set'}
                  </span>
                </span>
                <ChevronRight
                  style={{ width: 20, height: 20, color: 'var(--ink-subtle)' }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </section>
      ) : (
        <div className="ds-empty">
          <p className="ds-body ds-muted">
            No places yet. Add the shops you plan to visit and you can open them in
            Maps from here.
          </p>
          <button
            type="button"
            className="ds-btn ds-btn--primary"
            onClick={() => setCreating(true)}
          >
            Add a place
          </button>
        </div>
      )}
    </div>
  );
}
