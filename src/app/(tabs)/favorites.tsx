import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConnectedPhraseRow } from '@/components/ConnectedPhraseRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorNote } from '@/components/ErrorNote';
import { ScreenTitle } from '@/components/ScreenTitle';
import { useFavorites } from '@/context/FavoritesContext';
import { getPhrase } from '@/data/content';
import type { Phrase } from '@/data/types';
import { useScreenSpeech } from '@/hooks/useScreenSpeech';
import { colors, spacing } from '@/theme/tokens';

// FR-09: favorite phrases, with an empty state.
export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ids } = useFavorites();
  const { error } = useScreenSpeech();
  const phrases = ids.map(getPhrase).filter((p): p is Phrase => !!p);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <ScreenTitle>Favorites</ScreenTitle>
        <ErrorNote message={error} />
      </View>
      <FlatList
        data={phrases}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ConnectedPhraseRow phrase={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 96 }]}
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            message="No favorites yet. Tap the heart on a phrase to save it here."
            actionLabel="Browse topics"
            onAction={() => router.navigate('/')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
});
