import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import type { Topic } from '@/data/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props {
  topic: Topic;
  count: number;
  labelSize: number;
  onPress: () => void;
}

export function TopicCard({ topic, count, labelSize, onPress }: Props) {
  const danger = topic.id === 'emergency';
  const fg = danger ? colors.onPrimary : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${topic.name}, ${count} phrases`}
      style={({ pressed }) => [
        styles.card,
        danger && styles.danger,
        { opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <Icon name={topic.icon} size={28} color={fg} />
      </View>
      <Text style={[styles.name, { fontSize: labelSize + 3, color: danger ? colors.onPrimary : colors.text }]}>
        {topic.name}
      </Text>
      <Text style={[styles.count, { fontSize: labelSize - 1, color: danger ? colors.onPrimary : colors.textMuted }]}>
        {count} phrases
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
    justifyContent: 'flex-end',
  },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
  },
  iconWrapDanger: { backgroundColor: 'rgba(255,255,255,0.18)' },
  name: { fontWeight: '700' },
  count: {},
});
