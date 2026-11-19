import { submitFeedback } from '@/services/feedback';

const input = { phraseId: 'taxi_meter', kind: 'wrong_translation' as const, message: '  Wrong word  ' };

describe('submitFeedback', () => {
  const config = { url: 'https://api.example.com' };

  it('returns not_configured without Supabase keys', async () => {
    await expect(submitFeedback(input, {})).resolves.toEqual({ ok: false, reason: 'not_configured' });
  });

  it('posts a trimmed report to the feedback table', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    await expect(submitFeedback(input, config)).resolves.toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.com/v1/feedback');
    expect(JSON.parse(init.body)).toEqual({ phraseId: 'taxi_meter', kind: 'wrong_translation', message: 'Wrong word' });
  });

  it('maps a failed request to network and a bad status to server', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    await expect(submitFeedback(input, config)).resolves.toEqual({ ok: false, reason: 'network' });
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    await expect(submitFeedback(input, config)).resolves.toEqual({ ok: false, reason: 'server' });
  });

  it('maps HTTP 429 to rate_limited', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429 }) as unknown as typeof fetch;
    await expect(submitFeedback(input, config)).resolves.toEqual({ ok: false, reason: 'rate_limited' });
  });
});
