import { useState, useEffect, useMemo } from 'react';
import { Trash2, CheckCircle2, Circle, PlusCircle, Pencil, X } from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
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
  const [priorityInput, setPriorityInput] = useState<Priority>('Medium');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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
      priority: priorityInput,
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

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      )
    );
    setEditingId(null);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Active' ? !todo.completed :
        todo.completed;
      const matchesPriority = priorityFilter === 'All' ? true : todo.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, searchQuery, statusFilter, priorityFilter]);

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">FocusList</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build. Organize. Simplify.
          </p>
        </header>

        {/* Task Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-900">{todos.length}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Pending Tasks</p>
            <p className="text-2xl font-bold text-orange-900">{pendingCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-green-900">{completedCount}</p>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6 flex-wrap sm:flex-nowrap" aria-label="Add a new task">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="New task input"
          />
          <select 
            value={priorityInput} 
            onChange={(e) => setPriorityInput(e.target.value as Priority)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            aria-label="Select priority"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white w-full sm:w-auto px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            aria-label="Add task"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="sm:hidden">Add Task</span>
          </button>
        </form>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search tasks"
          />
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              aria-label="Filter by priority"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-3" aria-label="Task list">
          {filteredTodos.length === 0 ? (
            <li className="text-center text-gray-500 py-6" role="status">
              No tasks found.
            </li>
          ) : (
            filteredTodos.map((todo) => (
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
                  
                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:bg-gray-100 p-1 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex flex-col overflow-hidden">
                       <span
                        className={`truncate transition-all ${
                          todo.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1 w-max ${getPriorityColor(todo.priority)}`}>
                        {todo.priority} Priority
                      </span>
                    </div>
                  )}
                </div>

                {editingId !== todo.id && (
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-colors"
                      aria-label={`Edit task: ${todo.text}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-2 transition-colors"
                      aria-label={`Delete task: ${todo.text}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
