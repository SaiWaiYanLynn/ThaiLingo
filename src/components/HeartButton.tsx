import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, minTarget } from '@/theme/tokens';

interface Props {
  active: boolean;
  onPress: () => void;
  label: string;
}

// The heart changes shape (outline to filled), not only colour (accessibility rule 8.6).
export function HeartButton({ active, onPress, label }: Props) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${active ? 'Remove from favorites' : 'Add to favorites'}: ${label}`}
      hitSlop={4}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
      <Icon name={active ? 'heart.fill' : 'heart'} size={24} color={active ? colors.accent : colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: minTarget, height: minTarget, alignItems: 'center', justifyContent: 'center' },
});
