import type { ShoppingGoal, GoalStatus, ItemPriority } from './types';

/* --- dates ---------------------------------------------------------------- */

export function getDaysRemaining(departureDate: string): number {
  const departure = new Date(departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  departure.setHours(0, 0, 0, 0);
  const diff = departure.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUrgencyMessage(daysRemaining: number): string {
  if (daysRemaining < 0) return 'Trip finished';
  if (daysRemaining === 0) return 'Leaving today';
  if (daysRemaining === 1) return 'Leaving tomorrow';
  return `${daysRemaining} days left`;
}

/** True once the trip is close enough that the countdown should read as a warning. */
export function isUrgent(daysRemaining: number): boolean {
  return daysRemaining >= 0 && daysRemaining <= 3;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/* --- money ---------------------------------------------------------------- */

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currency: string): Intl.NumberFormat {
  const key = currency || 'GBP';
  let f = formatters.get(key);
  if (!f) {
    try {
      f = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: key,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      // Unknown currency code: fall back to a plain two-decimal number.
      f = new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    formatters.set(key, f);
  }
  return f;
}

/**
 * Real currency formatting: thousands separate and an unknown code no longer
 * renders as "USD50.00".
 */
export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return formatterFor(currency).format(Number.isFinite(amount) ? amount : 0);
}

/** The currency's symbol on its own, for an input prefix. */
export function currencySymbol(currency: string = 'GBP'): string {
  const parts = formatterFor(currency).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? '£';
}

/** Parses what a user typed into a decimal field. Returns null if unusable. */
export function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[^0-9.,-]/g, '').replace(',', '.');
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100) / 100;
}

/**
 * The over/under line. The sign and the word carry the meaning; colour is only
 * ever a second signal, so this never returns "success" for being under —
 * success means finished, not cheap.
 */
export function compareToEstimate(
  actual: number,
  estimated: number | undefined,
  currency: string,
): { text: string; tone: 'neutral' | 'danger' } | null {
  if (!estimated || estimated <= 0) return null;
  // Nothing spent yet: "£50.00 under £50.00" is noise, so say what it is.
  if (actual === 0) return { text: `${formatCurrency(estimated, currency)} planned`, tone: 'neutral' };
  const diff = Math.round((actual - estimated) * 100) / 100;
  if (diff === 0) return { text: `On the ${formatCurrency(estimated, currency)} estimate`, tone: 'neutral' };
  if (diff > 0) {
    return { text: `+${formatCurrency(diff, currency)} over ${formatCurrency(estimated, currency)}`, tone: 'danger' };
  }
  return {
    text: `${formatCurrency(Math.abs(diff), currency)} under ${formatCurrency(estimated, currency)}`,
    tone: 'neutral',
  };
}

/* --- progress ------------------------------------------------------------- */

export function getCategoryProgress(categories: Array<{ completed: boolean }> | undefined): {
  completed: number;
  total: number;
  percent: number;
} {
  if (!categories || categories.length === 0) return { completed: 0, total: 0, percent: 0 };
  const completed = categories.filter((c) => c.completed).length;
  const total = categories.length;
  return { completed, total, percent: Math.round((completed / total) * 100) };
}

/* --- identity ------------------------------------------------------------- */

export type TagSlot = 'rose' | 'indigo' | 'amber' | 'teal';

const TAG_SLOTS: TagSlot[] = ['rose', 'indigo', 'amber', 'teal'];

type Identified = { id: string; createdAt: number };

/**
 * A goal's colour comes from when it was created, not from where it happens to
 * sit in a rendered list. The list re-sorts whenever a goal completes, so the
 * old index-keyed colour made a haul change identity as you used it; createdAt
 * never changes, so this is stable — and ranking rather than hashing means the
 * first four goals are guaranteed four different colours.
 */
export function getTagSlot(goal: Identified, all: Identified[]): TagSlot {
  const rank = all.filter(
    (g) =>
      g.createdAt < goal.createdAt || (g.createdAt === goal.createdAt && g.id < goal.id),
  ).length;
  return TAG_SLOTS[rank % TAG_SLOTS.length];
}

export function tagVars(goal: Identified, all: Identified[]): { ink: string; soft: string } {
  const slot = getTagSlot(goal, all);
  return { ink: `var(--tag-${slot})`, soft: `var(--tag-${slot}-soft)` };
}

/* --- labels: one vocabulary, always a word -------------------------------- */

export type PillTone = 'neutral' | 'active' | 'done' | 'warn' | 'skipped';

const STATUS_LABELS: Record<string, { label: string; tone: PillTone }> = {
  'not-started': { label: 'Not started', tone: 'neutral' },
  'in-progress': { label: 'In progress', tone: 'active' },
  completed: { label: 'Completed', tone: 'done' },
  want: { label: 'Want', tone: 'neutral' },
  found: { label: 'Found', tone: 'active' },
  bought: { label: 'Bought', tone: 'done' },
  skipped: { label: 'Skipped', tone: 'skipped' },
};

export function statusLabel(status: GoalStatus): { label: string; tone: PillTone } {
  return STATUS_LABELS[status] ?? { label: 'Not started', tone: 'neutral' };
}

const PRIORITY_LABELS: Record<ItemPriority, { label: string; tone: PillTone }> = {
  'must-buy': { label: 'Must buy', tone: 'warn' },
  want: { label: 'Want', tone: 'active' },
  maybe: { label: 'Maybe', tone: 'neutral' },
};

export function priorityLabel(priority: ItemPriority | undefined): { label: string; tone: PillTone } {
  return PRIORITY_LABELS[priority ?? 'want'];
}

/** An item counts as done when it has been bought; a haul when it is completed. */
export function isDone(goal: ShoppingGoal): boolean {
  return goal.status === 'completed' || goal.status === 'bought';
}

/* --- misc ----------------------------------------------------------------- */

export function openMapsUrl(mapsUrl: string | undefined, name: string) {
  const url = mapsUrl?.trim()
    ? mapsUrl
    : `https://maps.google.com/?q=${encodeURIComponent(name)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** A short, non-blocking tap acknowledgement where the platform supports it. */
export function tapFeedback() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // Ignored: unsupported or blocked by the user.
    }
  }
}
