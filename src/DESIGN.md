# Design System — Stuart Bingham Portfolio

Ubuntu brand identity: aubergine + orange palette, Ubuntu / Ubuntu Mono type, terminal-flavored accents. Layout blueprint adapted from `reference/analysis.md` (sidebar nav, code-card hero, stat tiles, kicker/title/lead sections). All tokens live in `src/styles/global.css` `@theme`.

## Color System

Ubuntu brand palette in a single-accent architecture: **orange does all accent
work**; aubergine/plum are structural. Hierarchy comes from accent + warm
neutrals + tint layering, never from mixing accent hues.

### The three-level neutral stack

| Level | Token | Value | Use |
|---|---|---|---|
| Page | `bg-bg` | #F7F4ED Warm Grey | `<body>` background |
| Card | `bg-surface` | #ffffff | Cards, sidebar, panels — one step lighter than page |
| Well | `bg-inset` | #f0ece2 | Stat tiles and tinted zones *inside* cards |

Borders: `border-border` (#e5e0d8) for cards/dividers. Form inputs use
`border-text-muted` instead (decorative border fails 3:1 for UI boundaries).

### Brand anchors (exact hex preserved)

| Color | Hex | Token |
|---|---|---|
| Canonical Aubergine | #772953 | `primary` / `primary-700` |
| Ubuntu Finn | #5e2750 | `primary-hover` / `primary-800` |
| Dark Aubergine | #2c001e | `text` / `primary-950` |
| Ubuntu Plum | #77216f | `secondary-700` |
| Ubuntu Orange | #e95420 | `accent` / `accent-500` |
| Light Aubergine | #AEA79F | `stone` — decorative ONLY |
| Warm Grey | #F7F4ED | `bg` |

### Accent rules (memorize these three)

1. **Fills** — white text on raw `bg-accent` (#e95420, 3.65:1) passes ONLY as
   WCAG large text: **18.66px+ bold or 24px+ regular** (14px bold does NOT
   qualify — it's normal text needing 4.5:1). Since this design's buttons are
   bold 14px pills, **buttons use `bg-accent-600`** (#c7420f, 4.98:1) with
   `hover:bg-accent-700`. Reserve raw accent-500 fills for decorative marks
   (logo squares — WCAG logo exemption) and text-free surfaces.
2. **Text** — small orange text (links, kickers, inline) is always
   `text-accent-text` (#c7420f, 4.98:1 on white / 4.54:1 on bg), never raw
   #e95420. Stat values use `text-accent-hover` (600) even at 24px bold —
   accent-500 on inset wells is only 3.09:1, too tight to trust.
3. **Tints** — chips: `background: var(--tint-accent-chip)` (15%); tinted
   borders: `var(--tint-accent-border)` (25%), hover glow
   `var(--tint-accent-border-strong)` (45%). Text on chips is
   `text-accent-700` (#9e2f03).

### Component recipes

- **Primary button**: `bg-accent-600` → hover `bg-accent-700`, white bold 14px, pill
- **Secondary button**: `bg-surface border border-border text-text`, pill
- **Text link**: `text-accent-text` + arrow suffix; hover `text-accent-700`
- **Active nav item**: chip tint background + `text-accent-700`, pill
- **Kicker**: `.kicker` class (accent-600 via `--color-accent-text`, 12px bold uppercase tracked), optionally in a chip
- **Stat tile**: `bg-inset border border-border`, value `text-accent-hover` (large), label `text-text-muted` tiny uppercase
- **Dark band / badge**: `bg-primary` (#772953) white text; hover `bg-primary-hover` (#5e2750 Finn)
- **Gradient band**: `from-primary-700 to-secondary-700` (white text passes on both ends)
- **Focus ring**: accent-500, 2px offset (global `:focus-visible` rule)
- **Card**: `bg-surface border border-border rounded-xl`, `box-shadow: var(--shadow-card)`; hover: `var(--shadow-card-hover)` + `border-color: var(--tint-accent-border-strong)` + `translateY(-2px)`, 0.2s ease

### Terminal hero card

`bg-terminal` (#300a24, the classic Ubuntu terminal), title bar
`bg-terminal-chrome` (#3d1230) with Yaru-style window controls on the RIGHT
(never macOS traffic lights), body `text-terminal-text` in Ubuntu Mono. Syntax:
prompt/keys `text-terminal-green` (#8ae234), string values
`text-terminal-orange` (#f77148 — never raw #e95420 for small code text),
comments/punctuation `text-terminal-muted` (#AEA79F). All terminal text pairs
exceed 6:1. Component: `src/components/TerminalCard.astro`.

### Semantic colors

Success #0e8420 (on Warm Grey backgrounds use `text-success-text` #0c771d),
Warning = orange **with dark aubergine text** (#2c001e on #e95420 = 5.11:1),
Error #c7162b, Info = aubergine. White text passes on all semantic fills except
warning (use dark text).

### Never do

- #AEA79F (`stone`) as text on light backgrounds — 2.38:1, decorative only
- Raw #e95420 for body-size text or links — use #c7420f (`accent-text`)
- Plum/aubergine as a second accent (chips, links, kickers) — orange only
- Pure grey neutrals — every neutral in this system is warm-toned

## Typography

### Fonts
- **Display (headings)**: Ubuntu 700 (h1-h3), 500 (h4, subheads)
- **Body**: Ubuntu 400; 500 for emphasis, buttons, nav items
- **Mono (terminal accents)**: Ubuntu Mono 400; 700 for `$`-prefixed labels
- Loaded via one combined Google Fonts request with `display=swap`; fallbacks: system-ui (sans), ui-monospace (mono). Do NOT preload gstatic .woff2 URLs (UA-dependent, hash-versioned); upgrade path if CLS appears is self-hosting in `public/fonts/`.

### Type Scale
| Token | Size | Usage |
|-------|------|-------|
| text-hero | 40-60px fluid | Homepage hero name only |
| text-h1 | 32-44px fluid | Page titles (one per page) |
| text-h2 | 28-40px fluid | Section titles |
| text-h3 | 18-20px fluid | Card titles, job titles, timeline entries |
| text-h4 | 16px | Subsection labels inside cards |
| text-lead | 15-18px fluid | Muted lead under section titles, max-width 42rem (`.lead`) |
| text-base | 16px | Body, line-height 1.6 |
| text-sm | 14px | Metadata, buttons, tag pills, mono labels |
| text-kicker | 12px | Kickers and tiny uppercase tile labels |

### Heading conventions
- h1/h2: weight 700, letter-spacing -0.02em, line-height 1.2, `text-wrap: balance`
- h3: weight 700; h4: weight 500
- Section header pattern: `.kicker` → h2 → `.lead`, centered by default (left-aligned variant for two-column bands)

### Kickers
Always Ubuntu (display font), NOT Ubuntu Mono: 0.75rem, weight 700, uppercase,
0.04em tracking, accent color. Optional pill variant: accent-tinted background,
fully rounded. Examples: PROFILE, CAPABILITIES, CAREER, PORTFOLIO, CONNECT.

### When to use Ubuntu Mono
Mono is the terminal accent, not a text style. Use it for:
- The terminal hero card (`const developer = { ... }`)
- `$ /work`-style section path labels on cards ("$ Visit project page")
- `>`-prefixed bullet/summary lines in hero and experience cards
- Bracketed date pills on timelines/accordions: `[2019 – 2024]`
- SNAKE_CASE subsection labels: `> KEY_IMPACT`, `> TECH_STACK`, `STATUS: ACTIVE`
- Skill/tech tag pills and code snippets

Do NOT use mono for: kickers, headings, body copy, buttons, nav items, or ANY
full sentences and content lists. Sentence bullets (hero `>` lines, card `→`
bullets, experience bullets, cert lists) and skill/language lists use the BODY
font at text-sm; only the `>`/`→`/`$` glyph prefix and bracket punctuation
stay mono (wrap the glyph in a `font-mono` span). Mono is for short accents
only: status lines, `$ commands`, `[dates]`, SNAKE_CASE labels, 2-4 word tags.
Keep mono at text-sm or smaller (Ubuntu Mono renders optically large; global
CSS sets code at 0.9375em).

## Spacing & Layout

- Section vertical padding: 5rem desktop → 3.5rem tablet → 2.75rem small mobile
- Content max-width: 72rem (`max-w-6xl`); prose/leads 42rem
- Section heading block margin-bottom: 2.5rem
- Card padding: 1.5rem → 1.25rem → 1rem; grid gaps ~1.5rem
- Card radius 0.75rem (`rounded-xl`); pills/buttons/tags fully rounded
- Sidebar: fixed left 16rem (lg+), content offset `lg:ml-64`; mobile top bar 3.5rem (`pt-14` offset)

## Voice & Microcopy

Professional with a little fun. The fun lives in: the terminal card, mono
microcopy (`response_time: usually < 24h`, footer `echo "Thanks for
scrolling"`), and the 404 bash joke. Body copy stays professional and factual —
every number must trace to intake sources.

## Conventions

- All internal links end with trailing slash (`/about/`) — Cloudflare requirement; `/` and file downloads excluded
- Images: local only (`public/images/`), explicit width/height, lazy except hero
- Skip-to-content link first in tab order; `aria-current="page"` on active nav
- Reduced motion: global media query kills animations (blinking cursor included)
