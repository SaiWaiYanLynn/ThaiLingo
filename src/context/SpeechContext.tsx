import * as Speech from 'expo-speech';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

// Audio uses the phone's Thai text-to-speech voice instead of recordings (team decision, see DECISIONS.md).
const LANGUAGE = 'th-TH';
const RATE = 0.85;

export type ThaiVoiceStatus = 'unknown' | 'available' | 'missing';

interface SpeechValue {
  playingId: string | null;
  error: string | null;
  voiceStatus: ThaiVoiceStatus;
  toggle: (id: string, thai: string) => void;
  stop: () => void;
  clearError: () => void;
}

const SpeechContext = createContext<SpeechValue | null>(null);

export const VOICE_MISSING_MESSAGE =
  'Audio is not available. Add a Thai voice in iPhone Settings > Accessibility > Spoken Content > Voices.';

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<ThaiVoiceStatus>('unknown');
  const playingRef = useRef<string | null>(null);

  const setPlaying = (id: string | null) => {
    playingRef.current = id;
    setPlayingId(id);
  };

  // Check once whether the phone has a Thai voice.
  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        const hasThai = voices.some((v) => v.language?.toLowerCase().startsWith('th'));
        setVoiceStatus(hasThai ? 'available' : 'missing');
      })
      .catch(() => setVoiceStatus('unknown'));
  }, []);

  const stop = useCallback(() => {
    if (playingRef.current !== null) setPlaying(null);
    void Speech.stop();
  }, []);

  // Stop speech when the app goes to the background (NFR-03).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') stop();
    });
    return () => sub.remove();
  }, [stop]);

  const toggle = useCallback(
    (id: string, thai: string) => {
      // Tapping the playing phrase stops it. Starting a new one stops the old one first (FR-05).
      if (playingRef.current === id) {
        stop();
        return;
      }
      void Speech.stop();
      if (voiceStatus === 'missing') {
        setPlaying(null);
        setError(VOICE_MISSING_MESSAGE);
        return;
      }
      setError(null);
      setPlaying(id);
      const finish = () => {
        if (playingRef.current === id) setPlaying(null);
      };
      try {
        Speech.speak(thai, {
          language: LANGUAGE,
          rate: RATE,
          onDone: finish,
          onStopped: finish,
          onError: () => {
            finish();
            setError(VOICE_MISSING_MESSAGE);
          },
        });
      } catch {
        finish();
        setError(VOICE_MISSING_MESSAGE);
      }
    },
    [stop, voiceStatus],
  );

  const value = useMemo<SpeechValue>(
    () => ({ playingId, error, voiceStatus, toggle, stop, clearError: () => setError(null) }),
    [playingId, error, voiceStatus, toggle, stop],
  );

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}

export function useSpeech(): SpeechValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error('useSpeech must be used inside SpeechProvider');
  return ctx;
}
