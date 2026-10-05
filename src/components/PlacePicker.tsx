import { Check } from 'lucide-react';
import { useStore } from '../store';

/**
 * Picks the places a goal belongs to. The whole row is the target at tap-min,
 * not a 16px checkbox.
 */
export default function PlacePicker({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: Set<string>;
  onToggle: (placeId: string) => void;
}) {
  const { places } = useStore();

  if (places.length === 0) {
    return (
      <div className="ds-field">
        <span className="ds-label">{label}</span>
        <p className="ds-hint">No places saved yet — add them on the Places tab.</p>
      </div>
    );
  }

  return (
    <fieldset className="ds-field" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="ds-label" style={{ padding: 0 }}>
        {label}
      </legend>
      <div className="flex flex-col gap-1">
        {places.map((place) => {
          const checked = selected.has(place.id);
          return (
            <button
              key={place.id}
              type="button"
              className="ds-row"
              style={{ background: 'var(--surface-sunken)' }}
              role="checkbox"
              aria-checked={checked}
              onClick={() => onToggle(place.id)}
            >
              <span className="ds-check" aria-hidden="true" data-checked={checked}>
                {checked && <Check style={{ width: 16, height: 16 }} />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="ds-body-sm font-semibold block truncate">{place.name}</span>
                {place.area && <span className="ds-caption ds-muted block truncate">{place.area}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
