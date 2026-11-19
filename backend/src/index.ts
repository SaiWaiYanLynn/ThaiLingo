import { parseFeedback, parseStatusUpdate, STATUSES } from './validate';

export interface Env {
  DB: D1Database;
  ADMIN_TOKEN?: string; // secret: npx wrangler secret put ADMIN_TOKEN
}

const RATE_LIMIT_PER_HOUR = 5;

const json = (body: unknown, status = 200) => Response.json(body, { status });
const error = (status: number, message: string) => json({ error: message }, status);

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function isAdmin(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_TOKEN) return false;
  const given = request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? '';
  // Compare hashes so the check does not leak the token length or content.
  return (await sha256(given)) === (await sha256(env.ADMIN_TOKEN));
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function createFeedback(request: Request, env: Env): Promise<Response> {
  const parsed = parseFeedback(await readJson(request));
  if (!parsed.ok) return error(400, parsed.error);

  // Store a hash of the IP address, never the address itself.
  const ipHash = (await sha256(request.headers.get('CF-Connecting-IP') ?? 'unknown')).slice(0, 32);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM feedback WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
  )
    .bind(ipHash)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= RATE_LIMIT_PER_HOUR) return error(429, 'Too many reports. Try again later.');

  const { phraseId, kind, message } = parsed.value;
  const result = await env.DB.prepare('INSERT INTO feedback (phrase_id, kind, message, ip_hash) VALUES (?, ?, ?, ?)')
    .bind(phraseId, kind, message, ipHash)
    .run();
  return json({ id: result.meta.last_row_id }, 201);
}

async function listFeedback(url: URL, env: Env): Promise<Response> {
  const status = url.searchParams.get('status') ?? 'open';
  if (!(STATUSES as readonly string[]).includes(status)) return error(400, 'status is invalid');
  const { results } = await env.DB.prepare(
    'SELECT id, phrase_id, kind, message, status, created_at FROM feedback WHERE status = ? ORDER BY created_at DESC LIMIT 100',
  )
    .bind(status)
    .all();
  return json({ items: results });
}

async function updateFeedback(id: number, request: Request, env: Env): Promise<Response> {
  const parsed = parseStatusUpdate(await readJson(request));
  if (!parsed.ok) return error(400, parsed.error);
  const result = await env.DB.prepare('UPDATE feedback SET status = ? WHERE id = ?').bind(parsed.value, id).run();
  return result.meta.changes === 0 ? error(404, 'Not found') : json({ id, status: parsed.value });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (pathname === '/health') return json({ ok: true });

    if (pathname === '/v1/feedback') {
      return method === 'POST' ? createFeedback(request, env) : error(405, 'Method not allowed');
    }

    if (pathname.startsWith('/v1/admin/')) {
      if (!(await isAdmin(request, env))) return error(401, 'Unauthorized');
      if (pathname === '/v1/admin/feedback' && method === 'GET') return listFeedback(url, env);
      const match = pathname.match(/^\/v1\/admin\/feedback\/(\d+)$/);
      if (match && method === 'PATCH') return updateFeedback(Number(match[1]), request, env);
    }

    return error(404, 'Not found');
  },
} satisfies ExportedHandler<Env>;
