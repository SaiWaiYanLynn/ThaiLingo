import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useSpeech } from '@/context/SpeechContext';

// Use on every screen that plays audio: speech stops when the user leaves the screen (FR-05, NFR-03).
export function useScreenSpeech() {
  const speech = useSpeech();
  const { stop, clearError } = speech;
  useFocusEffect(
    useCallback(() => {
      return () => {
        stop();
        clearError();
      };
    }, [stop, clearError]),
  );
  return speech;
}
