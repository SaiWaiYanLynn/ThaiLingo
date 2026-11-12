import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isKnownPhraseId } from '@/data/content';
import { KEYS, readJSON, writeJSON } from '@/storage/storage';

// Pure helpers, exported for tests.
export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  // Favorites store IDs only. Unknown IDs (for example after a content update) are ignored.
  return [...new Set(value.filter((x): x is string => typeof x === 'string' && isKnownPhraseId(x)))];
}

interface FavoritesValue {
  loaded: boolean;
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    readJSON<unknown>(KEYS.favorites, []).then((v) => {
      if (!active) return;
      setIds(cleanIds(v));
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((next: string[]) => {
    void writeJSON(KEYS.favorites, next);
    return next;
  }, []);

  const toggle = useCallback((id: string) => setIds((prev) => save(toggleId(prev, id))), [save]);
  const clear = useCallback(() => setIds(save([])), [save]);

  const value = useMemo<FavoritesValue>(
    () => ({ loaded, ids, isFavorite: (id) => ids.includes(id), toggle, clear }),
    [loaded, ids, toggle, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
