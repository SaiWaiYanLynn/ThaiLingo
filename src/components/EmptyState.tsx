import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

interface Props {
  icon: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Icon name={icon} size={40} color={colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  message: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
  button: {
    minHeight: minTarget,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '600' },
});
