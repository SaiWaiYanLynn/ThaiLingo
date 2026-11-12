import type { Phrase } from '@/data/types';

// Matches when the query is contained in the English meaning, the romanization or the Thai text.
export function searchPhrases(all: Phrase[], query: string): Phrase[] {
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.meaning.en.toLowerCase().includes(q) ||
      p.romanization.toLowerCase().includes(q) ||
      p.thai.includes(query.trim()),
  );
}
