export const KINDS = ['wrong_translation', 'wrong_romanization', 'other'] as const;
export const STATUSES = ['open', 'resolved', 'dismissed'] as const;
export const MAX_MESSAGE_LENGTH = 500;

export type Kind = (typeof KINDS)[number];
export type Status = (typeof STATUSES)[number];

export interface FeedbackBody {
  phraseId: string;
  kind: Kind;
  message: string;
}

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const PHRASE_ID = /^[a-z0-9_]{1,64}$/;

export function parseFeedback(input: unknown): Parsed<FeedbackBody> {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Body must be a JSON object' };
  const { phraseId, kind, message } = input as Record<string, unknown>;
  if (typeof phraseId !== 'string' || !PHRASE_ID.test(phraseId)) return { ok: false, error: 'phraseId is invalid' };
  if (typeof kind !== 'string' || !(KINDS as readonly string[]).includes(kind)) return { ok: false, error: 'kind is invalid' };
  if (typeof message !== 'string') return { ok: false, error: 'message must be text' };
  const trimmed = message.trim();
  if (trimmed.length === 0) return { ok: false, error: 'message is empty' };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, error: `message is longer than ${MAX_MESSAGE_LENGTH} characters` };
  return { ok: true, value: { phraseId, kind: kind as Kind, message: trimmed } };
}

export function parseStatusUpdate(input: unknown): Parsed<Status> {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Body must be a JSON object' };
  const { status } = input as Record<string, unknown>;
  if (typeof status !== 'string' || !(STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: 'status is invalid' };
  }
  return { ok: true, value: status as Status };
}
