import AsyncStorage from '@react-native-async-storage/async-storage';

import { cleanIds, toggleId } from '@/context/FavoritesContext';
import { DEFAULT_SETTINGS, isValidSettings } from '@/context/SettingsContext';
import { KEYS, readJSON, writeJSON } from '@/storage/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe('storage wrappers', () => {
  it('saves and reads back a value', async () => {
    await writeJSON(KEYS.settings, { showRomanization: false, textSize: 'large' });
    await expect(readJSON(KEYS.settings, DEFAULT_SETTINGS, isValidSettings)).resolves.toEqual({
      showRomanization: false,
      textSize: 'large',
    });
  });

  it('returns the default when nothing is saved', async () => {
    await expect(readJSON(KEYS.settings, DEFAULT_SETTINGS)).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('returns the default for corrupt JSON', async () => {
    await AsyncStorage.setItem(KEYS.settings, '{not json');
    await expect(readJSON(KEYS.settings, DEFAULT_SETTINGS)).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('returns the default for a value with the wrong shape', async () => {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify({ textSize: 'huge' }));
    await expect(readJSON(KEYS.settings, DEFAULT_SETTINGS, isValidSettings)).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('returns the default when storage throws', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('disk'));
    await expect(readJSON(KEYS.favorites, [])).resolves.toEqual([]);
  });

  it('does not throw when a write fails', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk'));
    await expect(writeJSON(KEYS.favorites, ['x'])).resolves.toBe(false);
  });
});

describe('favorites logic', () => {
  it('adds and removes an id', () => {
    const once = toggleId([], 'taxi_meter');
    expect(once).toEqual(['taxi_meter']);
    expect(toggleId(once, 'taxi_meter')).toEqual([]);
  });

  it('ignores unknown ids, duplicates and non-strings', () => {
    expect(cleanIds(['taxi_meter', 'gone_phrase', 'taxi_meter', 42])).toEqual(['taxi_meter']);
    expect(cleanIds('not an array')).toEqual([]);
  });
});
