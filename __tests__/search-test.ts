import { getAllPhrases } from '@/data/content';
import { searchPhrases } from '@/utils/search';

const all = getAllPhrases();
const ids = (q: string) => searchPhrases(all, q).map((p) => p.id);

describe('searchPhrases', () => {
  it('matches English text, ignoring case and spaces', () => {
    expect(ids('  METER ')).toEqual(['taxi_meter']);
  });

  it('matches romanization', () => {
    expect(ids('mi-ter')).toEqual(['taxi_meter']);
  });

  it('matches Thai script', () => {
    expect(ids('มิเตอร์')).toEqual(['taxi_meter']);
  });

  it('returns every phrase for an empty query', () => {
    expect(searchPhrases(all, '   ')).toHaveLength(30);
  });

  it('returns nothing when there is no match', () => {
    expect(ids('zzz')).toEqual([]);
  });
});
