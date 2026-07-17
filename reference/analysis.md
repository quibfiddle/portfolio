# Reference Site Analysis

**Source:** https://thanhtran-portfolio.vercel.app/
**Crawled:** 2026-07-16
**Pages found:** 12
**Stack:** Nuxt 3 (SSG), Tailwind CSS v4, Inter font, Lucide icons, deployed on Vercel

## Purpose of this document

Reference for rebuilding Stuart Bingham's portfolio (developer/IT professional). Planned pages: `/`, `/about/`, `/work/`, `/resume/`, `/contact/`. The reference's blog and interactive labs (AI chat, telemetry, sandbox, queue lab, feedback) are **out of scope** — they are documented here only as inventory. Color values below describe the *roles* colors play; the rebuild will use the Ubuntu brand palette, not these values.

## Discovered Pages

| Path | Title | In Nav | Notes |
|------|-------|--------|-------|
| / | Thanh Tran — Software Engineer · Live Lab | Yes (Pages) | Homepage |
| /about | About — Thanh Tran | Yes (Pages) | Profile, skills, education |
| /work | Work — Thanh Tran | Yes (Pages) | Experience + projects |
| /blog | Blog — Thanh Tran | Yes (Pages) | Out of scope for rebuild |
| /contact | Contact — Thanh Tran | Yes (Pages) | No form — mailto/LinkedIn CTAs |
| /ai | AI Lab — Thanh Tran | Yes (Lab group) | Out of scope |
| /telemetry | Live Telemetry — Thanh Tran | Yes (Lab group, "Live Ops") | Out of scope |
| /sandbox | API Sandbox — Thanh Tran | Yes (Lab group) | Out of scope |
| /queue-lab | Queue Ops Lab — Thanh Tran | Yes (Lab group) | Out of scope |
| /feedback | Reviews & ideas — Thanh Tran | No (footer/homepage card only) | Out of scope |
| /blog/shipping-the-sandbox | Shipping a public API sandbox to a portfolio site | No | Blog post |
| /blog/telemetry-without-a-database | Telemetry without a database | No | Blog post |

No form elements were server-rendered on any page (contact is CTA-driven: Email me / LinkedIn buttons).

## Screenshots

All in `reference/screenshots/`:

- `home-desktop.png` (1280px, light, AI chat dismissed)
- `home-desktop-dark.png` (1280px, dark theme)
- `home-mobile.png` (375px)
- `about-desktop.png`, `work-desktop.png`, `contact-desktop.png`, `blog-desktop.png` (1280px)

Note: the hero subtitle uses a typewriter animation — some captures show it mid-type ("Product-Minded Full…").

## Layout & Structure

### Navigation pattern (distinctive)

- **Desktop: fixed left sidebar** (~16rem / 256px, `--sidebar-w:16rem`), white surface on light theme, containing:
  - Brand block: avatar/initials mark ("TT" in accent-color rounded square) + name + role subtitle
  - "PAGES" group label (small caps, muted): Home, About, Work, Blog, Contact — each with a Lucide icon; active item gets a light accent-tinted pill background + accent text
  - "LAB" group label: Ask AI (with green LIVE pill), Live Ops, Sandbox, Queue Lab
  - Bottom: theme control "Theme · Light" with sun icon; sidebar has a collapse chevron on its edge
- **Mobile: top bar** (3.5rem, `--mobile-bar-h`) with grid menu button (opens nav), brand mark + current page name, theme toggle button. Also a bottom-nav height var (`--bottom-nav-h:4rem`) exists.
- Content area sits to the right of the sidebar on a tinted page background (sidebar surface is lighter than the page bg — surface-on-background layering).

### Footer

Minimal, centered in content column, top border/divider:
- Two link columns with small-caps accent-colored group labels: "PAGES" (Home, About, Work, Blog, Contact) and "LIVE LAB" (Ask AI, Live Ops, Sandbox, Queue Lab)
- Single copyright line: "© 2026 Thanh Tran · Software Engineer · Built for large-scale systems."
- No contact info, no social icons in footer (those live on Contact page and hero CTAs).

