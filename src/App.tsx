import { useState, useMemo, useEffect } from 'react';
import { useHotkeys } from './shared/hooks/useHotkeys';
import { useTheme } from './shared/hooks/useTheme';
import { useTodoStore } from './app/store/useTodoStore';

import { Header } from './widgets/Header/Header';
import { TodoStatsDashboard } from './widgets/TodoStats/TodoStatsDashboard';
import { TodoForm } from './widgets/TodoForm/TodoForm';
import { TodoFilterBar } from './widgets/TodoFilters/TodoFilterBar';
import { TodoVirtualList } from './widgets/TodoList/TodoVirtualList';

import { CommandPalette, type Command } from './features/command-palette/CommandPalette';
import { UndoToast } from './shared/ui/UndoToast';

export default function App() {
  const { theme, cycleTheme } = useTheme();
  
  const [paletteOpen, setPaletteOpen] = useState(false);
  const undo = useTodoStore((s) => s.undo);
  const clearCompleted = useTodoStore((s) => s.clearCompleted);
  const hydrate = useTodoStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Global Hotkeys
  useHotkeys((e) => {
    const active = document.activeElement as HTMLElement | null;
    const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

    // Command Palette
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setPaletteOpen((prev) => !prev);
    }
    
    if (isTyping) return;

    // Undo
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
  });

  const commands = useMemo<Command[]>(
    () => [
      { id: 'theme', label: `Toggle Theme (current: ${theme})`, action: cycleTheme },
      { id: 'clear', label: 'Clear Completed Tasks', action: clearCompleted },
      { id: 'undo', label: 'Undo Last Action (Ctrl+Z)', action: undo },
    ],
    [theme, cycleTheme, clearCompleted, undo]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        <Header />
        
        <TodoStatsDashboard />
        
        <TodoForm />
        
        <TodoFilterBar />
        
        <TodoVirtualList />
      </main>
      
      <CommandPalette 
        open={paletteOpen} 
        onClose={() => setPaletteOpen(false)} 
        commands={commands} 
      />
      
      <UndoToast />
    </div>
  );
}
