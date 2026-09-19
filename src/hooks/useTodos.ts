import { useState, useEffect, useMemo } from 'react';
import { Todo, Priority } from '../types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('focuslist-todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  useEffect(() => {
    localStorage.setItem('focuslist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ? true : statusFilter === 'Active' ? !todo.completed : todo.completed;
      const matchesPriority = priorityFilter === 'All' ? true : todo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, searchQuery, statusFilter, priorityFilter]);

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  return {
    todos: filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
  };
}
