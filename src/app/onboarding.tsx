import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useSettings } from '@/context/SettingsContext';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

const POINTS = [
  { icon: 'speaker.wave.2.fill', title: 'Listen', text: 'Hear each phrase in Thai, even with no internet.' },
  { icon: 'heart.fill', title: 'Save', text: 'Keep the phrases you need most in Favorites.' },
  { icon: 'person.wave.2.fill', title: 'Show', text: 'Show the Thai text in big letters for a local to read.' },
];

// FR-01: shown on first launch only. Start and Skip both finish onboarding.
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useSettings();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg }]}>
      <Pressable onPress={completeOnboarding} accessibilityRole="button" style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.logo}>ThaiLingo</Text>
        <Text style={styles.tagline}>Survive Thailand in 30 phrases.</Text>
        <View style={styles.points}>
          {POINTS.map((p) => (
            <View key={p.title} style={styles.point}>
              <View style={styles.pointIcon}>
                <Icon name={p.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.pointText}>
                <Text style={styles.pointTitle}>{p.title}</Text>
                <Text style={styles.pointBody}>{p.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Pressable onPress={completeOnboarding} accessibilityRole="button" style={styles.start}>
        <Text style={styles.startText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  skip: { position: 'absolute', right: spacing.lg, top: 56, minHeight: minTarget, minWidth: minTarget, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  skipText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  body: { flex: 1, justifyContent: 'center' },
  logo: { fontSize: 40, fontWeight: '800', color: colors.primary },
  tagline: { fontSize: 18, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xxl },
  points: { gap: spacing.xl },
  point: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  pointIcon: { width: 48, height: 48, borderRadius: radius.round, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  pointText: { flex: 1 },
  pointTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  pointBody: { fontSize: 15, color: colors.textMuted },
  start: { minHeight: minTarget + 8, borderRadius: radius.round, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  startText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
});
