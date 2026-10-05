export function getDaysRemaining(departureDate: string): number {
  const departure = new Date(departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  departure.setHours(0, 0, 0, 0);
  const diff = departure.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUrgencyMessage(daysRemaining: number): string {
  if (daysRemaining === 0) return 'Leaving today';
  if (daysRemaining === 1) return 'Leaving tomorrow';
  if (daysRemaining <= 3) return `${daysRemaining} days left`;
  return `${daysRemaining} days left in London`;
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  const symbol = currency === 'GBP' ? '£' : currency;
  return `${symbol}${amount.toFixed(2)}`;
}

export function getCategoryProgress(categories: Array<{ completed: boolean }> | undefined): {
  completed: number;
  total: number;
  percent: number;
} {
  if (!categories) return { completed: 0, total: 0, percent: 0 };
  const completed = categories.filter(c => c.completed).length;
  const total = categories.length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getHaulColor(index: number): { bg: string; ring: string; gradient: string } {
  const colors = [
    { bg: 'bg-red-50 dark:bg-red-950/20', ring: 'ring-red-200 dark:ring-red-900/50', gradient: 'from-red-100 to-red-50' },
    { bg: 'bg-indigo-50 dark:bg-indigo-950/20', ring: 'ring-indigo-200 dark:ring-indigo-900/50', gradient: 'from-indigo-100 to-indigo-50' },
    { bg: 'bg-pink-50 dark:bg-pink-950/20', ring: 'ring-pink-200 dark:ring-pink-900/50', gradient: 'from-pink-100 to-pink-50' },
  ];
  return colors[index % colors.length];
}

export function getHaulEmoji(index: number): string {
  const emojis = ['🇯🇵', '🇬🇧', '🇰🇷'];
  return emojis[index % emojis.length];
}

export function openMapsUrl(mapsUrl: string | undefined, name: string) {
  if (mapsUrl) {
    window.open(mapsUrl, '_blank');
  } else {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(name)}`, '_blank');
  }
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
