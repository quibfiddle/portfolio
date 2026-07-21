# Chat Widget — Architecture & Integration Guide

The site ships a "Chat with me" widget (`src/components/ChatWidget.astro`), styled as an
Ubuntu terminal window, backed by a Cloudflare Worker (`worker/`) that relays messages
to **a single Telegram chat** — Stuart's own DM with his bot. He replies directly in
Telegram; the widget polls for replies and shows them live.

## Visitor flow

1. Visitor clicks the floating `$ chat` button (bottom-right) → terminal window opens.
2. Widget asks for a name and message ("Stuart gets a text when you send this").
3. On send, the Worker creates a session and forwards the message to Stuart's Telegram.
   The widget starts polling and shows a waiting state.
4. **Stuart replies in Telegram** (see "Replying" below) → his reply appears in the
   widget within a few seconds, and the chat is now "live" — polling continues for the
   rest of the conversation, not just the first reply.
5. **No reply within `LIVE_WAIT_SECONDS` (default 90s)** → the widget prints a line
   recommending the visitor email Stuart directly (`mailto:` link), since the message
   already reached his phone either way. If Stuart replies later, his message still
   comes through and the widget switches to live — the email line is just a faster
   alternative, not a dead end.

## Replying in Telegram

Because one Telegram chat can be relaying several visitor conversations at once, **you
must use Telegram's native Reply gesture** (long-press or swipe → Reply) on the specific
visitor message you're answering. The bot matches your reply to the right session by
Telegram message ID. If you send a plain message with no reply-to, the bot won't guess —
it'll nudge you: *"↩️ Reply to the visitor's message so I know who this is for."*

All of a visitor's messages thread under the first message the bot sent for that
session, so replying to any message in that thread routes correctly.

## Frontend contract

All backend interaction goes through three endpoints, configured at the top of
`ChatWidget.astro`:

| Endpoint | Method | Body / Query | Returns |
|---|---|---|---|
| `/api/chat/session` | POST | `{ name, message }` | `{ sessionId, stuartAvailable }` |
| `/api/chat/send` | POST | `{ sessionId, message }` | `{ ok }` |
| `/api/chat/poll` | GET | `?sessionId=&after=<n>` | `{ newMessages: [{text, ts}], status: 'waiting'\|'live' }` |

`after` is a count of Stuart-authored messages the client has already rendered — the
Worker returns only messages past that count, so the widget's poll loop can run
continuously without re-showing old messages. The client-side poll loop
(`ChatWidget.astro`) runs for the life of the chat, not just the initial wait, so
`status` only ever needs to report `'waiting'` or `'live'` — a timeout with no reply is
handled client-side (that's the email-recommendation trigger), the server never needs
to say "away".

## Architecture

The site deploys as a Cloudflare Worker with static assets (`wrangler.jsonc`):
`worker/index.ts` handles `/api/*` routes and falls through to `env.ASSETS.fetch()` for
everything else (the built Astro site).

- `worker/index.ts` — router: `/api/chat/session`, `/api/chat/send`, `/api/chat/poll`,
  and `/api/telegram/webhook`.
- `worker/telegram.ts` — thin Telegram Bot API client (`sendMessage`, webhook secret
  verification).
- `worker/chatHub.ts` — a single global **Durable Object** (`ChatHub`, accessed via
  `env.CHAT_HUB.idFromName('singleton')`) holding all session state: message logs,
  the Telegram-message-id → session-id routing map, and per-IP rate limit counters.
  Sessions were originally stored in Workers KV, but KV is only *eventually*
  consistent — writes from the webhook can take up to ~60s to propagate to the edge
  location serving a visitor's poll requests, which was measured live (a reply took
  ~30s to show up). A Durable Object is strongly consistent and single-threaded per
  instance, so a reply is visible on the very next poll. One instance is plenty at
  personal-portfolio traffic.

### Telegram setup (one-time, manual)

1. **Create the bot**: message [@BotFather](https://t.me/BotFather) on Telegram,
   `/newbot`, follow the prompts. It gives you a token like `123456:ABC-...`.
2. **Get your chat id**: send your new bot any message (it won't reply yet — that's
   expected). Then visit
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and find
   `message.chat.id` in the response — that's your `TELEGRAM_CHAT_ID`.
3. **Generate a webhook secret**: `openssl rand -hex 32` — this becomes
   `TELEGRAM_WEBHOOK_SECRET`, used to verify incoming webhook calls are really from
   Telegram.
4. **Set the secrets** (never commit these):
   ```
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
   ```
5. **Deploy**: `npm run deploy`.
6. **Register the webhook** (after the first deploy, so the URL exists):
   ```
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://stuartbingham.net/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>"
   ```

For local testing, `.dev.vars` (gitignored) can hold the same three variables for
`wrangler dev`. Plain `astro dev` doesn't run the Worker, so `/api/*` calls will 404
there — use `npm run dev:worker` (`astro build && wrangler dev`) for full-stack local
testing.

### Abuse guardrails

- `/api/chat/session` is rate-limited per IP (20/day, tracked in the `ChatHub` Durable
  Object). Tune `RATE_LIMIT_PER_DAY` in `worker/chatHub.ts` if needed.
- Message length is capped at 1000 chars both client-side (widget) and server-side
  (`worker/index.ts`).
- Cloudflare Turnstile on session creation is still an option if spam becomes a problem
  (CSP already allows `challenges.cloudflare.com`) — not implemented yet.

## Design notes

- Terminal window reuses the TerminalCard chrome recipe (Yaru controls right, #300a24
  body, Ubuntu Mono) so the widget reads as part of the design system.
- Messages render as terminal lines: visitor = `you@guest:~$`, Stuart = green
  `stuart@stuartbingham:~$`. System lines (status updates, the away/email
  recommendation) render unprefixed in muted text.
- Accessible: dialog role, focus moves in on open and returns on close, Escape closes,
  `aria-live="polite"` message log, all controls keyboard-reachable.
- Reduced motion: no typing animations in the widget; instant message rendering.
