// Sends a user report about a phrase to the ThaiLingo API (Cloudflare Worker, see backend/).
export type FeedbackKind = 'wrong_translation' | 'wrong_romanization' | 'other';

export interface FeedbackInput {
  phraseId: string;
  kind: FeedbackKind;
  message: string;
}

export type FeedbackResult = { ok: true } | { ok: false; reason: 'not_configured' | 'network' | 'server' | 'rate_limited' };

export const MAX_MESSAGE_LENGTH = 500;

export interface BackendConfig {
  url?: string; // base URL of the API, for example https://thailingo-api.<name>.workers.dev
}

// Expo replaces these variables with their values when the app is bundled.
const defaultConfig: BackendConfig = {
  url: process.env.EXPO_PUBLIC_API_URL,
};

export async function submitFeedback(
  input: FeedbackInput,
  { url }: BackendConfig = defaultConfig,
): Promise<FeedbackResult> {
  if (!url) return { ok: false, reason: 'not_configured' };

  try {
    const response = await fetch(`${url}/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phraseId: input.phraseId,
        kind: input.kind,
        message: input.message.trim().slice(0, MAX_MESSAGE_LENGTH),
      }),
    });
    if (response.ok) return { ok: true };
    return { ok: false, reason: response.status === 429 ? 'rate_limited' : 'server' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
