/**
 * @fileoverview Generic localStorage hook for the FocusList To-Do application.
 * Provides a type-safe, reusable abstraction over the browser's localStorage API
 * with automatic JSON serialization/deserialization and error handling.
 * @module hooks/useLocalStorage
 */

import { useState, useEffect } from 'react';

/**
 * A custom React hook that synchronizes state with the browser's localStorage.
 * Provides the same API as `useState` but persists the value across page refreshes.
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Graceful error handling for corrupt or missing data
 * - Type-safe generics
 *
 * @template T - The type of the stored value.
 * @param {string} key - The localStorage key to use for persistence.
 * @param {T} initialValue - The default value when no stored value exists.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value and a setter function.
 *
 * @example
 * ```tsx
 * const [todos, setTodos] = useLocalStorage<Todo[]>('focuslist-todos', []);
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
