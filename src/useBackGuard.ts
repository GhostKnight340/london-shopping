import { useEffect, useRef } from 'react';

/**
 * Makes the device back gesture close an in-screen view instead of leaving the
 * app. Screens here are React state rather than routes, so opening a haul and
 * swiping back used to exit the app entirely.
 *
 * While `active`, one history entry is held. The user's back gesture pops it and
 * calls `onBack`; closing the view through the UI instead removes the entry
 * again so the history does not grow.
 */
export function useBackGuard(active: boolean, onBack: () => void) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;

    let poppedByUser = false;
    window.history.pushState({ guard: true }, '');

    const handlePop = () => {
      poppedByUser = true;
      onBackRef.current();
    };

    window.addEventListener('popstate', handlePop);

    return () => {
      window.removeEventListener('popstate', handlePop);
      // Closed from the UI: drop the entry we added, so one back gesture does
      // not have to be spent on a view that is already closed.
      if (!poppedByUser) window.history.back();
    };
  }, [active]);
}

/** Puts a freshly opened view at the top, like a real navigation would. */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
}
