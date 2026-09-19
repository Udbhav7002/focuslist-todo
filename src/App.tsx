/**
 * @fileoverview Root application component for FocusList.
 * Composes feature components and manages global concerns like theming and shortcuts.
 * @module App
 */

import { useCallback, useEffect, useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { TodoFilters } from './components/TodoFilters';
import { useLocalStorage } from './hooks/useLocalStorage';
import { THEME_STORAGE_KEY, KEYBOARD_SHORTCUTS } from './utils/constants';
import { SunIcon, MoonIcon, TrashIcon, KeyboardIcon } from './components/Icons';
import { TodoProvider, useTodoContext } from './context/TodoContext';

function AppUI() {
  const { stats, clearCompleted } = useTodoContext();
  
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(THEME_STORAGE_KEY, () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean) => !prev);
  }, [setDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      switch (e.key.toLowerCase()) {
        case KEYBOARD_SHORTCUTS.NEW_TASK:
          e.preventDefault();
          document.getElementById('new-task-input')?.focus();
          break;
        case KEYBOARD_SHORTCUTS.SEARCH:
          e.preventDefault();
          document.getElementById('search-tasks')?.focus();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_THEME:
          e.preventDefault();
          toggleDarkMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start justify-center p-4 sm:p-8 font-sans selection:bg-blue-200 dark:selection:bg-blue-800 transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 overflow-hidden transition-colors duration-300"
        role="main"
        data-testid="focuslist-app"
      >
        {/* ─── Header ─── */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight" data-testid="app-title">
              FocusList
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
              Build. Organize. Simplify.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setShowShortcuts((v) => !v)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label="Toggle keyboard shortcuts help"
              data-testid="shortcuts-toggle"
            >
              <KeyboardIcon className="w-5 h-5" aria-hidden={true} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              data-testid="theme-toggle"
            >
              {darkMode ? <SunIcon className="w-5 h-5" aria-hidden={true} /> : <MoonIcon className="w-5 h-5" aria-hidden={true} />}
            </button>
          </div>
        </header>

        {showShortcuts && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-blue-800 dark:text-blue-200 animate-fade-in" role="note">
            <p className="font-bold mb-2">⌨️ Keyboard Shortcuts</p>
            <ul className="space-y-1">
              <li><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs font-mono">N</kbd> — New task</li>
              <li><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs font-mono">/</kbd> — Search tasks</li>
              <li><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs font-mono">D</kbd> — Toggle dark mode</li>
              <li><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs font-mono">Enter</kbd> — Save edit</li>
              <li><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border text-xs font-mono">Esc</kbd> — Cancel edit</li>
            </ul>
          </div>
        )}

        <TodoStats />
        <TodoForm />
        <TodoFilters />
        <TodoList />

        {stats.completed > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={clearCompleted}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors active:scale-95"
              aria-label={`Clear ${stats.completed} completed tasks`}
              data-testid="clear-completed-button"
            >
              <TrashIcon className="w-4 h-4" aria-hidden={true} />
              Clear Completed ({stats.completed})
            </button>
          </div>
        )}

        <footer className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            FocusList — Built with React, TypeScript &amp; Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppUI />
    </TodoProvider>
  );
}

export default App;
