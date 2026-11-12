import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ThaiText } from '@/components/ThaiText';
import { getPhrase } from '@/data/content';
import { colors, minTarget, spacing } from '@/theme/tokens';
import { baseSizes } from '@/theme/typography';

// FR-07: full-screen Thai text for a local person to read. The screen stays awake while open.
export default function ShowToLocalScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const phrase = getPhrase(id);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={styles.close}>
        <Icon name="xmark" size={24} color={colors.showText} />
      </Pressable>
      <View style={styles.center}>
        {phrase ? (
          <ThaiText
            size={baseSizes.thaiShow}
            bold
            color={colors.showText}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
            numberOfLines={3}
            style={styles.thai}>
            {phrase.thai}
          </ThaiText>
        ) : (
          <Text style={styles.english}>Phrase not found.</Text>
        )}
      </View>
      {phrase ? <Text style={styles.english}>{phrase.meaning.en}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.showBackground, paddingHorizontal: spacing.xl },
  close: {
    alignSelf: 'flex-end',
    width: minTarget,
    height: minTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  center: { flex: 1, justifyContent: 'center' },
  thai: { textAlign: 'center' },
  english: { color: '#BDBDC6', fontSize: 18, textAlign: 'center' },
});
