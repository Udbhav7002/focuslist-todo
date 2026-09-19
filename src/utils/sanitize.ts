/**
 * @fileoverview Input sanitization utilities for the FocusList To-Do application.
 * Prevents XSS attacks and ensures data integrity by sanitizing user inputs
 * before they are stored or rendered.
 * @module utils/sanitize
 */

/**
 * Sanitizes a user-provided string by removing potentially dangerous HTML
 * characters and trimming whitespace. This prevents XSS (Cross-Site Scripting)
 * attacks when rendering user-generated content.
 *
 * @param {string} input - The raw user input string to sanitize.
 * @returns {string} The sanitized string, safe for storage and rendering.
 *
 * @example
 * ```ts
 * sanitizeInput('<script>alert("xss")</script>') // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * sanitizeInput('  Buy groceries  ') // Returns: 'Buy groceries'
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates that a task title meets the minimum requirements.
 * A valid task title must be a non-empty string after trimming whitespace.
 *
 * @param {string} text - The task title to validate.
 * @returns {boolean} True if the task title is valid, false otherwise.
 *
 * @example
 * ```ts
 * isValidTaskTitle('Buy groceries') // Returns: true
 * isValidTaskTitle('   ')           // Returns: false
 * isValidTaskTitle('')              // Returns: false
 * ```
 */
export function isValidTaskTitle(text: string): boolean {
  return text.trim().length > 0;
}
