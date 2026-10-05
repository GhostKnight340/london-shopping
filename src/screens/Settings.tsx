import { useRef, useState } from 'react';
import { useStore } from '../store';
import { Download, Upload, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { exportData, importData } = useStore();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const data = await exportData();
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
      element.setAttribute('download', `london-shopping-${new Date().toISOString().split('T')[0]}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setMessage({ type: 'success', text: 'Data exported successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);
    try {
      const text = await file.text();
      await importData(text);
      setMessage({ type: 'success', text: 'Data imported successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import data. Invalid file format.' });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{message.text}</p>
        </div>
      )}

      {/* Backup & Restore */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Backup & Restore</h2>

        <div className="card space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Export Data</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Download your shopping data as a JSON file. You can use this to back up your data or transfer it to another device.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Import Data</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Restore your shopping data from a previously exported JSON file. This will replace your current data.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">About</h2>
        <div className="card space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">London Shopping</strong> is your personal trip organizer for managing shopping hauls and specific items while in London.
          </p>
          <p>
            All your data is stored locally in your browser. No accounts, no cloud syncing, no tracking.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs">Version 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
