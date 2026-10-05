import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/**
 * Undo instead of confirm. Logging £5 and toggling a category are cheap and
 * reversible; a modal for either is friction, and no feedback at all leaves the
 * only acknowledgement as a number quietly changing.
 *
 * One toast at a time — a second action replaces the first and restarts the timer.
 */

type ToastState = {
  id: number;
  message: string;
  onUndo?: () => void;
};

type ToastApi = {
  /** Show a toast. Pass onUndo to offer an Undo action. */
  toast: (message: string, onUndo?: () => void) => void;
  dismiss: () => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DURATION = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const nextId = useRef(0);

  const clear = useCallback(() => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const dismiss = useCallback(() => {
    clear();
    setCurrent(null);
  }, [clear]);

  const toast = useCallback(
    (message: string, onUndo?: () => void) => {
      clear();
      const id = ++nextId.current;
      setCurrent({ id, message, onUndo });
      timer.current = window.setTimeout(() => {
        setCurrent((t) => (t && t.id === id ? null : t));
      }, DURATION);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {current && (
        <div className="ds-toast-slot">
          {/* polite, not assertive: an undo offer should not interrupt a screen reader mid-sentence */}
          <div className="ds-toast" role="status" aria-live="polite">
            <span>{current.message}</span>
            {current.onUndo && (
              <button
                type="button"
                className="ds-toast-action"
                onClick={() => {
                  current.onUndo?.();
                  dismiss();
                }}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
