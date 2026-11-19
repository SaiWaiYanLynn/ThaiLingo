import { describe, expect, it } from 'vitest';

import { parseFeedback, parseStatusUpdate } from '../src/validate';

describe('parseFeedback', () => {
  it('accepts a valid report and trims the message', () => {
    expect(parseFeedback({ phraseId: 'taxi_meter', kind: 'other', message: '  hi  ' })).toEqual({
      ok: true,
      value: { phraseId: 'taxi_meter', kind: 'other', message: 'hi' },
    });
  });

  it.each([
    [null],
    ['text'],
    [{ phraseId: 'Bad Id', kind: 'other', message: 'x' }],
    [{ phraseId: 'a', kind: 'nope', message: 'x' }],
    [{ phraseId: 'a', kind: 'other', message: '   ' }],
    [{ phraseId: 'a', kind: 'other', message: 'x'.repeat(501) }],
    [{ phraseId: 'a', kind: 'other', message: 5 }],
  ])('rejects %j', (input) => {
    expect(parseFeedback(input).ok).toBe(false);
  });
});

describe('parseStatusUpdate', () => {
  it('accepts known statuses only', () => {
    expect(parseStatusUpdate({ status: 'resolved' })).toEqual({ ok: true, value: 'resolved' });
    expect(parseStatusUpdate({ status: 'deleted' }).ok).toBe(false);
  });
});
