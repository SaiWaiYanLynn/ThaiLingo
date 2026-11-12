import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConnectedPhraseRow } from '@/components/ConnectedPhraseRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorNote } from '@/components/ErrorNote';
import { Icon } from '@/components/Icon';
import { emergencyNumbers, getPhrasesByTopic, getTopic } from '@/data/content';
import { useScreenSpeech } from '@/hooks/useScreenSpeech';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

// FR-03 topic phrase list, FR-12 emergency numbers.
export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getTopic(id);
  const { error } = useScreenSpeech();

  if (!topic) return <EmptyState icon="questionmark.circle" message="Topic not found." />;
  const phrases = getPhrasesByTopic(topic.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: topic.name }} />
      {topic.id === 'emergency' ? <EmergencyNumbers /> : null}
      <ErrorNote message={error} />
      {phrases.map((p) => (
        <ConnectedPhraseRow key={p.id} phrase={p} />
      ))}
    </ScrollView>
  );
}

function EmergencyNumbers() {
  return (
    <View style={styles.emergency}>
      <Text style={styles.emergencyTitle}>Emergency numbers in Thailand</Text>
      {emergencyNumbers.map((e) => (
        <Pressable
          key={e.number}
          // Opens the dialer with the number filled in. It never calls automatically.
          onPress={() => Linking.openURL(`tel:${e.number}`).catch(() => {})}
          accessibilityRole="button"
          accessibilityLabel={`Call ${e.label}, ${e.number}`}
          style={styles.numberRow}>
          <Icon name="phone.fill" size={18} color={colors.danger} />
          <Text style={styles.numberLabel}>{e.label}</Text>
          <Text style={styles.number}>{e.number}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  emergency: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    gap: spacing.xs,
  },
  emergencyTitle: { color: colors.danger, fontWeight: '700', fontSize: 15, marginBottom: spacing.xs },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: minTarget },
  numberLabel: { flex: 1, fontSize: 16, color: colors.text },
  number: { fontSize: 20, fontWeight: '800', color: colors.danger },
});
