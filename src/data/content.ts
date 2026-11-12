import raw from './phrases.json';
import type { ContentFile, Phrase, Topic, TopicId } from './types';

// The JSON is imported once at build time; every helper reads from memory.
const content = raw as ContentFile;

const topics: Topic[] = [...content.topics].sort((a, b) => a.order - b.order);
const phrases: Phrase[] = [...content.phrases];
const phraseById = new Map(phrases.map((p) => [p.id, p]));

export function getTopics(): Topic[] {
  return topics;
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getPhrasesByTopic(topicId: TopicId | string): Phrase[] {
  return phrases.filter((p) => p.topicId === topicId).sort((a, b) => a.order - b.order);
}

export function getPhrase(id: string): Phrase | undefined {
  return phraseById.get(id);
}

export function getAllPhrases(): Phrase[] {
  return topics.flatMap((t) => getPhrasesByTopic(t.id));
}

export function isKnownPhraseId(id: string): boolean {
  return phraseById.has(id);
}

// Emergency numbers (FR-12). From the spec; verify against an official source before release.
export const emergencyNumbers = [
  { label: 'Police', number: '191' },
  { label: 'Ambulance', number: '1669' },
  { label: 'Tourist Police', number: '1155' },
] as const;
