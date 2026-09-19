/**
 * @fileoverview Ctrl/⌘+K command palette. Fully keyboard-navigable
 * with combobox/listbox semantics and a strict WAI-ARIA focus trap.
 * @module components/CommandPalette
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import { SearchIcon } from './Icons';

export interface Command {
  id: string;
  label: string;
  action: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  commands: Command[];
  onClose: () => void;
}

export function CommandPalette({ open, commands, onClose }: CommandPaletteProps): ReactElement | null {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement;
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    return () => {
      if (open) {
        previouslyFocused.current?.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const run = (index: number) => {
    const cmd = filtered[index];
    if (!cmd) return;
    onClose();
    cmd.action();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        run(activeIndex);
        break;
      case 'Tab': {
        // Strict Focus Trap
        e.preventDefault();
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          first?.focus();
        } else {
          // Cycle normally inside the listbox items
          const currentIndex = Array.from(focusables).indexOf(document.activeElement as HTMLElement);
          const nextIndex = e.shiftKey ? Math.max(0, currentIndex - 1) : Math.min(focusables.length - 1, currentIndex + 1);
          focusables[nextIndex]?.focus();
          // Sync active index if moving through options
          if (nextIndex > 0) setActiveIndex(nextIndex - 1);
        }
        break;
      }
    }
  };

  const activeCommand = filtered[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-gray-900/50 dark:bg-black/60 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-pop-in overflow-hidden"
        data-testid="command-palette"
      >
        <div className="flex items-center gap-2 px-4 border-b border-gray-100 dark:border-gray-700">
          <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-listbox"
            aria-activedescendant={activeCommand ? `cmd-${activeIndex}` : undefined}
            aria-label="Search commands"
            className="flex-1 py-3.5 bg-transparent focus:outline-none dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            data-testid="command-input"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded font-mono border border-gray-200 dark:border-gray-600">esc</kbd>
        </div>
        <ul id="command-listbox" role="listbox" className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-gray-400">No matching commands</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              id={`cmd-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => run(i)}
              className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between ${
                i === activeIndex ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span>{cmd.label}</span>
              {i === activeIndex && <kbd className="!bg-transparent !border-white/30 !text-white px-1 py-0.5 rounded text-xs font-mono border">↵</kbd>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
