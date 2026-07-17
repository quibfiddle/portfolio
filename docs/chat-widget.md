# Chat Widget — Architecture & Integration Guide

The site ships a "Chat with me" widget (`src/components/ChatWidget.astro`), styled as an
Ubuntu terminal window. **The UI/flow is fully built; the backend is intentionally
stubbed** (`DEMO_MODE = true`) so the design can be reviewed and approved first.

## Visitor flow

1. Visitor clicks the floating `$ chat` button (bottom-right) → terminal window opens.
2. Widget asks for a name and message ("Stuart gets a text when you send this").
3. On send:
   - **Live path:** message goes to the backend, which texts Stuart. The widget polls
     for his reply for `LIVE_WAIT_SECONDS` (default 90s) showing a waiting state.
   - **Stuart replies** → live chat continues in the same window.
   - **No reply in time / Stuart marked away** → widget offers the fallback:
     *"Stuart seems to be away from his terminal. Want to chat with an AI that knows
     his work? Your message is already in his inbox either way."*
4. AI mode: visitor chats with an AI persona that answers questions about Stuart's
   experience, projects, and skills (grounded in the site content). Clearly labeled as AI.

## Frontend contract (already implemented)

All backend interaction goes through four endpoints, configured at the top of
`ChatWidget.astro`:

| Endpoint | Method | Body | Returns |
|---|---|---|---|
| `/api/chat/session` | POST | `{ name, message }` | `{ sessionId, stuartAvailable }` |
| `/api/chat/send` | POST | `{ sessionId, message }` | `{ ok }` |
| `/api/chat/poll` | GET | `?sessionId=` | `{ messages: [{from: 'stuart'\|'visitor', text, ts}], status: 'waiting'\|'live'\|'away' }` |
| `/api/chat/ai` | POST | `{ sessionId, messages: [{role, content}] }` | `{ reply }` |

While `DEMO_MODE = true`, the widget fakes all four (simulated delays, a scripted
"away" result, and canned AI replies) so the full flow is clickable.

## Backend integration (to build later)

The site deploys to **Cloudflare Workers Static Assets**, so the natural home for the
backend is the same Worker: add routes under `/api/chat/*` in a Worker script and flip
`DEMO_MODE` to `false`. Session state fits in **Workers KV** (or Durable Objects if we
want true push instead of polling).

### 1. Text-message notification (the "contact Stuart" piece)

Options, in order of recommendation:

- **Twilio SMS** (~$0.008/msg): Worker calls Twilio's REST API with Stuart's number.
  Reply-to-chat: a Twilio webhook posts his SMS reply back to the Worker, which stores
  it for the widget's poll. This gives real two-way text↔web chat.
- **Email-to-SMS gateway** (free, one-way): e.g. `number@txt.att.net` via an email API
  (MailChannels is free from Workers). Stuart gets notified but replies via a link.
- **Push via ntfy.sh** (free): Stuart installs the ntfy app; Worker POSTs to his topic.
  The notification deep-links to a lightweight reply page.

Secrets (Twilio SID/token, Stuart's number) live in Worker env vars via
`wrangler secret put` — never in the repo or client code.

### 2. AI fallback

Two viable paths (both proxied through the Worker — **the API key or model endpoint is
never exposed client-side**):

- **Claude API** (recommended): Worker route `/api/chat/ai` calls Anthropic's Messages
  API. A small fast model (Haiku-class) is the right fit for a persona chat: cheap,
  fast, plenty smart for Q&A over a fixed bio. System prompt = Stuart's bio, resume
  facts, and case studies (source it from `intake/` content at build time), plus rules:
  only discuss Stuart's professional background, direct anything else to the contact
  page, never invent facts. Budget note: with max_tokens capped at ~500 and a
  rate limit per IP (Workers KV counter), cost is effectively pocket change.
- **Self-hosted**: any OpenAI-compatible endpoint (Ollama on a VPS, etc.). Same Worker
  route, different upstream URL. Cheaper at volume, but adds a server to babysit and
  a cold-start/latency tradeoff. Fine to swap in later; the widget contract is
  identical.

### 3. Abuse guardrails (needed before going live)

- Rate-limit `/api/chat/session` and `/api/chat/ai` per IP (KV counter or Turnstile).
- Cap message length (widget already enforces 1000 chars client-side; enforce server-side too).
- Cloudflare Turnstile on session creation if SMS spam becomes a problem (CSP already
  allows challenges.cloudflare.com).

## Design notes

- Terminal window reuses the TerminalCard chrome recipe (Yaru controls right, #300a24
  body, Ubuntu Mono) so the widget reads as part of the design system.
- Messages render as terminal lines: visitor = `you@guest:~$`, Stuart = green
  `stuart@stuartbingham:~$`, AI = clearly-labeled `ai@stuartbingham:~$` with an
  `[AI]` marker and an intro disclaimer line.
- Accessible: dialog role, focus moves in on open and returns on close, Escape closes,
  `aria-live="polite"` message log, all controls keyboard-reachable.
- Reduced motion: no typing animations in the widget; instant message rendering.
