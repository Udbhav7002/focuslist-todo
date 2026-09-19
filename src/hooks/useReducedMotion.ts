/**
 * @fileoverview Tracks the user's `prefers-reduced-motion` preference.
 * @module hooks/useReducedMotion
 */

import { useEffect, useState } from 'react';

const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MEDIA_QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
