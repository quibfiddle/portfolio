// Shared interactive terminal engine + command registry.
// Used by TerminalCard.astro (homepage hero) and 404.astro.
//
// Design notes:
// - Whitelist-only registry, no eval. Commands are a data map so new ones
//   (e.g. a text RPG) plug in by appending to `commands`.
// - Input flows through a "mode": command mode parses the registry; a
//   capture mode (ctx.enterMode) temporarily receives ALL input (game mode)
//   and releases back with ctx.exitMode().
// - Markup contract: root element contains a `[data-term-body]` scroll
//   container. The engine appends its own output region (aria-live) and
//   live prompt line, so both terminals share one source of truth.

import { resetQuest, startQuest } from './quest';

const GREEN = 'text-terminal-green';
const ORANGE = 'text-terminal-orange';
const MUTED = 'text-terminal-muted';
const TEXT = 'text-terminal-text';

const SCROLLBACK_LIMIT = 200;
const HISTORY_LIMIT = 50;

type Seg = { t: string; c?: string };

const PROMPT_SEGS: Seg[] = [
  { t: 'stuart@stuartbingham', c: GREEN },
  { t: ':', c: MUTED },
  { t: '~', c: TEXT },
  { t: '$', c: MUTED },
];

export interface TerminalMode {
  name: string;
  onInput: (raw: string, ctx: TerminalCtx) => void;
}

export interface TerminalCtx {
  print: (text: string, cls?: string) => void;
  printSegs: (segs: Seg[]) => void;
  clear: () => void;
  enterMode: (mode: TerminalMode) => void;
  exitMode: () => void;
  history: readonly string[];
}

interface Command {
  name: string;
  description: string;
  hidden?: boolean;
  run: (args: string[], ctx: TerminalCtx) => void;
}

// ------------------------------------------------------------------
// Site data (single source for both terminals)
// ------------------------------------------------------------------

const PAGES: Record<string, string> = {
  home: '/',
  about: '/about/',
  work: '/work/',
  projects: '/work/',
  resume: '/resume/',
  contact: '/contact/',
};

const PROJECT_TITLES = [
  'AI-Powered Lead Analysis',
  'Legacy Platform Modernization',
  'Git-Based Deployment Workflow',
  '30,000-Device Deployment Automation',
  'Sounds True Online Course Migration',
  'DHS Acquisition Program Baseline Cataloging',
  'Off Market Deals HQ',
  'FISH.tech',
  'Property Analyzer API',
  'AVG to Bitdefender Managed Antivirus Migration',
];

const SKILL_GROUPS: { label: string; tags: string[] }[] = [
  { label: 'languages', tags: ['JavaScript', 'TypeScript', 'PHP', 'Python', 'SQL', 'VBScript', 'XML'] },
  { label: 'frameworks', tags: ['React', 'NestJS', 'PostgreSQL', 'MySQL', 'DynamoDB', 'AWS'] },
  { label: 'tools', tags: ['UiPath', 'Git', 'REST APIs', 'Auth0', 'WordPress', 'IIS', 'SharePoint', 'Dynamics'] },
  { label: 'specialties', tags: ['Automation', 'RPA', 'Full-Stack', 'API Design', 'Cloud', 'DevOps', 'AI Integrations', 'Microservices'] },
];

function printDeveloperJs(ctx: TerminalCtx) {
  const kv = (key: string, val: string, trailing = ',', comment = '') => {
    const segs: Seg[] = [
      { t: '  ' },
      { t: key, c: GREEN },
      { t: ': ', c: MUTED },
      { t: `'${val}'`, c: ORANGE },
      { t: trailing, c: MUTED },
    ];
    if (comment) segs.push({ t: ` ${comment}`, c: MUTED });
    ctx.printSegs(segs);
  };
  ctx.printSegs([
    { t: 'const ' },
    { t: 'developer', c: GREEN },
    { t: ' = {', c: MUTED },
  ]);
  kv('name', 'Stuart Bingham');
  kv('role', 'Full-Stack Developer');
  kv('alsoAnswersTo', 'IT Professional');
  kv('experience', '15+ years');
  kv('location', 'Chandler, AZ');
  ctx.printSegs([
    { t: '  ' },
    { t: 'stack', c: GREEN },
    { t: ': [', c: MUTED },
    { t: "'JavaScript/TS'", c: ORANGE },
    { t: ', ', c: MUTED },
    { t: "'PHP'", c: ORANGE },
    { t: ', ', c: MUTED },
    { t: "'Python'", c: ORANGE },
    { t: ', ', c: MUTED },
    { t: "'AWS'", c: ORANGE },
    { t: '],', c: MUTED },
  ]);
  kv('passion', 'automating the boring stuff');
  kv('status', 'open_to_opportunities', ',', "// <- that's you!");
  ctx.print('};', MUTED);
}

