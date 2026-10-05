/**
 * Theme: one strategy. `data-theme` on <html> is the only switch, and it also
 * drives the browser chrome colour via the <meta name="theme-color"> tag.
 *
 * Call initTheme() once before React mounts so the first paint is already the
 * right theme — otherwise a dark-mode user gets a white flash on every launch.
 */

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'trip.theme';

const PAGE: Record<'light' | 'dark', string> = {
  light: '#f6f7f9',
  dark: '#0b1120',
};

function systemTheme(): 'light' | 'dark' {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getThemeChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Private mode or blocked storage: fall through to the system theme.
  }
  return 'system';
}

export function resolveTheme(choice: ThemeChoice = getThemeChoice()): 'light' | 'dark' {
  return choice === 'system' ? systemTheme() : choice;
}

function paint(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', PAGE[resolved]);
}

export function setThemeChoice(choice: ThemeChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Not fatal — the choice just will not survive a reload.
  }
  paint(resolveTheme(choice));
}

export function initTheme() {
  paint(resolveTheme());

  // Follow the OS while the choice is 'system'.
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getThemeChoice() === 'system') paint(systemTheme());
    });
}
