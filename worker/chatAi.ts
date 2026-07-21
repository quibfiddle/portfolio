// Canned AI-fallback replies, ported from the widget's old client-side demo.
// TODO: swap for a real Claude API call per docs/chat-widget.md — same
// contract (POST /api/chat/ai -> { reply }), so this can be replaced in
// isolation with no frontend changes.

import { SHOW_LEAD_ANALYSIS_PROJECT } from '../src/config/flags';

const CANNED_REPLIES = [
  "Stuart has spent 15+ years across full-stack development, automation, and IT. Ask me about his projects, stack, or experience.",
  ...(SHOW_LEAD_ANALYSIS_PROJECT
    ? ['One highlight: he built a Claude-powered lead analysis tool that lifted qualified leads by about 40%. The write-up is on the Work page.']
    : []),
  'His core stack is JavaScript/TypeScript, PHP, and Python, with React, AWS, and a deep RPA background (UiPath).',
  "For anything specific, the Contact page reaches him directly. He usually replies within a day.",
];

export interface AiMessage {
  role: string;
  content: string;
}

export function getCannedReply(messages: AiMessage[]): string {
  const turn = messages.filter((m) => m.role === 'user').length - 1;
  return CANNED_REPLIES[Math.min(Math.max(turn, 0), CANNED_REPLIES.length - 1)];
}
