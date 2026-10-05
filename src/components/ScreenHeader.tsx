import { ChevronLeft } from 'lucide-react';

/**
 * The top of a screen. One title, an optional back button and one optional
 * action, all at tap-min. The title is `display` at 28px — not the 36/48px it
 * used to be, which spent the app's largest type on a static word.
 */
export default function ScreenHeader({
  title,
  onBack,
  action,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  action?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            className="ds-icon-btn -ml-3"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft style={{ width: 'var(--icon-lg, 24px)', height: 24 }} />
          </button>
        )}
        <h1 className={`${onBack ? 'ds-title' : 'ds-display'} flex-1 min-w-0 truncate`}>
          {title}
        </h1>
        {action}
      </div>
      {subtitle && <div className="mt-1">{subtitle}</div>}
    </div>
  );
}