// ------------------------------------------------------------------
// Command registry
// ------------------------------------------------------------------

function openPage(args: string[], ctx: TerminalCtx, verb: string) {
  const raw = args[0] ?? (verb === 'cd' ? 'home' : '');
  if (!raw) {
    ctx.print('usage: open home | about | work | resume | contact', MUTED);
    return;
  }
  const target = raw.toLowerCase().replace(/^\/+|\/+$/g, '');
  const path = PAGES[target || 'home'];
  if (!path) {
    ctx.print(`${verb}: ${raw}: no such page. try 'open work'`);
    return;
  }
  ctx.print(`opening ${path} ...`);
  window.setTimeout(() => {
    window.location.href = path;
  }, 450);
}

function setSiteTheme(theme: string) {
  const w = window as unknown as { __setTheme?: (t: string) => void };
  if (typeof w.__setTheme === 'function') {
    // Header owns theme state (localStorage + confetti on party entry)
    w.__setTheme(theme);
  } else {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable; theme still switches for this page */
    }
  }
}

const commands: Command[] = [
  {
    name: 'help',
    description: 'list available commands',
    run(_args, ctx) {
      ctx.print('available commands:');
      for (const cmd of commands) {
        if (cmd.hidden) continue;
        ctx.printSegs([
          { t: `  ${cmd.name.padEnd(9)}`, c: GREEN },
          { t: cmd.description, c: MUTED },
        ]);
      }
    },
  },
  {
    name: 'ls',
    description: "list site contents (try 'ls projects/')",
    run(args, ctx) {
      const arg = (args[0] ?? '').toLowerCase().replace(/\/+$/, '');
      if (!arg) {
        ctx.print('.');
        ctx.print('|-- about/');
        ctx.printSegs([{ t: '|-- work/' }, { t: "          10 case studies, try 'ls projects/'", c: MUTED }]);
        ctx.print('|-- resume/');
        ctx.print('|   `-- Stuart-Bingham-Resume.pdf');
        ctx.print('`-- contact/');
        return;
      }
      if (arg === 'projects' || arg === 'work') {
        PROJECT_TITLES.forEach((title, i) => {
          ctx.printSegs([
            { t: `${String(i + 1).padStart(2)}. `, c: MUTED },
            { t: title },
          ]);
        });
        ctx.print("full case studies at /work/, or run 'open work'", MUTED);
        return;
      }
      ctx.print(`ls: cannot access '${args[0]}': no such directory`);
    },
  },
  {
    name: 'cat',
    description: 'print a file: cat resume.txt',
    run(args, ctx) {
      const file = (args[0] ?? '').toLowerCase();
      if (!file) {
        ctx.print("cat: missing file. try 'cat resume.txt' or 'cat developer.js'", MUTED);
        return;
      }
      if (file === 'resume.txt') {
        ctx.print('Stuart Bingham, Senior Software Engineer & Automation Specialist');
        ctx.print('15+ years across development, automation, and IT infrastructure.');
        ctx.print('Current: Software Developer @ Dixon Golf, Chandler, AZ.');
        ctx.print('Highlights: 22 automation tools, 4 custom APIs, 124,000+ endpoints migrated.');
        ctx.print("run 'open resume' or download: /Stuart-Bingham-Resume.pdf", MUTED);
        return;
      }
      if (file === 'developer.js') {
        printDeveloperJs(ctx);
        return;
      }
      ctx.print(`cat: ${args[0]}: no such file`);
    },
  },
  {
    name: 'whoami',
    description: 'one line about stuart',
    run(_args, ctx) {
      ctx.print('stuart bingham: full-stack developer and IT professional in Chandler, AZ. automates the boring stuff.');
    },
  },
  {
    name: 'skills',
    description: 'technical skill tags',
    run(_args, ctx) {
      for (const group of SKILL_GROUPS) {
        const segs: Seg[] = [{ t: `${group.label.padEnd(13)}`, c: GREEN }];
        group.tags.forEach((tag, i) => {
          segs.push({ t: `[ ${tag} ]`, c: ORANGE });
          if (i < group.tags.length - 1) segs.push({ t: ' ' });
        });
        ctx.printSegs(segs);
      }
    },
  },
  {
    name: 'contact',
    description: 'email, linkedin, and live chat',
    run(_args, ctx) {
      ctx.printSegs([{ t: 'email:     ', c: MUTED }, { t: 'bingham.stuart@gmail.com' }]);
      ctx.printSegs([{ t: 'linkedin:  ', c: MUTED }, { t: 'linkedin.com/in/stuart-bingham-6267356a' }]);
      ctx.print('response_time: usually < 24h', MUTED);
      const launcher = document.getElementById('chat-launcher');
      if (launcher) {
        ctx.print('opening chat...');
        if (launcher.getAttribute('aria-expanded') !== 'true') launcher.click();
      } else {
        ctx.print('chat is offline on this page. email works best.', MUTED);
      }
    },
  },
  {
    name: 'quest',
    description: 'a small adventure (5 min)',
    run(args, ctx) {
      if ((args[0] ?? '').toLowerCase() === 'reset') {
        resetQuest(ctx);
        return;
      }
      startQuest(ctx);
    },
  },
  {
    name: 'open',
    description: 'go to a page: open work (alias: cd)',
    run(args, ctx) {
      openPage(args, ctx, 'open');
    },
  },
  {
    name: 'theme',
    description: 'switch theme: theme dark | light | party',
    run(args, ctx) {
      const theme = (args[0] ?? '').toLowerCase();
      if (theme !== 'dark' && theme !== 'light' && theme !== 'party') {
        ctx.print('usage: theme dark | light | party', MUTED);
        return;
      }
      setSiteTheme(theme);
      const messages: Record<string, string> = {
        dark: 'lights out.',
        light: 'let there be light.',
        party: 'party mode engaged. sunglasses recommended.',
      };
      ctx.print(messages[theme]);
    },
  },
  {
    name: 'history',
    description: 'list commands you have run',
    run(_args, ctx) {
      if (ctx.history.length === 0) {
        ctx.print('history: empty. you are just getting started.', MUTED);
        return;
      }
      ctx.history.forEach((entry, i) => {
        ctx.printSegs([
          { t: `${String(i + 1).padStart(4)}  `, c: MUTED },
          { t: entry },
        ]);
      });
    },
  },
  {
    name: 'clear',
    description: 'clear the terminal',
    run(_args, ctx) {
      ctx.clear();
    },
  },
  // ---------------- hidden (easter eggs + aliases) ----------------
  {
    name: 'cd',
    description: 'alias for open',
    hidden: true,
    run(args, ctx) {
      openPage(args, ctx, 'cd');
    },
  },
  {
    name: 'sudo',
    description: '',
    hidden: true,
    run(args, ctx) {
      if (args.join(' ').toLowerCase() === 'hire stuart') {
        ctx.print("permission granted. run 'open contact' to proceed.");
        return;
      }
      ctx.print('guest is not in the sudoers file. this incident will be reported.');
    },
  },
  {
    name: 'rm',
    description: '',
    hidden: true,
    run(args, ctx) {
      if (args.join(' ').toLowerCase() === '-rf /') {
        ctx.print('nice try. this portfolio is immutable.');
        return;
      }
      ctx.print('rm: permission denied. this portfolio is immutable.');
    },
  },
  {
    name: 'exit',
    description: '',
    hidden: true,
    run(_args, ctx) {
      ctx.print('there is no escape. only opportunities.');
    },
  },
  {
    name: 'ping',
    description: '',
    hidden: true,
    run(args, ctx) {
      if ((args[0] ?? '').toLowerCase() === 'stuart') {
        ctx.print('reply from stuart: <24h');
        return;
      }
      if (!args[0]) {
        ctx.print('usage: ping <host>. hint: there is only one host here.', MUTED);
        return;
      }
      ctx.print(`ping: ${args[0]}: name or service not known`);
    },
  },
];

