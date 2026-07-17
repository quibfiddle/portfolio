import type { Env } from './telegram';

export interface ChatMessage {
  from: 'visitor' | 'stuart';
  text: string;
  ts: number;
}

export interface Session {
  name: string;
  createdAt: number;
  status: 'waiting' | 'live';
  messages: ChatMessage[];
  rootTgMessageId: number | null;
}

const SESSION_KEY = (id: string) => `session:${id}`;
const TG_MAP_KEY = (messageId: number) => `tg:${messageId}`;
const TG_MAP_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days — long enough for any real conversation

export function shortId(sessionId: string): string {
  return sessionId.slice(0, 8);
}

export async function getSession(env: Env, sessionId: string): Promise<Session | null> {
  return env.CHAT_KV.get<Session>(SESSION_KEY(sessionId), 'json');
}

async function saveSession(env: Env, sessionId: string, session: Session): Promise<void> {
  await env.CHAT_KV.put(SESSION_KEY(sessionId), JSON.stringify(session));
}

export async function createSession(
  env: Env,
  name: string,
  firstMessage: string
): Promise<{ sessionId: string; session: Session }> {
  const sessionId = crypto.randomUUID();
  const session: Session = {
    name,
    createdAt: Date.now(),
    status: 'waiting',
    messages: [{ from: 'visitor', text: firstMessage, ts: Date.now() }],
    rootTgMessageId: null,
  };
  await saveSession(env, sessionId, session);
  return { sessionId, session };
}

// KV writes here are read-modify-write, not atomic — acceptable for a single
// low-traffic personal-site chat where a visitor's own messages are effectively
// sequential and Stuart's webhook replies land far apart in practice.
export async function appendVisitorMessage(
  env: Env,
  sessionId: string,
  text: string
): Promise<Session | null> {
  const session = await getSession(env, sessionId);
  if (!session) return null;
  session.messages.push({ from: 'visitor', text, ts: Date.now() });
  await saveSession(env, sessionId, session);
  return session;
}

export async function appendStuartMessage(
  env: Env,
  sessionId: string,
  text: string
): Promise<Session | null> {
  const session = await getSession(env, sessionId);
  if (!session) return null;
  session.messages.push({ from: 'stuart', text, ts: Date.now() });
  session.status = 'live';
  await saveSession(env, sessionId, session);
  return session;
}

export async function setRootTgMessageId(env: Env, sessionId: string, messageId: number): Promise<void> {
  const session = await getSession(env, sessionId);
  if (!session) return;
  session.rootTgMessageId = messageId;
  await saveSession(env, sessionId, session);
}

export async function mapTelegramMessage(env: Env, telegramMessageId: number, sessionId: string): Promise<void> {
  await env.CHAT_KV.put(TG_MAP_KEY(telegramMessageId), sessionId, { expirationTtl: TG_MAP_TTL_SECONDS });
}

export async function getSessionIdByTelegramMessageId(env: Env, telegramMessageId: number): Promise<string | null> {
  return env.CHAT_KV.get(TG_MAP_KEY(telegramMessageId));
}

const RATE_LIMIT_PER_DAY = 20;

// Coarse per-IP daily cap on new sessions — cheap abuse guard, not precise.
export async function checkAndBumpRateLimit(env: Env, ip: string): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const key = `ratelimit:session:${ip}:${day}`;
  const current = Number((await env.CHAT_KV.get(key)) ?? '0');
  if (current >= RATE_LIMIT_PER_DAY) return false;
  await env.CHAT_KV.put(key, String(current + 1), { expirationTtl: 60 * 60 * 24 * 2 });
  return true;
}
