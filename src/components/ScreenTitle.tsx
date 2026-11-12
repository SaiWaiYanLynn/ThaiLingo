import { StyleSheet, Text } from 'react-native';

import { colors, spacing } from '@/theme/tokens';

export function ScreenTitle({ children, size = 28 }: { children: string; size?: number }) {
  return (
    <Text accessibilityRole="header" style={[styles.title, { fontSize: size }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: '800', marginBottom: spacing.sm },
});
