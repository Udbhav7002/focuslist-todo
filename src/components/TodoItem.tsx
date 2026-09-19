import { useState } from 'react';
import { Trash2, CheckCircle2, Circle, Pencil, X } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(todo.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        todo.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button
          onClick={() => onToggle(todo.id)}
          className="text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors"
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          aria-pressed={todo.completed}
        >
          {todo.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button onClick={handleSave} className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden">
            <span className={`truncate transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {todo.text}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1 w-max ${getPriorityColor(todo.priority)}`}>
              {todo.priority}
            </span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 flex-shrink-0 ml-2 opacity-0 sm:opacity-100 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1.5 transition-colors"
            aria-label={`Edit task: ${todo.text}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1.5 transition-colors"
            aria-label={`Delete task: ${todo.text}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
}
