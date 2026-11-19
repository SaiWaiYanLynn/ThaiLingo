import { NotoSansThai_400Regular, NotoSansThai_700Bold, useFonts } from '@expo-google-fonts/noto-sans-thai';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { SpeechProvider } from '@/context/SpeechContext';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts({ NotoSansThai_400Regular, NotoSansThai_700Bold });
  const { loaded: settingsLoaded, onboarded } = useSettings();
  const { loaded: favoritesLoaded } = useFavorites();
  // Show nothing until fonts and saved data are ready. A font error falls back to the system font.
  const ready = (fontsLoaded || !!fontError) && settingsLoaded && favoritesLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="topic/[id]" options={{ title: '' }} />
          <Stack.Screen name="phrase/[id]" options={{ title: '' }} />
          <Stack.Screen name="feedback/[id]" options={{ title: 'Report a problem' }} />
          <Stack.Screen
            name="show/[id]"
            options={{ presentation: 'fullScreenModal', headerShown: false, animation: 'fade' }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <SpeechProvider>
          <RootNavigator />
        </SpeechProvider>
      </FavoritesProvider>
    </SettingsProvider>
  );
}