function runCommand(raw: string, ctx: TerminalCtx) {
  const norm = raw.trim().replace(/\s+/g, ' ');
  if (!norm) return;
  const tokens = norm.split(' ');
  const name = tokens[0].toLowerCase();
  const cmd = commands.find((c) => c.name === name);
  if (cmd) {
    cmd.run(tokens.slice(1), ctx);
  } else {
    ctx.print(`bash: ${name}: command not found. try 'help'`);
  }
}

// ------------------------------------------------------------------
// Engine
// ------------------------------------------------------------------

let instanceCount = 0;

export function initTerminal(root: HTMLElement): { activate: () => void } {
  const body = root.querySelector<HTMLElement>('[data-term-body]');
  if (!body || root.dataset.termReady === 'true') return { activate: () => {} };
  root.dataset.termReady = 'true';
  instanceCount += 1;

  // --- Output region (command scrollback) ---
  const output = document.createElement('div');
  output.setAttribute('aria-live', 'polite');
  output.className = TEXT;
  output.style.whiteSpace = 'pre-wrap';
  output.style.overflowWrap = 'break-word';
  body.appendChild(output);

  // --- Live prompt line (hidden until activate) ---
  const inputId = `term-input-${instanceCount}`;
  const live = document.createElement('div');
  live.hidden = true;
  live.className = 'mt-1';

  const label = document.createElement('label');
  label.className = 'sr-only';
  label.htmlFor = inputId;
  label.textContent = 'Terminal input, type help for commands';

  const row = document.createElement('div');
  row.className = 'flex items-baseline';
  for (const seg of PROMPT_SEGS) {
    const span = document.createElement('span');
    span.className = seg.c ?? TEXT;
    span.textContent = seg.t;
    row.appendChild(span);
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('enterkeyhint', 'go');
  input.className = `flex-1 font-mono ${TEXT}`;
  input.style.cssText =
    'background:transparent;border:0;padding:0;margin-left:0.5rem;min-width:0;font:inherit;caret-color:var(--color-terminal-green);';
  row.appendChild(input);

  const hint = document.createElement('p');
  hint.className = `mt-1 ${MUTED}`;
  hint.textContent = "[ type 'help' or click the window ]";

  live.append(label, row, hint);
  body.appendChild(live);

  // --- State ---
  let active = false;
  let captureMode: TerminalMode | null = null;
  const history: string[] = [];
  let historyIdx = 0;
  let tabState: { matches: string[]; idx: number } | null = null;

  function scrollToBottom() {
    body!.scrollTop = body!.scrollHeight;
  }

  function trimScrollback() {
    while (output.childElementCount > SCROLLBACK_LIMIT) {
      output.firstElementChild?.remove();
    }
  }

  function afterPrint() {
    trimScrollback();
    scrollToBottom();
  }

  function print(text: string, cls: string = TEXT) {
    const div = document.createElement('div');
    div.className = cls;
    div.textContent = text;
    output.appendChild(div);
    afterPrint();
  }

  function printSegs(segs: Seg[]) {
    const div = document.createElement('div');
    for (const seg of segs) {
      const span = document.createElement('span');
      span.className = seg.c ?? TEXT;
      span.textContent = seg.t;
      div.appendChild(span);
    }
    output.appendChild(div);
    afterPrint();
  }

  function clear() {
    // Full clear: drop intro/static lines too, keep output + live prompt
    for (const child of Array.from(body!.children)) {
      if (child !== output && child !== live) child.remove();
    }
    output.replaceChildren();
    scrollToBottom();
  }

  const ctx: TerminalCtx = {
    print,
    printSegs,
    clear,
    enterMode(mode) {
      captureMode = mode;
    },
    exitMode() {
      captureMode = null;
    },
    history,
  };

  function echo(raw: string) {
    printSegs([...PROMPT_SEGS, { t: ` ${raw}` }]);
  }

  function submit() {
    const raw = input.value;
    input.value = '';
    tabState = null;
    echo(raw);
    if (captureMode) {
      captureMode.onInput(raw, ctx);
    } else {
      const norm = raw.trim();
      if (norm) {
        if (history[history.length - 1] !== norm) {
          history.push(norm);
          if (history.length > HISTORY_LIMIT) history.shift();
        }
        runCommand(norm, ctx);
      }
    }
    historyIdx = history.length;
    scrollToBottom();
  }

  function completeCommand() {
    if (tabState) {
      tabState.idx = (tabState.idx + 1) % tabState.matches.length;
      input.value = tabState.matches[tabState.idx];
      return;
    }
    const val = input.value;
    if (val.includes(' ')) return; // only complete the command name
    const prefix = val.toLowerCase();
    const matches = commands.filter((c) => !c.hidden && c.name.startsWith(prefix)).map((c) => c.name);
    if (matches.length === 0) return;
    if (matches.length === 1) {
      input.value = `${matches[0]} `;
      return;
    }
    tabState = { matches, idx: 0 };
    input.value = matches[0];
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === 'Escape') {
      input.blur();
      return;
    }
    if (captureMode) return; // history/completion are command-mode features
    if (e.key === 'Tab') {
      e.preventDefault();
      completeCommand();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      historyIdx = Math.max(0, historyIdx - 1);
      input.value = history[historyIdx];
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0) return;
      historyIdx = Math.min(history.length, historyIdx + 1);
      input.value = historyIdx === history.length ? '' : history[historyIdx];
      return;
    }
    tabState = null;
  });

  // Click anywhere on the card focuses the input (unless clicking a control
  // or selecting text)
  root.addEventListener('click', (e) => {
    if (!active) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select')) return;
    if (window.getSelection && String(window.getSelection())) return;
    input.focus();
  });

  // "/" anywhere on the page focuses the terminal, unless the user is
  // already typing somewhere (inputs, textareas, contenteditable, chat)
  document.addEventListener('keydown', (e) => {
    if (!active || e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const el = document.activeElement as HTMLElement | null;
    if (
      el &&
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
    ) {
      return;
    }
    e.preventDefault();
    input.focus();
  });

  function activate() {
    if (active) return;
    active = true;
    // Retire the static blinking-cursor prompt; the live one takes over.
    root.querySelectorAll<HTMLElement>('[data-term-final]').forEach((el) => {
      el.style.display = 'none';
    });
    live.hidden = false;
    // Never autofocus: the visitor opts in by clicking or pressing "/"
  }

  return { activate };
}
