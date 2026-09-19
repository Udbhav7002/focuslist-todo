import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Priority } from '../types';

interface TodoFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [priorityInput, setPriorityInput] = useState<Priority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAdd(inputValue.trim(), priorityInput);
    setInputValue('');
    setPriorityInput('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 flex-wrap sm:flex-nowrap bg-white p-1 rounded-xl shadow-sm border border-gray-100">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 min-w-[200px] px-4 py-2 bg-transparent focus:outline-none"
        aria-label="New task input"
      />
      <select
        value={priorityInput}
        onChange={(e) => setPriorityInput(e.target.value as Priority)}
        className="px-3 py-2 border-l border-gray-100 bg-transparent focus:outline-none text-sm text-gray-600"
        aria-label="Select priority"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        aria-label="Add task"
      >
        <PlusCircle className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Add</span>
      </button>
    </form>
  );
}
