import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenTitle } from '@/components/ScreenTitle';
import { TopicCard } from '@/components/TopicCard';
import { getPhrasesByTopic, getTopics } from '@/data/content';
import { useTextSizes } from '@/hooks/useTextSizes';
import { colors, spacing } from '@/theme/tokens';

// FR-02: six topics in a two-column grid.
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sizes = useTextSizes();
  const topics = getTopics();
  const rows = [topics.slice(0, 2), topics.slice(2, 4), topics.slice(4, 6)];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 96 }]}>
      <ScreenTitle size={sizes.title + 8}>ThaiLingo</ScreenTitle>
      <Text style={[styles.tagline, { fontSize: sizes.english }]}>Survive Thailand in 30 phrases.</Text>
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                count={getPhrasesByTopic(topic.id).length}
                labelSize={sizes.label}
                onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topic.id } })}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg },
  tagline: { color: colors.textMuted, marginBottom: spacing.xl },
  grid: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
});
