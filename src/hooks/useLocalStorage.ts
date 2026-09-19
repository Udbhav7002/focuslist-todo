/**
 * @fileoverview Type-safe localStorage hook with JSON serialization,
 * corruption-tolerant reads, optional value revival/migration,
 * and cross-tab synchronization via the `storage` event.
 * @module hooks/useLocalStorage
 */

import { useEffect, useState } from 'react';

/**
 * Synchronizes a state value with localStorage.
 *
 * @template T - Stored value type.
 * @param key - localStorage key.
 * @param initialValue - Fallback when nothing valid is stored.
 * @param revive - Optional migration/validation applied to parsed values.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  revive?: (raw: unknown) => T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const parsed: unknown = JSON.parse(item);
        return revive ? revive(parsed) : (parsed as T);
      }
    } catch (error) {
      console.warn(`[FocusList] Failed to read localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  });

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[FocusList] Failed to write localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Sync changes from other tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        const parsed: unknown = JSON.parse(e.newValue);
        setValue(revive ? revive(parsed) : (parsed as T));
      } catch {
        /* ignore malformed cross-tab payloads */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, revive]);

  return [value, setValue] as const;
}
