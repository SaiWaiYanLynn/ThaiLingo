import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Settings, TextSize } from '@/data/types';
import { KEYS, readJSON, writeJSON } from '@/storage/storage';

export const DEFAULT_SETTINGS: Settings = { showRomanization: true, textSize: 'normal' };

const TEXT_SIZES: TextSize[] = ['small', 'normal', 'large'];

export function isValidSettings(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Partial<Settings>;
  return typeof s.showRomanization === 'boolean' && TEXT_SIZES.includes(s.textSize as TextSize);
}

interface SettingsValue {
  loaded: boolean;
  settings: Settings;
  onboarded: boolean;
  setShowRomanization: (value: boolean) => void;
  setTextSize: (value: TextSize) => void;
  completeOnboarding: () => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [onboarded, setOnboarded] = useState(false);

  // Load asynchronously once. Corrupt or missing data falls back to defaults (FR-14).
  useEffect(() => {
    let active = true;
    Promise.all([
      readJSON<Settings>(KEYS.settings, DEFAULT_SETTINGS, isValidSettings),
      readJSON<boolean>(KEYS.onboarded, false, (v) => typeof v === 'boolean'),
    ]).then(([s, o]) => {
      if (!active) return;
      setSettings(s);
      setOnboarded(o);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void writeJSON(KEYS.settings, next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsValue>(
    () => ({
      loaded,
      settings,
      onboarded,
      setShowRomanization: (showRomanization) => update({ showRomanization }),
      setTextSize: (textSize) => update({ textSize }),
      completeOnboarding: () => {
        setOnboarded(true);
        void writeJSON(KEYS.onboarded, true);
      },
    }),
    [loaded, settings, onboarded, update],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
