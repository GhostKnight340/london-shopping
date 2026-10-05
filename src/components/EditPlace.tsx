import { useState } from 'react';
import type { Place } from '../types';
import { useStore } from '../store';
import ScreenHeader from './ScreenHeader';

interface EditPlaceProps {
  place: Place;
  onBack: () => void;
}

export default function EditPlace({ place, onBack }: EditPlaceProps) {
  const { updatePlace } = useStore();
  const [name, setName] = useState(place.name);
  const [area, setArea] = useState(place.area || '');
  const [address, setAddress] = useState(place.address || '');
  const [mapsUrl, setMapsUrl] = useState(place.mapsUrl || '');
  const [notes, setNotes] = useState(place.notes || '');
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);

    await updatePlace({
      ...place,
      name: name.trim(),
      area: area.trim() || undefined,
      address: address.trim() || undefined,
      mapsUrl: mapsUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onBack();
  };

  return (
    <div className="ds-screen" style={{ gap: 'var(--space-6)' }}>
      <ScreenHeader title="Edit place" onBack={onBack} />

      <div className="ds-card flex flex-col gap-4">
        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-place-name">
            Name (required)
          </label>
          <input
            id="edit-place-name"
            className="ds-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-place-area">
            Area
          </label>
          <input
            id="edit-place-area"
            className="ds-input"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-place-address">
            Address
          </label>
          <input
            id="edit-place-address"
            className="ds-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-place-maps">
            Maps link
          </label>
          <input
            id="edit-place-maps"
            className="ds-input"
            type="url"
            inputMode="url"
            autoCapitalize="off"
            spellCheck={false}
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="edit-place-notes">
            Notes
          </label>
          <textarea
            id="edit-place-notes"
            className="ds-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-actionbar">
        <button
          type="button"
          className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
          disabled={!canSave}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="ds-btn ds-btn--secondary ds-btn--block" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>
  );
}
