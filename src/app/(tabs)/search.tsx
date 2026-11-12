import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConnectedPhraseRow } from '@/components/ConnectedPhraseRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorNote } from '@/components/ErrorNote';
import { Icon } from '@/components/Icon';
import { ScreenTitle } from '@/components/ScreenTitle';
import { getAllPhrases } from '@/data/content';
import { useScreenSpeech } from '@/hooks/useScreenSpeech';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';
import { searchPhrases } from '@/utils/search';

// FR-10: filter all 30 phrases by English, romanization or Thai as the user types.
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { error } = useScreenSpeech();
  const results = useMemo(() => searchPhrases(getAllPhrases(), query), [query]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <ScreenTitle>Search</ScreenTitle>
        <View style={styles.field}>
          <Icon name="magnifyingglass" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="English, romanization or Thai"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="never"
            accessibilityLabel="Search phrases"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search" style={styles.clear}>
              <Icon name="xmark.circle.fill" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        <ErrorNote message={error} />
      </View>
      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ConnectedPhraseRow phrase={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 96 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<EmptyState icon="text.magnifyingglass" message="No phrases found" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: spacing.md },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.md,
    minHeight: minTarget,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: spacing.sm },
  clear: { width: minTarget, height: minTarget, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
});
