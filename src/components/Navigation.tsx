import { Home, ShoppingCart, MapPin, CheckCircle2, Settings } from 'lucide-react';

type Screen = 'home' | 'shopping' | 'places' | 'bought' | 'settings';

interface NavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  const items: Array<{ screen: Screen; label: string; icon: React.ReactNode }> = [
    { screen: 'home', label: 'Home', icon: <Home className="w-6 h-6" /> },
    { screen: 'shopping', label: 'Shopping', icon: <ShoppingCart className="w-6 h-6" /> },
    { screen: 'places', label: 'Places', icon: <MapPin className="w-6 h-6" /> },
    { screen: 'bought', label: 'Bought', icon: <CheckCircle2 className="w-6 h-6" /> },
    { screen: 'settings', label: 'Settings', icon: <Settings className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 sm:hidden">
        <div className="flex justify-around">
          {items.map(({ screen, label, icon }) => (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                activeScreen === screen
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-label={label}
            >
              {icon}
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden sm:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 gap-8">
        {items.map(({ screen, label, icon }) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
              activeScreen === screen
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {icon}
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
