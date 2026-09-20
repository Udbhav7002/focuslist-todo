/**
 * @fileoverview Global keydown subscription helper.
 * @module hooks/useHotkeys
 */

import { useEffect } from 'react';

/** Subscribes a handler to window keydown events for the component's lifetime. */
export function useHotkeys(handler: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}
