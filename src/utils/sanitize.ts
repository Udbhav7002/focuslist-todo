/**
 * @fileoverview Input sanitization utilities. Prevents XSS and validates
 * user input before it is stored or rendered.
 * @module utils/sanitize
 */

import { MAX_TAGS } from './constants';

/**
 * Sanitizes a user-provided string: trims whitespace and escapes HTML
 * metacharacters so the value is safe to store and render as text.
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

/** True when a (raw) task title is non-empty after trimming. */
export function isValidTaskTitle(text: string): boolean {
  return text.trim().length > 0;
}

/**
 * Parses a comma-separated tag string into a sanitized, deduplicated,
 * length-capped tag list. Internal whitespace becomes dashes.
 */
export function parseTags(raw: string, max: number = MAX_TAGS): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const tag = sanitizeInput(part).replace(/\s+/g, '-');
    if (tag && !seen.has(tag.toLowerCase()) && out.length < max) {
      seen.add(tag.toLowerCase());
      out.push(tag);
    }
  }
  return out;
}
