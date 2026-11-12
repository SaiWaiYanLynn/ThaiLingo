import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HeartButton } from '@/components/HeartButton';
import { PlayButton } from '@/components/PlayButton';
import { ThaiText } from '@/components/ThaiText';
import type { Phrase } from '@/data/types';
import { colors, radius, spacing } from '@/theme/tokens';
import type { SizeKey } from '@/theme/typography';

interface Props {
  phrase: Phrase;
  sizes: Record<SizeKey, number>;
  showRomanization: boolean;
  playing: boolean;
  favorite: boolean;
  onOpen: () => void;
  onPlay: () => void;
  onToggleFavorite: () => void;
}

// Three separate tap areas: text opens detail, play plays audio, heart toggles favorite (spec 8.5).
export function PhraseRow({ phrase, sizes, showRomanization, playing, favorite, onOpen, onPlay, onToggleFavorite }: Props) {
  const en = phrase.meaning.en;
  return (
    <View style={styles.row}>
      <PlayButton playing={playing} onPress={onPlay} label={en} />
      <Pressable
        onPress={onOpen}
        style={styles.text}
        accessibilityRole="button"
        accessibilityHint="Opens the phrase details"
        testID={`phrase-open-${phrase.id}`}>
        <Text style={[styles.english, { fontSize: sizes.english }]}>{en}</Text>
        <ThaiText size={sizes.thaiCard}>{phrase.thai}</ThaiText>
        {showRomanization ? (
          <Text testID="romanization" style={[styles.roman, { fontSize: sizes.romanization }]}>
            {phrase.romanization}
          </Text>
        ) : null}
      </Pressable>
      <HeartButton active={favorite} onPress={onToggleFavorite} label={en} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  text: { flex: 1, paddingVertical: spacing.xs },
  english: { color: colors.text, fontWeight: '600' },
  roman: { color: colors.textMuted, fontStyle: 'italic' },
});
