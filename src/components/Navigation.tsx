import { Home, ShoppingCart, MapPin, CheckCircle2, Settings } from 'lucide-react';
import type { Screen } from '../App';

interface NavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const ICON = { width: 24, height: 24 } as const;

export default function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  const items: Array<{ screen: Screen; label: string; icon: React.ReactNode }> = [
    { screen: 'home', label: 'Home', icon: <Home style={ICON} /> },
    { screen: 'shopping', label: 'Shopping', icon: <ShoppingCart style={ICON} /> },
    { screen: 'places', label: 'Places', icon: <MapPin style={ICON} /> },
    { screen: 'bought', label: 'Bought', icon: <CheckCircle2 style={ICON} /> },
    { screen: 'settings', label: 'Settings', icon: <Settings style={ICON} /> },
  ];

  return (
    /*
     * One bar for both breakpoints. The safe-area inset lives on the bar itself
     * (see .ds-tabbar) — padding the body cannot move a fixed element off the
     * home indicator, which is where the labels used to sit.
     *
     * On desktop the row is constrained to the same content column as the
     * screens, so nav and content finally line up.
     */
    <nav className="ds-tabbar sm:order-first" aria-label="Main">
      <div className="flex w-full sm:max-w-content sm:mx-auto sm:px-6">
        {items.map(({ screen, label, icon }) => {
          const active = activeScreen === screen;
          return (
            <button
              key={screen}
              type="button"
              className="ds-tab sm:flex-row sm:gap-2 sm:text-sm"
              onClick={() => onNavigate(screen)}
              // Active state is colour + weight + a dot. Colour alone is not a state.
              aria-current={active ? 'page' : undefined}
            >
              {icon}
              <span>{label}</span>
              <span className="ds-tab-dot sm:hidden" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
