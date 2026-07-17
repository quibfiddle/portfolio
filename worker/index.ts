import type { Env, TelegramUpdate } from './telegram';
import { sendTelegramMessage, verifyWebhookSecret } from './telegram';
import {
  appendStuartMessage,
  appendVisitorMessage,
  checkAndBumpRateLimit,
  createSession,
  getSession,
  getSessionIdByTelegramMessageId,
  mapTelegramMessage,
  setRootTgMessageId,
  shortId,
} from './store';
import { getCannedReply, type AiMessage } from './chatAi';

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

async function handleSession(request: Request, env: Env): Promise<Response> {
  let body: { name?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }
  const name = (body.name ?? '').trim().slice(0, 80);
  const message = (body.message ?? '').trim().slice(0, 1000);
  if (!name || !message) return jsonError('name and message are required', 400);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const allowed = await checkAndBumpRateLimit(env, ip);
  if (!allowed) return jsonError('Too many chat sessions today — try again tomorrow', 429);

  const { sessionId } = await createSession(env, name, message);
  const tgMessage = await sendTelegramMessage(env, `\u{1F4AC} ${name}\n${message}\n\nSession: ${shortId(sessionId)}`);
  await setRootTgMessageId(env, sessionId, tgMessage.message_id);
  await mapTelegramMessage(env, tgMessage.message_id, sessionId);

  return jsonResponse({ sessionId, stuartAvailable: false });
}

async function handleSend(request: Request, env: Env): Promise<Response> {
  let body: { sessionId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }
  const sessionId = body.sessionId ?? '';
  const message = (body.message ?? '').trim().slice(0, 1000);
  if (!sessionId || !message) return jsonError('sessionId and message are required', 400);

  const session = await getSession(env, sessionId);
  if (!session) return jsonError('Unknown session', 404);

  await appendVisitorMessage(env, sessionId, message);
  const tgMessage = await sendTelegramMessage(env, message, session.rootTgMessageId ?? undefined);
  await mapTelegramMessage(env, tgMessage.message_id, sessionId);

  return jsonResponse({ ok: true });
}

async function handlePoll(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId') ?? '';
  const after = Number(url.searchParams.get('after') ?? '0');
  if (!sessionId) return jsonError('sessionId is required', 400);

  const session = await getSession(env, sessionId);
  if (!session) return jsonError('Unknown session', 404);

  const stuartMessages = session.messages.filter((m) => m.from === 'stuart');
  const newMessages = stuartMessages.slice(after).map((m) => ({ text: m.text, ts: m.ts }));

  return jsonResponse({ newMessages, status: session.status });
}

async function handleAi(request: Request): Promise<Response> {
  let body: { sessionId?: string; messages?: AiMessage[] };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }
  const reply = getCannedReply(body.messages ?? []);
  return jsonResponse({ reply });
}

// Telegram requires a fast 200 ack, so failures here are logged (visible via
// `wrangler tail`) rather than surfaced as HTTP errors that would trigger retries.
async function handleWebhook(request: Request, env: Env): Promise<Response> {
  if (!verifyWebhookSecret(request, env)) {
    return new Response('Unauthorized', { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return new Response('OK');
  }

  try {
    const message = update.message;
    if (!message?.text || String(message.chat.id) !== env.TELEGRAM_CHAT_ID) {
      return new Response('OK');
    }

    const replyToId = message.reply_to_message?.message_id;
    if (!replyToId) {
      await sendTelegramMessage(env, "↩️ Reply to the visitor's message so I know who this is for.");
      return new Response('OK');
    }

    const sessionId = await getSessionIdByTelegramMessageId(env, replyToId);
    if (!sessionId) {
      await sendTelegramMessage(env, "Couldn't find that conversation — it may have expired.", message.message_id);
      return new Response('OK');
    }

    await appendStuartMessage(env, sessionId, message.text);
    await mapTelegramMessage(env, message.message_id, sessionId);
  } catch (err) {
    console.error('Telegram webhook handling failed', err);
  }

  return new Response('OK');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/chat/session' && request.method === 'POST') {
        return await handleSession(request, env);
      }
      if (url.pathname === '/api/chat/send' && request.method === 'POST') {
        return await handleSend(request, env);
      }
      if (url.pathname === '/api/chat/poll' && request.method === 'GET') {
        return await handlePoll(request, env);
      }
      if (url.pathname === '/api/chat/ai' && request.method === 'POST') {
        return await handleAi(request);
      }
      if (url.pathname === '/api/telegram/webhook' && request.method === 'POST') {
        return await handleWebhook(request, env);
      }
    } catch (err) {
      console.error('Unhandled error in /api route', err);
      return jsonError('Internal error', 500);
    }

    return env.ASSETS.fetch(request);
  },
};
