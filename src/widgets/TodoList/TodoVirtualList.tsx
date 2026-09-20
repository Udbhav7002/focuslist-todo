import { useRef, useCallback, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTodoStore } from '../../app/store/useTodoStore';
import { selectVisibleTodos } from '../../app/store/selectors';
import { TodoVirtualRow } from './TodoVirtualRow';

export const TodoVirtualList = memo(function TodoVirtualList() {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const visibleTodos = useTodoStore(selectVisibleTodos);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const updateTodo = useTodoStore((s) => s.updateTodo);

  const virtualizer = useVirtualizer({
    count: visibleTodos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76,
    overscan: 5,
  });

  const handleKeyDown = useCallback(
    (index: number, key: string) => {
      if (key === 'ArrowDown' && index < visibleTodos.length - 1) {
        virtualizer.scrollToIndex(index + 1);
        requestAnimationFrame(() => {
          const nextBtn = parentRef.current?.querySelector<HTMLButtonElement>(
            `[data-index="${index + 1}"] [data-action="toggle"]`
          );
          nextBtn?.focus();
        });
      } else if (key === 'ArrowUp' && index > 0) {
        virtualizer.scrollToIndex(index - 1);
        requestAnimationFrame(() => {
          const prevBtn = parentRef.current?.querySelector<HTMLButtonElement>(
            `[data-index="${index - 1}"] [data-action="toggle"]`
          );
          prevBtn?.focus();
        });
      }
    },
    [visibleTodos.length, virtualizer]
  );

  if (visibleTodos.length === 0) {
    return (
      <div 
        className="py-16 text-center text-gray-500 dark:text-gray-400 font-medium text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
        role="status"
      >
        No tasks found.
      </div>
    );
  }

  return (
    <section aria-label="Task list container" className="relative mt-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {visibleTodos.length} {visibleTodos.length === 1 ? 'task' : 'tasks'} available
      </div>

      <div
        ref={parentRef}
        className="max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
        tabIndex={0}
        role="region"
        aria-label="Scrollable Task List"
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}
          role="list"
          aria-label="Tasks"
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const todo = visibleTodos[virtualRow.index];
            if (!todo) return null;
            return (
              <div
                key={todo.id}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="pb-2"
                role="listitem"
              >
                <TodoVirtualRow
                  todo={todo}
                  index={virtualRow.index}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                  onKeyDown={handleKeyDown}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
