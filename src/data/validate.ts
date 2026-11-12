import type { ContentFile } from './types';

const TOPIC_IDS = ['greetings', 'taxi', 'food', 'market', 'directions', 'emergency'];

// Returns a list of problems. An empty list means the content is valid (spec section 7.4).
export function validateContent(content: ContentFile): string[] {
  const errors: string[] = [];
  if (content.topics.length !== 6) errors.push(`Expected 6 topics, found ${content.topics.length}`);
  if (content.phrases.length !== 30) errors.push(`Expected 30 phrases, found ${content.phrases.length}`);

  const topicIds = new Set(content.topics.map((t) => t.id));
  TOPIC_IDS.forEach((id) => {
    if (!topicIds.has(id as never)) errors.push(`Missing topic ${id}`);
  });

  const seen = new Set<string>();
  content.phrases.forEach((p) => {
    if (seen.has(p.id)) errors.push(`Duplicate phrase id ${p.id}`);
    seen.add(p.id);
    if (!topicIds.has(p.topicId)) errors.push(`Phrase ${p.id} has unknown topic ${p.topicId}`);
    if (!p.thai.trim() || !p.romanization.trim() || !p.meaning.en.trim()) {
      errors.push(`Phrase ${p.id} has an empty field`);
    }
  });

  content.topics.forEach((t) => {
    const count = content.phrases.filter((p) => p.topicId === t.id).length;
    if (count !== 5) errors.push(`Topic ${t.id} has ${count} phrases, expected 5`);
  });
  return errors;
}
