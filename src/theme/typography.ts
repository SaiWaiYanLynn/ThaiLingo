import type { TextSize } from '@/data/types';

export const thaiFont = {
  regular: 'NotoSansThai_400Regular',
  bold: 'NotoSansThai_700Bold',
} as const;

// Base sizes at the "Normal" text size (spec section 8.2).
export const baseSizes = {
  thaiCard: 24,
  thaiDetail: 40,
  thaiShow: 72,
  english: 16,
  romanization: 14,
  title: 22,
  label: 15,
} as const;

export type SizeKey = keyof typeof baseSizes;

export const textSizeMultiplier: Record<TextSize, number> = {
  small: 0.9,
  normal: 1,
  large: 1.25,
};

// Thai needs extra line height so tone marks and vowels are not cut off.
export const THAI_LINE_HEIGHT = 1.5;

export function scaledSizes(textSize: TextSize): Record<SizeKey, number> {
  const m = textSizeMultiplier[textSize];
  const out = {} as Record<SizeKey, number>;
  (Object.keys(baseSizes) as SizeKey[]).forEach((k) => {
    out[k] = Math.round(baseSizes[k] * m);
  });
  return out;
}
