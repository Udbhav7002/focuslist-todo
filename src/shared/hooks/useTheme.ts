import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '../../entities/todo/model/constants';

export type Theme = 'system' | 'light' | 'dark';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as Theme) || 'system';
    } catch {
      return 'system';
    }
  });

  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

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

  const cycleTheme = useCallback(() => {
    setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'));
  }, []);

  return { theme, dark, setTheme, cycleTheme };
}
