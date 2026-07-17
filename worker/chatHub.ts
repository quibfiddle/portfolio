import { DurableObject } from 'cloudflare:workers';
import type { Env } from './env';

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

const RATE_LIMIT_PER_DAY = 20;

// Single global Durable Object instance backing all chat sessions. DO storage
// is strongly consistent and single-threaded per instance, so reads always
// see the most recent write immediately (unlike Workers KV, which is only
// eventually consistent — writes can take up to ~60s to propagate to other
// edge locations, which is far too slow for a "live" chat).
export class ChatHub extends DurableObject<Env> {
  sessions: Map<string, Session> = new Map();
  tgToSession: Map<number, string> = new Map();
  rateLimits: Map<string, { day: string; count: number }> = new Map();
  private loaded = false;

  private async ensureLoaded() {
    if (this.loaded) return;
    const [sessions, tgToSession, rateLimits] = await Promise.all([
      this.ctx.storage.get<[string, Session][]>('sessions'),
      this.ctx.storage.get<[number, string][]>('tgToSession'),
      this.ctx.storage.get<[string, { day: string; count: number }][]>('rateLimits'),
    ]);
    if (sessions) this.sessions = new Map(sessions);
    if (tgToSession) this.tgToSession = new Map(tgToSession);
    if (rateLimits) this.rateLimits = new Map(rateLimits);
    this.loaded = true;
  }

  private async persist() {
    await this.ctx.storage.put('sessions', [...this.sessions.entries()]);
    await this.ctx.storage.put('tgToSession', [...this.tgToSession.entries()]);
    await this.ctx.storage.put('rateLimits', [...this.rateLimits.entries()]);
  }

  async checkAndBumpRateLimit(ip: string): Promise<boolean> {
    await this.ensureLoaded();
    const day = new Date().toISOString().slice(0, 10);
    const entry = this.rateLimits.get(ip);
    const count = entry && entry.day === day ? entry.count : 0;
    if (count >= RATE_LIMIT_PER_DAY) return false;
    this.rateLimits.set(ip, { day, count: count + 1 });
    await this.persist();
    return true;
  }

  async createSession(name: string, message: string): Promise<string> {
    await this.ensureLoaded();
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, {
      name,
      createdAt: Date.now(),
      status: 'waiting',
      messages: [{ from: 'visitor', text: message, ts: Date.now() }],
      rootTgMessageId: null,
    });
    await this.persist();
    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    await this.ensureLoaded();
    return this.sessions.get(sessionId) ?? null;
  }

  async setRootTgMessageId(sessionId: string, messageId: number): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.rootTgMessageId = messageId;
    await this.persist();
  }

  async mapTelegramMessage(telegramMessageId: number, sessionId: string): Promise<void> {
    await this.ensureLoaded();
    this.tgToSession.set(telegramMessageId, sessionId);
    await this.persist();
  }

  async getSessionIdByTelegramMessageId(telegramMessageId: number): Promise<string | null> {
    await this.ensureLoaded();
    return this.tgToSession.get(telegramMessageId) ?? null;
  }

  async appendVisitorMessage(sessionId: string, text: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.messages.push({ from: 'visitor', text, ts: Date.now() });
    await this.persist();
  }

  async appendStuartMessage(sessionId: string, text: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.messages.push({ from: 'stuart', text, ts: Date.now() });
    session.status = 'live';
    await this.persist();
  }
}
