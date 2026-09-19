/**
 * @fileoverview React Context for state management architecture.
 * Eliminates prop drilling and centralizes the Todo API.
 * @module context/TodoContext
 */

import React, { createContext, useContext } from 'react';
import { useTodos } from '../hooks/useTodos';

type TodoContextType = ReturnType<typeof useTodos>;
const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todosApi = useTodos();
  return <TodoContext.Provider value={todosApi}>{children}</TodoContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}
