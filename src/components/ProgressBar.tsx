/**
 * Coverage as a bar plus its count. The count is always present — a thumb
 * covers a third of a phone-width bar — and the width animates rather than
 * snapping, so a tick reads as a result instead of a re-render.
 */
export default function ProgressBar({
  completed,
  total,
  label = 'Coverage',
}: {
  completed: number;
  total: number;
  label?: string;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const done = total > 0 && completed >= total;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="ds-eyebrow">{label}</span>
        <span
          className="ds-caption font-bold ds-num"
          style={done ? { color: 'var(--success)' } : undefined}
        >
          {done ? 'Complete' : `${completed}/${total}`}
        </span>
      </div>
      <div
        className={`ds-progress${done ? ' ds-progress--done' : ''}`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
