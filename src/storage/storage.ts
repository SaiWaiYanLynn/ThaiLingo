import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  favorites: 'thailingo:favorites',
  settings: 'thailingo:settings',
  onboarded: 'thailingo:onboarded',
} as const;

// Reads JSON safely. Returns the fallback when the value is missing, corrupt or storage fails (FR-14).
export async function readJSON<T>(key: string, fallback: T, isValid?: (v: unknown) => boolean): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

// Writes JSON safely. A storage error never crashes the app.
export async function writeJSON(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
