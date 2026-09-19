/**
 * @fileoverview Small DOM helpers.
 * @module utils/dom
 */

/** Moves focus to an element by id (no-op when absent). */
export function focusById(id: string): void {
  document.getElementById(id)?.focus();
}
