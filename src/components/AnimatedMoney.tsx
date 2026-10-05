import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../utils';

/**
 * A total that counts to its new value over ~300ms. This is the acknowledgement
 * for logging an amount: the number moves, so the tap registered.
 *
 * Always tabular (via the ds-money-* classes) so the digits do not shift
 * sideways while they change. Respects prefers-reduced-motion by jumping.
 */
export default function AnimatedMoney({
  value,
  currency = 'GBP',
  className = 'ds-money-xl',
  duration = 300,
}: {
  value: number;
  currency?: string;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const frame = useRef<number | undefined>(undefined);
  const from = useRef(value);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || duration <= 0 || from.current === value) {
      from.current = value;
      setShown(value);
      return;
    }

    const start = performance.now();
    const origin = from.current;
    const delta = value - origin;

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(origin + delta * eased);
      if (p < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        from.current = value;
        setShown(value);
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      from.current = value;
    };
  }, [value, duration]);

  return <span className={className}>{formatCurrency(shown, currency)}</span>;
}
