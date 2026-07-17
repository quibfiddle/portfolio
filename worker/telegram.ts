import type { Env } from './env';

interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  from?: { id: number; is_bot: boolean };
  text?: string;
  reply_to_message?: { message_id: number };
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

// Sends a message to Stuart's chat, optionally as a reply to a prior message
// so a visitor's whole conversation stays threaded under one Telegram message.
export async function sendTelegramMessage(
  env: Env,
  text: string,
  replyToMessageId?: number
): Promise<TelegramMessage> {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      ...(replyToMessageId && { reply_to_message_id: replyToMessageId }),
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram sendMessage failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { result: TelegramMessage };
  return data.result;
}

export function verifyWebhookSecret(request: Request, env: Env): boolean {
  const header = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
  return header === env.TELEGRAM_WEBHOOK_SECRET;
}
