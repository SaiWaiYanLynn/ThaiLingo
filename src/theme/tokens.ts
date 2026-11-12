// Design tokens. Components must use these values, never hard-coded ones.
// Colour values are proposals from the spec; check contrast before release (NFR-05).
export const colors = {
  primary: '#2D3A8C',
  accent: '#F5B700',
  danger: '#B3261E',
  background: '#FAF8F3',
  surface: '#FFFFFF',
  text: '#1B1B1F',
  textMuted: '#5B5B66',
  border: '#E3E0D8',
  onPrimary: '#FFFFFF',
  showBackground: '#111111',
  showText: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { card: 12, round: 999 } as const;

// Minimum tap target: 48 dp covers both Android (48 dp) and Apple (44 pt) guidelines (NFR-04).
export const minTarget = 48;
