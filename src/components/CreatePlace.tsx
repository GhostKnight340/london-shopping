import { useState } from 'react';
import { useStore } from '../store';
import type { Place } from '../types';
import ScreenHeader from './ScreenHeader';

interface CreatePlaceProps {
  onBack: () => void;
}

export default function CreatePlace({ onBack }: CreatePlaceProps) {
  const { trip, addPlace } = useStore();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!trip) return null;

  const canSave = name.trim().length > 0 && !saving;

  const handleCreate = async () => {
    if (!canSave) return;
    setSaving(true);

    const place: Place = {
      id: `place-${Date.now()}`,
      tripId: trip.id,
      name: name.trim(),
      area: area.trim() || undefined,
      address: address.trim() || undefined,
      mapsUrl: mapsUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    };

    await addPlace(place);
    onBack();
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader title="Add a place" onBack={onBack} />

      <div className="ds-card flex flex-col gap-4">
        <div className="ds-field">
          <label className="ds-label" htmlFor="place-name">
            Name (required)
          </label>
          <input
            id="place-name"
            className="ds-input"
            type="text"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Japan Centre"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="place-area">
            Area
          </label>
          <input
            id="place-area"
            className="ds-input"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Soho"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="place-address">
            Address
          </label>
          <input
            id="place-address"
            className="ds-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="35–37 Panton St"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="place-maps">
            Maps link
          </label>
          <input
            id="place-maps"
            className="ds-input"
            type="url"
            inputMode="url"
            autoCapitalize="off"
            spellCheck={false}
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/…"
          />
          <p className="ds-hint">Optional — without it, Maps searches the name.</p>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="place-notes">
            Notes
          </label>
          <textarea
            id="place-notes"
            className="ds-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Opening hours, which floor, cash only"
          />
        </div>
      </div>

      <div className="ds-actionbar">
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
          disabled={!canSave}
          onClick={() => void handleCreate()}
        >
          {saving ? 'Saving…' : 'Add place'}
        </button>
        {!name.trim() && <p className="ds-hint text-center">A name is all it needs.</p>}
      </div>
    </div>
  );
}
