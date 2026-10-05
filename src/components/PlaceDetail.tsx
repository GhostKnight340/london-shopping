import { useState } from 'react';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';
import type { Place } from '../types';
import { useStore } from '../store';
import { openMapsUrl } from '../utils';
import { scrollToTop, useBackGuard } from '../useBackGuard';
import ScreenHeader from './ScreenHeader';
import EditPlace from './EditPlace';

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
}

export default function PlaceDetail({ place, onBack }: PlaceDetailProps) {
  const { goals, deletePlace } = useStore();
  const [editing, setEditing] = useState(false);

  const linked = goals.filter((g) => g.places?.includes(place.id));

  useBackGuard(editing, () => setEditing(false));

  if (editing) {
    return (
      <EditPlace
        place={place}
        onBack={() => {
          setEditing(false);
          scrollToTop();
        }}
      />
    );
  }

  const handleDelete = () => {
    const message = linked.length
      ? `Delete "${place.name}"? It will be removed from ${linked.length} ${
          linked.length === 1 ? 'goal' : 'goals'
        }, which are kept.`
      : `Delete "${place.name}"?`;

    if (confirm(message)) {
      void deletePlace(place.id);
      onBack();
    }
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader
        title={place.name}
        onBack={onBack}
        action={
          <button
            type="button"
            className="ds-icon-btn"
            onClick={() => {
              setEditing(true);
              scrollToTop();
            }}
            aria-label="Edit place"
          >
            <Edit2 style={{ width: 20, height: 20 }} aria-hidden="true" />
          </button>
        }
        subtitle={place.area ? <p className="ds-body ds-muted">{place.area}</p> : undefined}
      />

      <section className="ds-card flex flex-col gap-4">
        {place.address && (
          <div>
            <p className="ds-eyebrow">Address</p>
            <p className="ds-body mt-1">{place.address}</p>
          </div>
        )}

        {/* Always offered: without a saved URL it searches the name, which is
            what the old fallback did silently. */}
        <button
          type="button"
          className="ds-btn ds-btn--secondary ds-btn--block"
          onClick={() => openMapsUrl(place.mapsUrl, place.name)}
        >
          <ExternalLink style={{ width: 18, height: 18 }} aria-hidden="true" />
          Open in Maps
        </button>
      </section>

      {place.notes && (
        <section className="ds-card">
          <h2 className="ds-heading mb-2">Notes</h2>
          <p className="ds-body ds-muted">{place.notes}</p>
        </section>
      )}

      {linked.length > 0 && (
        <section className="ds-card">
          <h2 className="ds-heading mb-3">Goals here · {linked.length}</h2>
          <div className="flex flex-col gap-1">
            {linked.map((goal) => (
              <div key={goal.id} className="ds-inset">
                <p className="ds-body-sm font-semibold truncate">{goal.title}</p>
                <p className="ds-caption ds-muted">{goal.type === 'HAUL' ? 'Haul' : 'Item'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 'var(--space-6)' }}>
        <button type="button" className="ds-btn ds-btn--danger ds-btn--block" onClick={handleDelete}>
          <Trash2 style={{ width: 18, height: 18 }} aria-hidden="true" />
          Delete place
        </button>
      </section>
    </div>
  );
}
