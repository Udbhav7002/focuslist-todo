/**
 * @fileoverview Theme management with three states (system / light / dark),
 * system-preference tracking, and `<html>` class + color-scheme syncing.
 * @module hooks/useTheme
 */

import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEME_STORAGE_KEY } from '../utils/constants';

export type Theme = 'system' | 'light' | 'dark';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches;
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system');
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  // Track live changes of the OS-level preference while in "system" mode.
  useEffect(() => {
    const mq = window.matchMedia(MEDIA_QUERY);
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const dark = theme === 'dark' || (theme === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

  /** Cycles system → light → dark. */
  const cycleTheme = useCallback(() => {
    setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'));
  }, [setTheme]);

  return { theme, dark, setTheme, cycleTheme };
}