### Homepage section order (top to bottom)

1. **Hero** (min-h-screen, two columns on desktop):
   - Left: "CURRENTLY SHIPPING" status pill (pulsing dot + uppercase label + context line, outlined rounded container) → huge name (h1) → typewriter role subtitle → three `>`-prefixed terminal-style bullet lines (experience, specialty, location/availability) → **row of 4 stat tiles** (bordered cards: big accent-colored value + tiny uppercase label, e.g. "IKEA / shipped to 4 new live markets", "2+ yrs", "MSc", "FE · BE · Cloud") → **CTA row**: filled pill button ("Ask my AI" with live dot), outlined pill buttons (GitHub, LinkedIn), disabled ghost button ("Resume — updating")
   - Right: **code-styled "developer object" card** — an elevated rounded panel styled like a macOS window (red/yellow/green traffic-light dots) containing a JS object literal: `> const developer = { name, role, experience, education, location, passion, mission, focus, status }`. This is the signature hero treatment.
2. **Live telemetry strip** (out-of-scope feature): bordered card with LIVE pill, `$ LIVE_TELEMETRY` mono label, big visitor count, "Open observatory →" link.
3. **Ask AI panel** (out of scope): kicker "ASK AI", h2 "Talk to this portfolio", description, suggested-question chips, primary + secondary buttons, on a subtle gradient-tinted card.
4. **Lab overview grid** ("There's more here"): kicker "LAB", big h2, lead paragraph, then 4 equal cards — each with mono `$ /route` label, h3, description, 3 `→`-prefixed mini-bullets, and an accent "Open… →" text link. (Out of scope content, but the card grid pattern itself is reusable.)
5. **Footer.**
6. Floating "Ask the AI" pill button bottom-right (out of scope).

### About page structure

1. Centered page header: small-caps accent kicker ("PROFILE") → h1 "About me" → muted lead sentence.
2. Two-column profile band: left card = avatar, 2-col mini stat grid (Experience / Education / Markets / Projects / Location), availability line, full-width primary pill button ("Get in touch"); right card = **tabbed panel** (Overview | Philosophy | Expertise | Achievements | Interests) with paragraph/list content per tab.
3. Skills section: kicker "CAPABILITIES" → h2 "Skills & technologies" → lead → **filter pill row** (7 categories) → card listing skills as rows (name, description, n/5 rating with small progress bar) → summary stat row (45+ Technologies / 7 Categories / 3.8/5 Average depth).
4. Education section: kicker "BACKGROUND" → h2 "Education" → **vertical timeline** (accent dots on a line, cards with institution h3, bracketed date pill `[2026 – 2029]`, description, mono "STATUS: ACTIVE/COMPLETED" tag).

### Work page structure

1. Centered header: kicker "CAREER" → h1 "Experience".
2. **Accordion experience cards**, newest first and expanded ("ACTIVE MISSION" pill, COLLAPSE/EXPAND buttons): job title + company h3, bracketed mono date `[12/2025 – now]`, `>`-prefixed summary line, mini stat grid (4 labeled facts), tech tag pills, then mono-labelled subsections `> KEY_IMPACT` (bullet list) and `> TECH_STACK` (grouped tag grids: frontend / backend / integrations / delivery).
3. Projects section: kicker "PORTFOLIO" → h2 "Selected projects" → **featured full-width "FLAGSHIP" card** with screenshot hero image, then 2-column grid of project cards: preview image (or "NO PREVIEW" placeholder panel), `$`-prefixed mono title, tag pills, `>`-prefixed description lines, "$ Visit project page" link. "VIEW PROJECT" label appears on image hover area.

### Contact page structure

1. Centered header: kicker "CONNECT" → h1 "Get in touch" → two-line lead.
2. Two-column band: left large card = availability pill ("OPEN TO SOFTWARE ENGINEERING ROLES"), big h2 headline ("Got a role, project, or thorny system?"), paragraph, 3 stat tiles (Netherlands / <24h reply / MSc·2026), CTA row (filled "Email me" + outlined "Connect on LinkedIn"), 2x2 grid of dot-prefixed strength bullets. Right narrow column = "GOOD FIT FOR" checklist card (3 check-icon rows) + "FAST PATHS" contact-method cards (icon tile + kicker + method name + address for Email / LinkedIn / GitHub) + "RESPONSE" note card.
3. Full-width dashed-border "Or leave it in public" feedback cross-promo card (out of scope).

