import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Circle, PlusCircle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('focuslist-todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('focuslist-todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };
    
    setTodos((prev) => [...prev, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">FocusList</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build. Organize. Simplify.
          </p>
        </header>

        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6" aria-label="Add a new task">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="New task input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Add task"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </form>

        <div className="mb-4 flex justify-between items-center text-sm text-gray-600 border-b pb-2">
          <span>Total tasks: {todos.length}</span>
          <span>Completed: {completedCount}</span>
        </div>

        <ul className="space-y-3" aria-label="Task list">
          {todos.length === 0 ? (
            <li className="text-center text-gray-500 py-6" role="status">
              No tasks yet. Add one to get started!
            </li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  todo.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 flex-shrink-0"
                    aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                    aria-pressed={todo.completed}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <span
                    className={`truncate transition-all ${
                      todo.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-2 flex-shrink-0 ml-2"
                  aria-label={`Delete task: ${todo.text}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
