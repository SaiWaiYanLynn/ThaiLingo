import Constants from 'expo-constants';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenTitle } from '@/components/ScreenTitle';
import { useFavorites } from '@/context/FavoritesContext';
import { useSettings } from '@/context/SettingsContext';
import { useSpeech } from '@/context/SpeechContext';
import type { TextSize } from '@/data/types';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

const SIZES: { value: TextSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
];

// FR-11: romanization, text size, reset favorites, About.
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, setShowRomanization, setTextSize } = useSettings();
  const { ids, clear } = useFavorites();
  const { voiceStatus } = useSpeech();

  const confirmReset = () =>
    Alert.alert('Reset favorites?', 'This removes all saved phrases. You cannot undo this.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: clear },
    ]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 96 }]}>
      <ScreenTitle>Settings</ScreenTitle>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Show romanization</Text>
          <Switch
            value={settings.showRomanization}
            onValueChange={setShowRomanization}
            trackColor={{ true: colors.primary, false: colors.border }}
            accessibilityLabel="Show romanization"
          />
        </View>
        <View style={styles.divider} />
        <Text style={[styles.label, styles.padTop]}>Text size</Text>
        <View style={styles.segment} accessibilityRole="radiogroup">
          {SIZES.map((s) => {
            const selected = settings.textSize === s.value;
            return (
              <Pressable
                key={s.value}
                onPress={() => setTextSize(s.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.segmentItem, selected && styles.segmentSelected]}>
                <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Pressable
          onPress={confirmReset}
          disabled={ids.length === 0}
          accessibilityRole="button"
          style={[styles.row, ids.length === 0 && styles.disabled]}>
          <Text style={[styles.label, { color: colors.danger }]}>Reset favorites</Text>
          <Text style={styles.muted}>{ids.length} saved</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>About</Text>
      <View style={styles.card}>
        <Text style={styles.about}>ThaiLingo version {Constants.expoConfig?.version ?? '1.0.0'}</Text>
        <Text style={styles.about}>
          Audio uses your iPhone&apos;s Thai text-to-speech voice
          {voiceStatus === 'missing' ? ' (no Thai voice found on this phone)' : ''}.
        </Text>
        <Text style={styles.about}>
          The phrases are checked against trusted sources, but not by a native Thai speaker.
        </Text>
        <Text style={styles.about}>Romanization is approximate. Listen to the audio.</Text>
        <Text style={styles.about}>Made by Wai Yan Lynn and Pyae Sone.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: minTarget },
  label: { fontSize: 16, color: colors.text, fontWeight: '500' },
  padTop: { paddingTop: spacing.xs },
  muted: { fontSize: 14, color: colors.textMuted },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  disabled: { opacity: 0.5 },
  segment: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.card, padding: 4, gap: 4 },
  segmentItem: { flex: 1, minHeight: minTarget - 4, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  segmentSelected: { backgroundColor: colors.primary },
  segmentText: { fontSize: 15, color: colors.text },
  segmentTextSelected: { color: colors.onPrimary, fontWeight: '700' },
  section: { fontSize: 13, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', marginTop: spacing.sm },
  about: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
});
