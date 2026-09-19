import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { TodoStats } from './components/TodoStats';
import { useTodos } from './hooks/useTodos';
import { Search } from 'lucide-react';

function App() {
  const {
    todos, stats, addTodo, toggleTodo, deleteTodo, editTodo,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8 font-sans selection:bg-blue-200">
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 overflow-hidden">
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">FocusList</h1>
            <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Build. Organize. Simplify.</p>
          </div>
        </header>

        <TodoStats stats={stats} />
        <TodoForm onAdd={addTodo} />

        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200 shadow-inner">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border-none bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              aria-label="Search tasks"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border-none bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border-none bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
              aria-label="Filter by priority"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <ul className="space-y-3" aria-label="Task list">
          {todos.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              <p className="text-gray-500 font-medium">No tasks found in this view.</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new task above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
