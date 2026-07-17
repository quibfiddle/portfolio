---
name: typography-system-generator
description: Generate a complete typography system with responsive type scale, font loading strategy, and Tailwind v4 theme tokens
---

# Typography System Generator Agent

## Purpose

Transform font choices from intake materials into a complete, performant typography system with fluid sizing, proper loading, and Tailwind v4 integration.

## Inputs

- `intake/branding/fonts.md` — Font families, weights, any type guidelines
- `reference/analysis.md` — Typography patterns observed on reference site
- `reference/screenshots/` — Visual reference for type sizing and hierarchy

## Process

### 1. Identify Font Families

From intake materials, determine:
- **Heading font**: Display/serif/sans for h1-h6
- **Body font**: Readable sans/serif for paragraphs
- **Mono font** (optional): For code blocks or technical content

If only one font is specified, use it for both headings and body.

### 2. Determine Font Source

For each font family:

**Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Self-hosted (preferred for performance):**
- Download font files
- Place in `public/fonts/`
- Generate `@font-face` declarations with `font-display: swap`

**System fonts (fallback):**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 3. Generate Type Scale

Use a modular scale with fluid sizing (CSS clamp). Base size: 16px (1rem).

**Recommended scale ratios:**
- Compact sites: 1.2 (minor third)
- Standard sites: 1.25 (major third)
- Bold/editorial: 1.333 (perfect fourth)

Generate fluid values using clamp:
```
--font-size-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem)     /* 12-13px */
--font-size-sm:   clamp(0.8rem, 0.77rem + 0.25vw, 0.875rem)    /* 13-14px */
--font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)     /* 16-17px */
--font-size-lg:   clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)    /* 18-20px */
--font-size-xl:   clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)      /* 20-24px */
--font-size-2xl:  clamp(1.5rem, 1.25rem + 1.25vw, 2rem)        /* 24-32px */
--font-size-3xl:  clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)    /* 30-40px */
--font-size-4xl:  clamp(2.25rem, 1.75rem + 2.5vw, 3rem)        /* 36-48px */
--font-size-5xl:  clamp(3rem, 2rem + 5vw, 4.5rem)              /* 48-72px */
```

### 4. Define Line Heights and Letter Spacing

```
/* Line heights */
--leading-none:    1
--leading-tight:   1.15      /* headings */
--leading-snug:    1.3       /* subheadings */
--leading-normal:  1.5       /* body default */
--leading-relaxed: 1.625     /* body comfortable */
--leading-loose:   1.75      /* small text */

/* Letter spacing */
--tracking-tighter: -0.03em  /* large display headings */
--tracking-tight:   -0.015em /* headings */
--tracking-normal:  0        /* body */
--tracking-wide:    0.025em  /* uppercase labels, small caps */
--tracking-wider:   0.05em   /* all-caps text */
```

### 5. Define Heading Styles

Map each heading level to a complete style:

```
h1: font-size-4xl/5xl, heading font, weight 700, leading-tight, tracking-tighter
h2: font-size-3xl, heading font, weight 700, leading-tight, tracking-tight
h3: font-size-2xl, heading font, weight 600, leading-snug, tracking-tight
h4: font-size-xl, heading font, weight 600, leading-snug, tracking-normal
h5: font-size-lg, heading font, weight 600, leading-normal, tracking-normal
h6: font-size-base, heading font, weight 600, leading-normal, tracking-wide
```

### 6. Generate Tailwind v4 Theme

Write typography tokens to `@theme` block in `src/styles/global.css`:

```css
@theme {
  /* Font families */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Font sizes (fluid) */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);
  --font-size-sm: clamp(0.8rem, 0.77rem + 0.25vw, 0.875rem);
  --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);
  --font-size-lg: clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --font-size-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
  --font-size-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem);
  --font-size-5xl: clamp(3rem, 2rem + 5vw, 4.5rem);

  /* Line heights */
  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### 7. Generate Font Loading

Add to `src/layouts/BaseLayout.astro` `<head>`:

**For Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**For self-hosted:**
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/inter-bold.woff2') format('woff2');
}
```

### 8. Generate Base Styles

Add base typography styles to `global.css`:

```css
body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--leading-normal);
  color: var(--color-foreground);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--leading-tight);
  color: var(--color-foreground);
  text-wrap: balance;
}

p {
  text-wrap: pretty;
  max-width: 70ch; /* Readable line length */
}
```

## Output

1. **Updated `src/styles/global.css`** — Typography tokens in `@theme`, base styles, `@font-face` if self-hosted
2. **Updated `src/layouts/BaseLayout.astro`** — Font preconnect/preload links
3. **Typography section in `src/DESIGN.md`** documenting:
   - Font families and where to use them
   - Complete type scale with pixel equivalents
   - Heading hierarchy with all properties
   - Line height and letter spacing guidelines
   - Font loading strategy chosen and why

## Example DESIGN.md Typography Section

```markdown
## Typography

### Fonts
- **Headings**: Inter (700, 600)
- **Body**: Inter (400, 500)
- **Mono**: JetBrains Mono (400)

### Type Scale
| Token | Size | Usage |
|-------|------|-------|
| text-xs | 12-13px | Captions, labels |
| text-sm | 13-14px | Secondary text, metadata |
| text-base | 16-17px | Body text |
| text-lg | 18-20px | Lead paragraphs |
| text-xl | 20-24px | h5, card titles |
| text-2xl | 24-32px | h4, section intros |
| text-3xl | 30-40px | h3 |
| text-4xl | 36-48px | h2 |
| text-5xl | 48-72px | h1, hero headlines |

### Heading Hierarchy
- **h1**: text-5xl, font-bold, tracking-tighter
- **h2**: text-4xl, font-bold, tracking-tight
- **h3**: text-3xl, font-semibold, tracking-tight
- **h4**: text-2xl, font-semibold
- **h5**: text-xl, font-semibold
- **h6**: text-base, font-semibold, uppercase tracking-wide
```
