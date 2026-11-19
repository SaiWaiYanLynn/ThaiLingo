import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorNote } from '@/components/ErrorNote';
import { HeartButton } from '@/components/HeartButton';
import { Icon } from '@/components/Icon';
import { PlayButton } from '@/components/PlayButton';
import { ThaiText } from '@/components/ThaiText';
import { useFavorites } from '@/context/FavoritesContext';
import { useSettings } from '@/context/SettingsContext';
import { getPhrase, getTopic } from '@/data/content';
import { useScreenSpeech } from '@/hooks/useScreenSpeech';
import { useTextSizes } from '@/hooks/useTextSizes';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

// FR-06 phrase detail.
export default function PhraseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const phrase = getPhrase(id);
  const sizes = useTextSizes();
  const { settings } = useSettings();
  const { isFavorite, toggle } = useFavorites();
  const { playingId, toggle: togglePlay, error } = useScreenSpeech();

  if (!phrase) return <EmptyState icon="questionmark.circle" message="Phrase not found." />;
  const en = phrase.meaning.en;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: getTopic(phrase.topicId)?.name ?? '' }} />
      <View style={styles.card}>
        <Text style={[styles.english, { fontSize: sizes.english + 2 }]}>{en}</Text>
        <ThaiText size={sizes.thaiDetail} bold style={styles.center}>
          {phrase.thai}
        </ThaiText>
        {settings.showRomanization ? (
          <Text style={[styles.roman, { fontSize: sizes.romanization + 2 }]}>{phrase.romanization}</Text>
        ) : null}
        {phrase.literal ? (
          <View style={styles.literalBox}>
            <Text style={styles.literalLabel}>Word by word</Text>
            <Text style={[styles.literal, { fontSize: sizes.romanization + 2 }]}>{phrase.literal}</Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          <PlayButton large playing={playingId === phrase.id} onPress={() => togglePlay(phrase.id, phrase.thai)} label={en} />
          <HeartButton active={isFavorite(phrase.id)} onPress={() => toggle(phrase.id)} label={en} />
        </View>
      </View>
      <ErrorNote message={error} />
      <Pressable
        onPress={() => router.push({ pathname: '/show/[id]', params: { id: phrase.id } })}
        accessibilityRole="button"
        accessibilityHint="Shows the Thai phrase in large letters for a local person to read"
        style={({ pressed }) => [styles.show, { opacity: pressed ? 0.85 : 1 }]}>
        <Icon name="person.wave.2.fill" size={22} color={colors.onPrimary} />
        <Text style={styles.showText}>Show to local</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push({ pathname: '/feedback/[id]', params: { id: phrase.id } })}
        accessibilityRole="button"
        accessibilityHint="Opens a form to report a problem with this phrase"
        style={styles.report}>
        <Text style={styles.reportText}>Report a problem with this phrase</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  center: { textAlign: 'center' },
  english: { color: colors.text, fontWeight: '600', textAlign: 'center' },
  roman: { color: colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  literalBox: { alignItems: 'center', gap: 2, marginTop: spacing.sm },
  literalLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  literal: { color: colors.text, textAlign: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginTop: spacing.sm },
  show: {
    minHeight: minTarget + 8,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  report: { minHeight: minTarget, alignItems: 'center', justifyContent: 'center' },
  reportText: { color: colors.textMuted, fontSize: 15, textDecorationLine: 'underline' },
  showText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
});
