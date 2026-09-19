/**
 * @fileoverview Root component for FocusList. Composes all feature
 * components and owns cross-cutting concerns: theming, global hotkeys,
 * the command palette, toast/undo, export/import, and keyboard help.
 * @module App
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import {
  CommandPalette,
  DownloadIcon,
  KeyboardIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Toast,
  TodoFilters,
  TodoForm,
  TodoList,
  TodoStats,
  TrashIcon,
  UploadIcon,
} from './components';
import type { Command, ToastData } from './components';
import { useHotkeys, useTheme, useTodos } from './hooks';
import { KEYBOARD_SHORTCUTS, UNDO_TIMEOUT } from './utils/constants';
import { todayISO } from './utils/date';
import { focusById } from './utils/dom';
import { normalizeTodos, truncate } from './utils/todo';

const HEADER_BTN =
  'p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center';

/**
 * The complete FocusList application.
 */
function App(): ReactElement {
  const {
    todos,
    allTodos,
    stats,
    allTags,
    filters,
    addTodo,
    toggleTodo,
    deleteTodo,
    restoreTodo,
    clearCompleted,
    updateTodo,
    moveTodo,
    reorderTodos,
    importTodos,
    setSearch,
    setStatus,
    setPriority,
    setTag,
    setSort,
    resetFilters,
  } = useTodos();

  const { theme, dark, cycleTheme } = useTheme();

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFilters =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.tag !== 'All';

  /* ── Toast ─────────────────────────────────────────────── */

  const showToast = useCallback((message: string, action?: ToastData['action']) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, ...(action ? { action } : {}) });
    toastTimer.current = window.setTimeout(() => setToast(null), UNDO_TIMEOUT);
  }, []);

  /* ── Undoable actions ──────────────────────────────────── */

  const handleDelete = useCallback(
    (id: string) => {
      const removed = deleteTodo(id);
      if (!removed) return;
      showToast(`Deleted "${truncate(removed.todo.text)}"`, {
        label: 'Undo',
        onClick: () => restoreTodo(removed.todo, removed.index),
      });
    },
    [deleteTodo, restoreTodo, showToast]
  );

  const handleClearCompleted = useCallback(() => {
    const removed = clearCompleted();
    if (removed.length === 0) return;
    showToast(
      `Cleared ${removed.length} completed ${removed.length === 1 ? 'task' : 'tasks'}`,
      {
        label: 'Undo',
        onClick: () => {
          [...removed]
            .sort((a, b) => b.index - a.index)
            .forEach(({ todo, index }) => restoreTodo(todo, index));
        },
      }
    );
  }, [clearCompleted, restoreTodo, showToast]);

  /* ── Export / Import ───────────────────────────────────── */

  const handleExport = useCallback(() => {
    const payload = {
      app: 'focuslist',
      version: 2,
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
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      try {
        const parsed: unknown = JSON.parse(await file.text());
        const payload = parsed as { todos?: unknown };
        const list = normalizeTodos(Array.isArray(parsed) ? parsed : payload.todos);
        if (list.length === 0) {
          showToast('No valid tasks found in that file');
          return;
        }
        importTodos(list);
        showToast(`Imported ${list.length} tasks`);
      } catch {
        showToast('Import failed — not a valid JSON file');
      }
    },
    [importTodos, showToast]
  );

  /* ── Command palette ───────────────────────────────────── */

  const commands = useMemo<Command[]>(
    () => [
      { id: 'add', label: 'Add new task', action: () => focusById('new-task-input') },
      { id: 'all', label: 'Show all tasks', action: () => setStatus('All') },
      { id: 'active', label: 'Show active tasks', action: () => setStatus('Active') },
      { id: 'completed', label: 'Show completed tasks', action: () => setStatus('Completed') },
      { id: 'sort-priority', label: 'Sort by priority', action: () => setSort('priority') },
      { id: 'sort-due', label: 'Sort by due date', action: () => setSort('dueDate') },
      {
        id: 'theme',
        label: dark ? 'Switch to light mode' : 'Switch to dark mode',
        action: cycleTheme,
      },
      ...(stats.completed > 0
        ? [{ id: 'clear', label: 'Clear completed tasks', action: handleClearCompleted }]
        : []),
      { id: 'export', label: 'Export tasks as JSON', action: handleExport },
      { id: 'shortcuts', label: 'Toggle keyboard shortcuts help', action: () => setShowShortcuts((v) => !v) },
    ],
    [dark, cycleTheme, setStatus, setSort, stats.completed, handleClearCompleted, handleExport]
  );

  /* ── Global hotkeys ────────────────────────────────────── */

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.PALETTE) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editable =
        tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
      if (editable || paletteOpen) return;

      switch (e.key.toLowerCase()) {
        case KEYBOARD_SHORTCUTS.NEW_TASK:
          e.preventDefault();
          focusById('new-task-input');
          break;
        case KEYBOARD_SHORTCUTS.SEARCH:
          e.preventDefault();
          focusById('search-tasks');
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_THEME:
          e.preventDefault();
          cycleTheme();
          break;
        case KEYBOARD_SHORTCUTS.HELP:
          e.preventDefault();
          setShowShortcuts((v) => !v);
          break;
      }
    },
    [cycleTheme, paletteOpen]
  );
  useHotkeys(handleGlobalKeyDown);

  const themeIcon =
    theme === 'system' ? (
      <MonitorIcon className="w-5 h-5" />
    ) : theme === 'light' ? (
      <SunIcon className="w-5 h-5" />
    ) : (
      <MoonIcon className="w-5 h-5" />
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start justify-center p-3 sm:p-8 font-sans selection:bg-blue-200 dark:selection:bg-blue-800 transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-8 transition-colors duration-300"
        data-testid="focuslist-app"
      >
        {/* ─── Header ─── */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div className="text-center sm:text-left">
            <h1
              className="text-4xl font-black text-gray-900 dark:text-white tracking-tight"
              data-testid="app-title"
            >
              FocusList
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
              Build. Organize. Simplify.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={HEADER_BTN}
              aria-label="Import tasks from a JSON file"
              data-testid="import-button"
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
              data-testid="export-button"
              title="Export JSON"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowShortcuts((v) => !v)}
              className={HEADER_BTN}
              aria-label="Toggle keyboard shortcuts help"
              aria-expanded={showShortcuts}
              data-testid="shortcuts-toggle"
              title="Shortcuts (?)"
            >
              <KeyboardIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={cycleTheme}
              className={HEADER_BTN}
              aria-label={`Theme: ${theme}. Activate to switch theme.`}
              data-testid="theme-toggle"
              title={`Theme: ${theme}`}
            >
              {themeIcon}
            </button>
          </div>
        </header>

        {/* ─── Shortcuts help ─── */}
        {showShortcuts && (
          <div
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-blue-900 dark:text-blue-200"
            role="note"
            data-testid="shortcuts-panel"
          >
            <p className="font-bold mb-2">⌨️ Keyboard shortcuts</p>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
              <li><kbd>N</kbd> New task</li>
              <li><kbd>/</kbd> Search tasks</li>
              <li><kbd>D</kbd> Cycle theme</li>
              <li><kbd>?</kbd> Toggle this help</li>
              <li><kbd>Ctrl</kbd>+<kbd>K</kbd> Command palette</li>
              <li><kbd>↑</kbd> <kbd>↓</kbd> <kbd>Home</kbd> <kbd>End</kbd> Navigate tasks</li>
              <li><kbd>Alt</kbd>+<kbd>↑</kbd>/<kbd>↓</kbd> Reorder task</li>
              <li><kbd>Enter</kbd> Save edit · <kbd>Esc</kbd> Cancel edit / close dialog</li>
            </ul>
          </div>
        )}

        <TodoStats stats={stats} />
        <TodoForm onAdd={addTodo} />
        <TodoFilters
          search={filters.search}
          status={filters.status}
          priority={filters.priority}
          tag={filters.tag}
          sort={filters.sort}
          allTags={allTags}
          hasFilters={hasFilters}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onTagChange={setTag}
          onSortChange={setSort}
          onReset={resetFilters}
        />
        <TodoList
          todos={todos}
          hasFilters={hasFilters}
          sort={filters.sort}
          onToggle={toggleTodo}
          onDelete={handleDelete}
          onEdit={(id, text) => updateTodo(id, { text })}
          onMove={moveTodo}
          onReorder={reorderTodos}
          onCreateFirst={() => focusById('new-task-input')}
          onClearFilters={resetFilters}
        />

        {stats.completed > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleClearCompleted}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl border border-red-200 dark:border-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors min-h-[44px]"
              aria-label={`Clear ${stats.completed} completed tasks`}
              data-testid="clear-completed-button"
            >
              <TrashIcon className="w-4 h-4" />
              Clear Completed ({stats.completed})
            </button>
          </div>
        )}

        <footer className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            FocusList v2 — React 18 · TypeScript · Tailwind CSS · Data stays in your browser
          </p>
        </footer>
      </main>

      <CommandPalette
        open={paletteOpen}
        commands={commands}
        onClose={() => setPaletteOpen(false)}
      />
      <Toast toast={toast} />
    </div>
  );
}

export default App;
