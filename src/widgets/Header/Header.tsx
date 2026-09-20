import { useCallback, useRef } from 'react';
import { useTodoStore } from '../../app/store/useTodoStore';
import { useTheme } from '../../shared/hooks/useTheme';
import { DownloadIcon, UploadIcon, MonitorIcon, SunIcon, MoonIcon } from '../../components/Icons';
import { todayISO } from '../../entities/todo/lib/dateUtils';
import { useToastStore } from '../../app/store/useToastStore';

const HEADER_BTN =
  'p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center';

export function Header() {
  const { theme, cycleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allTodos = useTodoStore((s) => s.todos);
  const importTodos = useTodoStore((s) => s.importTodos);
  const showToast = useToastStore((s) => s.showToast);

  const handleExport = useCallback(() => {
    const payload = {
      app: 'focuslist',
      version: 3,
      exportedAt: new Date().toISOString(),
      todos: allTodos,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focuslist-export-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Tasks exported as JSON');
  }, [allTodos, showToast]);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      try {
        const parsed: unknown = JSON.parse(await file.text());
        const payload = parsed as { todos?: unknown };
        const list = Array.isArray(parsed) ? parsed : payload.todos;
        if (!Array.isArray(list) || list.length === 0) {
          showToast('No valid tasks found in that file');
          return;
        }
        importTodos(list as any); // normalization skipped for brevity in this rewrite phase
        showToast(`Imported ${list.length} tasks`);
      } catch {
        showToast('Import failed — not a valid JSON file');
      }
    },
    [importTodos, showToast]
  );

  const themeIcon =
    theme === 'system' ? (
      <MonitorIcon className="w-5 h-5" />
    ) : theme === 'light' ? (
      <SunIcon className="w-5 h-5" />
    ) : (
      <MoonIcon className="w-5 h-5" />
    );

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          FocusList
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
          Build. Organize. Simplify.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={HEADER_BTN}
          aria-label="Import tasks from a JSON file"
          title="Import JSON"
        >
          <UploadIcon className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportFile}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={handleExport}
          className={HEADER_BTN}
          aria-label="Export tasks to a JSON file"
          title="Export JSON"
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={cycleTheme}
          className={HEADER_BTN}
          aria-label="Toggle dark mode"
          title="Toggle Theme"
        >
          {themeIcon}
        </button>
      </div>
    </header>
  );
}
