import type { PillTone } from '../utils';

/**
 * A status in a word. One vocabulary for the whole app — this replaces the
 * three that coexisted: tinted pills, text glyphs (○ ◐ ✓ ✗) and emoji circles.
 * The word is always rendered; colour is only ever a second signal.
 */
export default function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: PillTone;
}) {
  return <span className={`ds-pill ds-pill--${tone}`}>{label}</span>;
}
