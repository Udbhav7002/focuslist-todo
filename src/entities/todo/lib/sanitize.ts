import { MAX_TAGS } from '../model/constants';

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function isValidTaskTitle(text: string): boolean {
  return text.trim().length > 0;
}

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
