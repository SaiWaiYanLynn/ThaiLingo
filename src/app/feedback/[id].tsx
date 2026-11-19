import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ErrorNote } from '@/components/ErrorNote';
import { ThaiText } from '@/components/ThaiText';
import { getPhrase } from '@/data/content';
import { MAX_MESSAGE_LENGTH, submitFeedback, type FeedbackKind } from '@/services/feedback';
import { colors, minTarget, radius, spacing } from '@/theme/tokens';

const KINDS: { value: FeedbackKind; label: string }[] = [
  { value: 'wrong_translation', label: 'Wrong translation' },
  { value: 'wrong_romanization', label: 'Wrong pronunciation text' },
  { value: 'other', label: 'Something else' },
];

const ERRORS = {
  not_configured: 'Feedback is not set up yet.',
  network: 'No internet connection. Try again when you are online.',
  rate_limited: 'You sent many reports. Please try again in an hour.',
  server: 'The server did not accept the report. Try again later.',
} as const;

// Report a problem with one phrase. The report goes to the Supabase backend.
export default function FeedbackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const phrase = getPhrase(id);
  const [kind, setKind] = useState<FeedbackKind>('wrong_translation');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = !!phrase && message.trim().length > 0 && !sending;

  async function onSend() {
    if (!phrase || !canSend) return;
    setSending(true);
    setError(null);
    const result = await submitFeedback({ phraseId: phrase.id, kind, message });
    setSending(false);
    if (result.ok) setSent(true);
    else setError(ERRORS[result.reason]);
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Report a problem' }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {phrase ? (
          <View style={styles.phrase}>
            <Text style={styles.english}>{phrase.meaning.en}</Text>
            <ThaiText size={24}>{phrase.thai}</ThaiText>
          </View>
        ) : (
          <Text style={styles.english}>Phrase not found.</Text>
        )}

        {sent ? (
          <View style={styles.thanks} accessibilityRole="alert">
            <Text style={styles.thanksTitle}>Thank you!</Text>
            <Text style={styles.thanksText}>Your report was sent. It helps us fix the phrasebook.</Text>
            <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.primary}>
              <Text style={styles.primaryText}>Done</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.label}>What is wrong?</Text>
            <View style={styles.kinds}>
              {KINDS.map((k) => {
                const active = k.value === kind;
                return (
                  <Pressable
                    key={k.value}
                    onPress={() => setKind(k.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[styles.kind, active && styles.kindActive]}>
                    <Text style={[styles.kindText, active && styles.kindTextActive]}>{k.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Tell us more</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="For example: a Thai person says this is more polite."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              accessibilityLabel="Describe the problem"
            />
            <ErrorNote message={error} />
            <Pressable
              onPress={onSend}
              disabled={!canSend}
              accessibilityRole="button"
              style={[styles.primary, !canSend && styles.disabled]}>
              <Text style={styles.primaryText}>{sending ? 'Sending...' : 'Send report'}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  phrase: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  english: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  label: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: spacing.sm },
  kinds: { gap: spacing.sm },
  kind: {
    minHeight: minTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  kindActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  kindText: { color: colors.text, fontSize: 16 },
  kindTextActive: { color: colors.onPrimary, fontWeight: '600' },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  primary: {
    minHeight: minTarget + 8,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  thanks: { alignItems: 'stretch', gap: spacing.sm, marginTop: spacing.lg },
  thanksTitle: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  thanksText: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
});
