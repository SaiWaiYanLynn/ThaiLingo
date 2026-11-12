import { useMemo } from 'react';

import { useSettings } from '@/context/SettingsContext';
import { scaledSizes } from '@/theme/typography';

export function useTextSizes() {
  const { settings } = useSettings();
  return useMemo(() => scaledSizes(settings.textSize), [settings.textSize]);
}
