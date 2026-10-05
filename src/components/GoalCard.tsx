import { ChevronRight } from 'lucide-react';
import type { ShoppingGoal } from '../types';
import {
  compareToEstimate,
  formatCurrency,
  getCategoryProgress,
  priorityLabel,
  statusLabel,
  tagVars,
} from '../utils';
import StatusPill from './StatusPill';
import { useStore } from '../store';

/**
 * A haul or item in a list.
 *
 * Three fixes over the old HaulCard:
 *  - identity comes from the goal's stored id, not its index in a sorted list,
 *    so a haul stops changing colour when it completes and the list re-sorts;
 *  - the title is a real <h3> outside the button (the old card nested a heading
 *    inside a <button>, which is invalid and loses the heading to the a11y tree),
 *    with a stretched button over the card as the tap target;
 *  - identity is a 4px accent bar rather than a card tint — the tint never
 *    rendered anyway, since `.card` overrode `bg-*-50` on source order.
 */
export default function GoalCard({
  goal,
  currency,
  onOpen,
}: {
  goal: ShoppingGoal;
  currency: string;
  onOpen: () => void;
}) {
  const allGoals = useStore((s) => s.goals);
  const tag = tagVars(goal, allGoals);
  const status = statusLabel(goal.status);
  const progress = getCategoryProgress(goal.categories);
  const hasProgress = goal.type === 'HAUL' && progress.total > 0;
  const estimate = compareToEstimate(goal.actualCost, goal.estimatedCost, currency);
  const emphasise = status.tone === 'done';

  const meta: string[] = [status.label];
  if (goal.type === 'ITEM' && goal.priority) meta.push(priorityLabel(goal.priority).label);
  if (hasProgress) meta.push(`${progress.completed} of ${progress.total} covered`);

  return (
    <div className="ds-card ds-tappable relative flex gap-3 items-stretch">
      <span className="ds-accent" style={{ background: tag.soft }} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="ds-heading min-w-0 truncate">{goal.title}</h3>
          {emphasise && <StatusPill label={status.label} tone={status.tone} />}
        </div>

        <p className="ds-caption ds-muted mt-1">
          {emphasise ? meta.slice(1).join(' · ') || 'Done' : meta.join(' · ')}
        </p>

        {goal.description && (
          <p className="ds-body-sm ds-muted mt-1 truncate">{goal.description}</p>
        )}

        {hasProgress && (
          <div className="ds-progress mt-3" aria-hidden="true">
            <span style={{ width: `${progress.percent}%` }} />
          </div>
        )}

        <div className="flex items-baseline justify-between gap-2 mt-3">
          <span className="ds-money">{formatCurrency(goal.actualCost, currency)}</span>
          {estimate ? (
            <span
              className="ds-caption ds-num"
              style={{ color: estimate.tone === 'danger' ? 'var(--danger)' : 'var(--ink-muted)' }}
            >
              {estimate.text}
            </span>
          ) : (
            <span className="ds-caption ds-muted">No estimate</span>
          )}
        </div>
      </div>

      <ChevronRight
        className="self-center flex-none"
        style={{ width: 20, height: 20, color: 'var(--ink-subtle)' }}
        aria-hidden="true"
      />

      {/* Stretched tap target, so the heading above stays a heading. */}
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 w-full h-full rounded-[inherit]"
        aria-label={`Open ${goal.title}`}
      />
    </div>
  );
}
