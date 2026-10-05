import { useEffect, useState } from 'react';
import { useStore } from './store';
import { initializeDB } from './db';
import Home from './screens/Home';
import Shopping from './screens/Shopping';
import Places from './screens/Places';
import Bought from './screens/Bought';
import Settings from './screens/Settings';
import Navigation from './components/Navigation';

type Screen = 'home' | 'shopping' | 'places' | 'bought' | 'settings';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [loading, setLoading] = useState(true);
  const { initTrip } = useStore();

  useEffect(() => {
    async function init() {
      try {
        const tripId = await initializeDB();
        await initTrip(tripId);
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [initTrip]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <main className="flex-1 pb-20 sm:pb-0 max-w-2xl w-full mx-auto">
        {screen === 'home' && <Home onNavigate={setScreen} />}
        {screen === 'shopping' && <Shopping onNavigate={setScreen} />}
        {screen === 'places' && <Places />}
        {screen === 'bought' && <Bought />}
        {screen === 'settings' && <Settings />}
      </main>

      <Navigation activeScreen={screen} onNavigate={setScreen} />
    </div>
  );
}

export default App;
