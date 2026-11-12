import { useRouter } from 'expo-router';

import { PhraseRow } from '@/components/PhraseRow';
import { useFavorites } from '@/context/FavoritesContext';
import { useSettings } from '@/context/SettingsContext';
import { useSpeech } from '@/context/SpeechContext';
import type { Phrase } from '@/data/types';
import { useTextSizes } from '@/hooks/useTextSizes';

// PhraseRow wired to settings, favorites, speech and navigation. Used by Topic, Search and Favorites.
export function ConnectedPhraseRow({ phrase }: { phrase: Phrase }) {
  const router = useRouter();
  const sizes = useTextSizes();
  const { settings } = useSettings();
  const { isFavorite, toggle } = useFavorites();
  const { playingId, toggle: togglePlay } = useSpeech();

  return (
    <PhraseRow
      phrase={phrase}
      sizes={sizes}
      showRomanization={settings.showRomanization}
      playing={playingId === phrase.id}
      favorite={isFavorite(phrase.id)}
      onOpen={() => router.push({ pathname: '/phrase/[id]', params: { id: phrase.id } })}
      onPlay={() => togglePlay(phrase.id, phrase.thai)}
      onToggleFavorite={() => toggle(phrase.id)}
    />
  );
}
