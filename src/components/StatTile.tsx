/**
 * A labelled number. One tile leads at money-xl and spans the row; the rest sit
 * at money. Four equal tiles — which is what Home had — rank nothing.
 *
 * A tile is a readout, never a control.
 */
export default function StatTile({
  label,
  value,
  sub,
  tone = 'default',
  lead = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: 'default' | 'warn' | 'danger' | 'success';
  lead?: boolean;
}) {
  const color =
    tone === 'warn'
      ? 'var(--warn)'
      : tone === 'danger'
        ? 'var(--danger)'
        : tone === 'success'
          ? 'var(--success)'
          : undefined;

  return (
    <div className="ds-card ds-card--compact">
      <p className="ds-caption ds-muted">{label}</p>
      <p
        className={`${lead ? 'ds-money-xl' : 'ds-money'} mt-1`}
        style={color ? { color } : undefined}
      >
        {value}
      </p>
      {sub && <p className="ds-caption ds-muted mt-2">{sub}</p>}
    </div>
  );
}
