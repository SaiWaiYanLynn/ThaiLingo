import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, minTarget, radius } from '@/theme/tokens';

interface Props {
  playing: boolean;
  onPress: () => void;
  label: string; // the English meaning, for the accessibility label
  large?: boolean;
}

export function PlayButton({ playing, onPress, label, large }: Props) {
  const size = large ? 72 : minTarget;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${playing ? 'Stop audio' : 'Play audio'}: ${label}`}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, opacity: pressed ? 0.8 : 1 },
      ]}>
      <Icon name={playing ? 'stop.fill' : 'play.fill'} size={large ? 30 : 20} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
