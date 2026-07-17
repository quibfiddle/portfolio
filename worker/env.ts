import type { ChatHub } from './chatHub';

export interface Env {
  ASSETS: Fetcher;
  CHAT_HUB: DurableObjectNamespace<ChatHub>;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  TELEGRAM_WEBHOOK_SECRET: string;
}
