import { useState } from 'react';
import { useTodoStore } from '../../app/store/useTodoStore';
import { MAX_TASK_LENGTH } from '../../entities/todo/model/constants';
import type { Priority } from '../../entities/todo/model/types';
import { PlusCircleIcon } from '../../components/Icons';
export function TodoForm() {
  const addTodo = useTodoStore((s) => s.addTodo);

  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addTodo(text, {
      priority,
      dueDate: dueDate || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setText('');
    setDueDate('');
    setTags('');
    setPriority('Medium');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
      aria-label="Add new task"
    >
      <div>
        <label htmlFor="new-task-input" className="sr-only">
          Task Title
        </label>
        <input
          id="new-task-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={MAX_TASK_LENGTH}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 font-sans"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="task-priority" className="sr-only">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full min-h-[44px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="task-due-date" className="sr-only">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full min-h-[44px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="task-tags" className="sr-only">Tags (comma-separated)</label>
          <input
            id="task-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (e.g. work, urgent)"
            className="w-full min-h-[44px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}