## Extracted Design Values

### Typography

- **Single family**: Inter for everything, including "mono" elements (`--font-mono` is aliased to `--font-sans`) — the "monospace" look is achieved with small sizes, uppercase, letter-spacing, and `$`/`>`/`_` glyph prefixes rather than an actual mono font. (For the rebuild, Ubuntu + Ubuntu Mono is a natural upgrade — a real mono face for these accents.)
- Fluid heading scale (clamp-based):
  - h1: `clamp(2rem, 5vw, 2.75rem)` (~32–44px), weight 700, letter-spacing -0.02em, line-height 1.2. The homepage hero name renders much larger (~60px+).
  - h2 / section titles: `clamp(1.75rem, 4.5vw, 2.5rem)` (~28–40px), weight 700, -0.02em tracking
  - h3: 1.125rem (18px), semibold/bold
  - Section lead: `clamp(0.95rem, 1.4vw, 1.125rem)`, muted color, max-width 42rem, line-height 1.6, centered under section titles
  - Body: 16px base, ~1.6 line height; small text 0.875rem; tiny labels 0.75rem
- **Kicker pattern** (used above every section title): 0.75rem, weight 700, uppercase, letter-spacing 0.04em, accent color, sometimes in a pill (`.kicker-pill`: accent-tinted background, fully rounded, 0.25rem × 0.75rem padding).
- Terminal-flavored microcopy: `>` line prefixes, `$ /route` labels, `[date]` brackets, `SNAKE_CASE` subsection labels (`> KEY_IMPACT`, `> TECH_STACK`, `STATUS: ACTIVE`).

### Spacing rhythm

- Section vertical padding: 5rem (80px) desktop → 3.5rem tablet → 2.75rem small mobile (`--section-py`)
- Section horizontal padding: 1.25rem → 1rem → 0.875rem (`--section-px`)
- Content max-width: 72rem (1152px, `--content-max`); prose/leads constrained to 42rem
- Section heading block margin-bottom: 2.5rem
- Card padding: 1.5rem desktop → 1.25rem → 1rem (`--card-pad`)
- Grid gaps: ~1.5rem between cards
- Sidebar width 16rem; mobile bar 3.5rem

### Radii, borders, shadows

- Card radius: 0.75rem (`--card-radius`); smaller elements 0.5rem
- Pills/buttons/tags: fully rounded (9999px)
- Cards: 1px solid border + soft layered shadow (`0 0 2px` + `0 8px 24px -4px`), hover: stronger shadow + border shifts toward accent at 45% alpha + `translateY(-2px)`, 0.2s ease transitions
- Stat tiles and info tiles: 1px accent-tinted or neutral border, tinted inset background (`--theme-inset-bg`)
- Dashed borders used for cross-promo/secondary panels

### Buttons

- **Primary**: solid accent background, white text, fully rounded (9999px), 0.625rem × 1rem padding, 0.875rem bold, hover darkens to `--theme-accent-hover`, 0.15s transition. Uppercase on hero CTAs.
- **Secondary**: white/surface background, 1px border, dark text (or accent text/border variant), same pill shape
- **Ghost/disabled**: muted text, faint border (e.g. "Resume — updating")
- **Text links**: accent color with `→` arrow suffix ("Open the sandbox →")

### Color roles (patterns to replicate, not values)

Theme system: 3 themes cycled by toggle — light (default), dark, "neon" — implemented as `:root[data-theme=…]` CSS variable swaps. Reference values for role mapping:

| Role | Light value (reference) | Dark value | Role description |
|------|------------------------|------------|------------------|
| `--theme-bg` | #f4f7fb (cool near-white) | #111 | Page background — subtly tinted, never pure white |
| `--theme-surface` | #ffffff | #1a1a1a | Cards, sidebar, panels — one step lighter than bg (layering: bg → surface → inset) |
| `--theme-inset-bg` | #e8eef5 | rgba(255,255,255,.08) | Tinted wells inside cards (stat tiles, code panel zones) |
| `--theme-text` | #111 | #f5f5f5 | Headings and primary text |
| `--theme-text-muted` | #484848 | #929292 | Leads, descriptions, labels |
| `--theme-accent` | **#0058a3 (IKEA blue)** | #78bcff (lightened) | THE single accent: active nav pill, kickers, stat values, primary buttons, links, hover borders, timeline dots, brand mark |
| `--theme-accent-hover` | #003d82 | #bcddff | Button hover |
| `--theme-border` | #dfdfdf | #484848 | 1px card/divider borders |
| `--color-brand-light` | #e6f1ff | accent @ 15% alpha | Kicker-pill and tinted-chip backgrounds |
| Status tones | ok #0a8a00 · warn #f26a2f · danger #e00751 | brightened variants | LIVE badges, status dots (mostly lab features) |

**Key pattern: one accent color does all the work.** There is no secondary hue — hierarchy comes from the accent + neutrals + tint layering (accent at 100% for fills, ~15% alpha for chip backgrounds, ~24–45% alpha for tinted borders). For the Ubuntu rebuild: Ubuntu orange (#E95420) takes the `--theme-accent` role; aubergine tones can serve the dark theme bg/surface layering; keep the bg → surface → inset three-level layering and the accent-tint chips.

Accent appears in: sidebar active state, brand mark square, all kickers, stat-tile values, primary buttons, text links, footer group labels, tag pill text/borders, hover border glow, timeline dots, skill progress bars.

### Notable design features

1. **Code-styled "developer object" hero card** — macOS-window panel with traffic-light dots rendering a `const developer = {...}` object literal. The signature element; directly reusable for Stuart with his own fields.
2. **Terminal/CLI voice throughout** — `>` bullets, `$ /path` card labels, `[dates]` in brackets, `> KEY_IMPACT` subsection headers, `STATUS:` tags. Gives a developer identity without being a full terminal theme.
3. **Left sidebar navigation** with grouped sections (Pages / Lab), icons, active pill — instead of a top navbar. Collapsible; becomes a slim top bar + drawer on mobile.
4. **Theme toggle** (light/dark/neon cycle) in the sidebar footer, CSS-variable-driven, persisted. Dark theme flips surfaces and lightens the accent for contrast.
5. **Stat tiles** as a recurring motif: hero (4), about profile card (5), contact (3), work experience cards (4 each) — big accent value + tiny uppercase muted label in a bordered tile.
6. **Status/availability pills** with pulsing dot ("CURRENTLY SHIPPING", "OPEN TO ... ROLES", "LIVE") — reusable for Stuart's availability messaging.
7. **Micro-interactions**: card hover lift (translateY(-2px) + shadow + accent border), typewriter animation on hero subtitle, 0.15–0.2s ease transitions everywhere, pulsing live dots.
8. **Kicker → title → lead** centered section-header pattern used on every section, with left-aligned variant (`--left`) available.
9. **Accordion experience entries** on Work (expanded current role, collapsed past roles) and **tabbed content panel** on About — good density-management patterns for a resume-heavy site.
10. **Skill ratings** as n/5 with slim progress bars, grouped by filterable category pills.

## Implications for the Stuart rebuild

- Keep: sidebar nav (Pages group only — no Lab group), code-object hero, stat tiles, terminal microcopy accents (use real Ubuntu Mono), kicker/title/lead sections, card + hover system, light/dark theme toggle, timeline education, accordion work history, pill CTAs.
- Replace: all lab/AI/telemetry/feedback surfaces are out of scope; homepage sections 2–4 need Stuart-appropriate replacements (e.g. skills highlights, featured work, contact CTA band).
- Add: `/resume/` page (reference has only a disabled "Resume — updating" button — no equivalent page to copy; can adapt the Work page's accordion + About's timeline patterns).
- Nav for rebuild: Home, About, Work, Resume, Contact (single "Pages" group; trailing-slash internal links per project convention).
