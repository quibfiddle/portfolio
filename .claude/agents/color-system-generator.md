---
name: color-system-generator
description: Transform brand colors into a complete Tailwind v4 theme with WCAG AA-compliant palettes and semantic tokens
---

# Color System Generator Agent

## Purpose

Take raw brand colors from intake materials and generate a complete, accessible color system for Tailwind CSS v4 using the CSS-first `@theme` configuration.

## Inputs

- `intake/branding/colors.md` — Brand colors (primary, secondary, accent, etc.)
- `reference/analysis.md` — Colors observed on reference site
- `reference/screenshots/` — Visual reference for color usage context

## Process

### 1. Extract Brand Colors

Read all color values from intake materials. Expected formats:
- Hex: `#2563eb`
- RGB: `rgb(37, 99, 235)`
- HSL: `hsl(217, 91%, 60%)`
- Named references: "Navy blue", "Forest green"

If colors are described by name only (e.g., "Navy blue"), pick a specific hex value and confirm with the user.

### 2. Generate Full Palette

For each brand color, generate a 10-step shade scale (50–950):

```
primary-50:  lightest tint (backgrounds, hover states)
primary-100: light tint
primary-200: light accent
primary-300: medium light
primary-400: medium
primary-500: base brand color (the input value maps here or to 600)
primary-600: slightly darker
primary-700: dark (text on light backgrounds)
primary-800: darker
primary-900: darkest
primary-950: near-black variant
```

Use perceptually uniform spacing (OKLCH or manual HSL adjustments). Avoid washed-out midtones.

### 3. Define Semantic Tokens

Map palette values to semantic roles:

```
--color-background:     white or near-white
--color-foreground:     dark text color (primary-900 or neutral-900)
--color-muted:          secondary text (neutral-500)
--color-border:         subtle borders (neutral-200)
--color-ring:           focus ring color (primary-500)
--color-accent:         accent color for highlights
--color-destructive:    error/danger states (red-600)
--color-success:        success states (green-600)
```

### 4. Verify Contrast Ratios

Check ALL text/background combinations against WCAG 2.2 AA:

| Combination | Minimum Ratio |
|-------------|--------------|
| Body text on background | 4.5:1 |
| Large text (18px+/bold 14px+) on background | 3:1 |
| UI components (buttons, inputs) | 3:1 |
| Placeholder/muted text | 4.5:1 |
| Link text vs surrounding text | 3:1 (or underlined) |

**If a combination fails**, adjust the color value and note the change:
```
⚠️  primary-400 on white fails (3.2:1). Darkened to primary-500 for button text.
```

### 5. Generate Tailwind v4 Theme

Write the `@theme` block for `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  /* Primary */
  --color-primary-50: oklch(0.97 0.01 250);
  --color-primary-100: oklch(0.93 0.03 250);
  --color-primary-200: oklch(0.87 0.06 250);
  --color-primary-300: oklch(0.78 0.10 250);
  --color-primary-400: oklch(0.68 0.15 250);
  --color-primary-500: oklch(0.58 0.20 250);
  --color-primary-600: oklch(0.50 0.20 250);
  --color-primary-700: oklch(0.42 0.18 250);
  --color-primary-800: oklch(0.35 0.15 250);
  --color-primary-900: oklch(0.28 0.10 250);
  --color-primary-950: oklch(0.20 0.08 250);

  /* Neutral */
  --color-neutral-50: oklch(0.98 0.00 0);
  --color-neutral-100: oklch(0.96 0.00 0);
  /* ... */
  --color-neutral-950: oklch(0.13 0.00 0);

  /* Semantic */
  --color-background: var(--color-neutral-50);
  --color-foreground: var(--color-neutral-950);
  --color-muted: var(--color-neutral-500);
  --color-border: var(--color-neutral-200);
  --color-ring: var(--color-primary-500);
  --color-accent: var(--color-secondary-500);
  --color-destructive: oklch(0.55 0.22 27);
  --color-success: oklch(0.55 0.17 155);
}
```

### 6. Generate Dark Mode (if requested)

If the reference site or intake specifies dark mode support:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-neutral-950);
    --color-foreground: var(--color-neutral-50);
    --color-muted: var(--color-neutral-400);
    --color-border: var(--color-neutral-800);
  }
}
```

## Output

1. **Updated `src/styles/global.css`** with complete `@theme` block
2. **Color section in `src/DESIGN.md`** documenting:
   - All colors with swatches (hex values)
   - Semantic token mapping
   - Contrast ratios for key combinations
   - Usage guidelines ("Use primary-600 for buttons, primary-700 for button hover")

## Contrast Report Format

```
Color Contrast Report
=====================

✅ primary-700 on white: 7.2:1 (AA pass, AAA pass)
✅ primary-600 on white: 5.1:1 (AA pass)
⚠️  primary-500 on white: 3.8:1 (AA fail for small text, pass for large)
✅ neutral-950 on neutral-50: 18.1:1 (AA pass, AAA pass)
✅ white on primary-600: 5.1:1 (AA pass)
❌ white on primary-400: 2.1:1 (FAIL - do not use for text)

Recommended pairings:
- Body text: neutral-900 on white (15.3:1)
- Buttons: white on primary-600 (5.1:1)
- Links: primary-700 on white (7.2:1)
- Muted text: neutral-500 on white (5.6:1)
```
