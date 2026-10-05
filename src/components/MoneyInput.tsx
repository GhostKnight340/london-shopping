import { currencySymbol } from '../utils';

/**
 * A money field. `inputMode="decimal"` on a text input rather than
 * type="number": number inputs show desktop spinners, change value on an
 * accidental scroll, and accept `e`/`+`/`-`.
 *
 * The symbol is a prefix, so it is never typed into the value.
 */
export default function MoneyInput({
  id,
  value,
  onChange,
  currency = 'GBP',
  placeholder = '0.00',
  invalid = false,
  autoFocus = false,
  onEnter,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  placeholder?: string;
  invalid?: boolean;
  autoFocus?: boolean;
  onEnter?: () => void;
}) {
  return (
    <div className="ds-money-input">
      <span className="ds-prefix" aria-hidden="true">
        {currencySymbol(currency)}
      </span>
      <input
        id={id}
        className={`ds-input${invalid ? ' ds-input--invalid' : ''}`}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        enterKeyHint={onEnter ? 'done' : undefined}
        // Digits, one separator, nothing else.
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
      />
    </div>
  );
}
