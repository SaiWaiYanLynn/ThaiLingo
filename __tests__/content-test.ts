import raw from '@/data/phrases.json';
import { getAllPhrases, getPhrase, getPhrasesByTopic, getTopics } from '@/data/content';
import type { ContentFile } from '@/data/types';
import { validateContent } from '@/data/validate';

describe('content data', () => {
  it('passes validation: 6 topics, 30 phrases, 5 per topic, unique ids', () => {
    expect(validateContent(raw as ContentFile)).toEqual([]);
  });

  it('reports problems in broken content', () => {
    const broken: ContentFile = {
      topics: (raw as ContentFile).topics,
      phrases: [...(raw as ContentFile).phrases, { ...(raw as ContentFile).phrases[0] }],
    };
    const errors = validateContent(broken);
    expect(errors.some((e) => e.includes('Duplicate'))).toBe(true);
    expect(errors.some((e) => e.includes('31'))).toBe(true);
  });

  it('returns topics in display order', () => {
    expect(getTopics().map((t) => t.id)).toEqual(['greetings', 'taxi', 'food', 'market', 'directions', 'emergency']);
  });

  it('returns a topic\'s phrases in order', () => {
    const taxi = getPhrasesByTopic('taxi');
    expect(taxi).toHaveLength(5);
    expect(taxi[1].id).toBe('taxi_meter');
  });

  it('finds a phrase by id and returns undefined for unknown ids', () => {
    expect(getPhrase('taxi_meter')?.meaning.en).toBe('Please use the meter');
    expect(getPhrase('nope')).toBeUndefined();
  });

  it('gives every phrase a word-by-word literal gloss', () => {
    getAllPhrases().forEach((p) => expect(p.literal?.trim()).toBeTruthy());
  });

  it('lists all 30 phrases', () => {
    expect(getAllPhrases()).toHaveLength(30);
  });
});
