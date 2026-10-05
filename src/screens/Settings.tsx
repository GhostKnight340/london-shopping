import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Upload } from 'lucide-react';
import { useStore } from '../store';
import { getThemeChoice, setThemeChoice, type ThemeChoice } from '../theme';

export default function Settings() {
  const { exportData, importData } = useStore();
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [theme, setTheme] = useState<ThemeChoice>(getThemeChoice);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setBusy('export');
    setMessage(null);
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Backup downloaded.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not export your data.' });
    } finally {
      setBusy(null);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy('import');
    setMessage(null);
    try {
      await importData(await file.text());
      setMessage({ type: 'success', text: 'Backup restored.' });
    } catch {
      setMessage({ type: 'error', text: 'That file could not be read as a Trip backup.' });
    } finally {
      setBusy(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const chooseTheme = (choice: ThemeChoice) => {
    setTheme(choice);
    setThemeChoice(choice);
  };

  return (
    <div className="ds-screen">
      <header>
        <h1 className="ds-display">Settings</h1>
      </header>

      {message && (
        <div
          className="ds-card flex gap-3 items-start"
          role="status"
          aria-live="polite"
          style={{
            background: message.type === 'success' ? 'var(--success-soft)' : 'var(--danger-soft)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {message.type === 'success' ? (
            <CheckCircle2 style={{ width: 20, height: 20 }} className="flex-none" aria-hidden="true" />
          ) : (
            <AlertCircle style={{ width: 20, height: 20 }} className="flex-none" aria-hidden="true" />
          )}
          <p className="ds-body-sm font-semibold">{message.text}</p>
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="ds-eyebrow">Appearance</h2>
        <div className="ds-card">
          {/* data-theme on <html> is the only theme switch in the app. */}
          <div className="ds-segment" role="group" aria-label="Theme">
            {(['light', 'dark', 'system'] as ThemeChoice[]).map((choice) => (
              <button
                key={choice}
                type="button"
                aria-pressed={theme === choice}
                onClick={() => chooseTheme(choice)}
              >
                {choice === 'system' ? 'System' : choice === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="ds-eyebrow">Backup</h2>

        <div className="ds-card flex flex-col gap-4">
          <div>
            <h3 className="ds-heading">Export</h3>
            <p className="ds-body-sm ds-muted mt-1">
              Downloads everything as one JSON file. Worth doing before you fly.
            </p>
            <button
              type="button"
              className="ds-btn ds-btn--primary mt-3"
              onClick={handleExport}
              disabled={busy !== null}
            >
              <Download style={{ width: 18, height: 18 }} aria-hidden="true" />
              {busy === 'export' ? 'Exporting…' : 'Export backup'}
            </button>
          </div>

          <hr className="ds-divider" />

          <div>
            <h3 className="ds-heading">Import</h3>
            <p className="ds-body-sm ds-muted mt-1">
              Restores from an exported file. This replaces everything currently on
              this device.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              disabled={busy !== null}
              className="hidden"
            />
            <button
              type="button"
              className="ds-btn ds-btn--secondary mt-3"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy !== null}
            >
              <Upload style={{ width: 18, height: 18 }} aria-hidden="true" />
              {busy === 'import' ? 'Importing…' : 'Import backup'}
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="ds-eyebrow">About</h2>
        <div className="ds-card flex flex-col gap-2">
          <p className="ds-body-sm ds-muted">
            Everything lives in this browser on this device. No account, no sync, no
            tracking — so a backup is the only copy.
          </p>
          <p className="ds-caption ds-subtle">Version 1.1</p>
        </div>
      </section>
    </div>
  );
}
