import { useCallback, useEffect, useState } from 'react';
import { useStore } from './store';
import { initializeDB } from './db';
import Home from './screens/Home';
import Shopping from './screens/Shopping';
import Places from './screens/Places';
import Bought from './screens/Bought';
import Settings from './screens/Settings';
import Navigation from './components/Navigation';
import { ToastProvider } from './components/Toast';

export type Screen = 'home' | 'shopping' | 'places' | 'bought' | 'settings';

const SCREENS: Screen[] = ['home', 'shopping', 'places', 'bought', 'settings'];

function isScreen(value: unknown): value is Screen {
  return typeof value === 'string' && (SCREENS as string[]).includes(value);
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  // Set when another screen asks to open a specific goal, so tapping a haul on
  // Home lands on that haul rather than on the list.
  const [pendingGoalId, setPendingGoalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { initTrip } = useStore();

  useEffect(() => {
    async function init() {
      try {
        const tripId = await initializeDB();
        await initTrip(tripId);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [initTrip]);

  // Screens are state, not routes — so give each one a history entry. Without
  // this the device back gesture leaves the app from anywhere in it.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const initial: Screen = isScreen(hash) ? hash : 'home';
    setScreen(initial);
    window.history.replaceState({ screen: initial }, '', `#${initial}`);

    const onPop = (e: PopStateEvent) => {
      const next = (e.state as { screen?: unknown } | null)?.screen;
      if (isScreen(next)) setScreen(next);
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (next: Screen, goalId?: string) => {
      setPendingGoalId(goalId ?? null);
      setScreen((current) => {
        if (current === next) return current;
        window.history.pushState({ screen: next }, '', `#${next}`);
        return next;
      });
      // A new screen starts at the top. The old build kept the previous offset
      // and then smooth-scrolled through it.
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: '3px solid var(--track)',
              borderTopColor: 'var(--brand)',
            }}
          />
          <p className="ds-body ds-muted">Loading your trip…</p>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="ds-screen">
        <div className="ds-empty">
          <h1 className="ds-title">Could not open your trip</h1>
          <p className="ds-body ds-muted">
            The local database would not load. Closing and reopening the app usually
            fixes it; your data is still on this device.
          </p>
          <button
            type="button"
            className="ds-btn ds-btn--primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <main className="ds-main">
        {screen === 'home' && <Home onNavigate={navigate} />}
        {screen === 'shopping' && (
          <Shopping
            initialGoalId={pendingGoalId}
            onConsumeInitialGoal={() => setPendingGoalId(null)}
          />
        )}
        {screen === 'places' && <Places />}
        {screen === 'bought' && <Bought />}
        {screen === 'settings' && <Settings />}
      </main>

      <Navigation activeScreen={screen} onNavigate={navigate} />
    </ToastProvider>
  );
}

export default App;
