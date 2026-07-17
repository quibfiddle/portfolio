---
name: visual-qa
description: Take screenshots at all breakpoints, compare against reference, and flag visual regressions or layout issues
---

# Visual QA Agent

## Purpose

Visually verify generated pages by taking screenshots at all responsive breakpoints and comparing against reference site screenshots. Catch layout breaks, visual regressions, and rendering issues that code-level review would miss.

## Inputs

- Running dev server at `http://localhost:4321`
- `reference/screenshots/` — Reference site screenshots for comparison
- `src/DESIGN.md` — Design system to verify against
- `.site-factory/state.json` — List of built pages to check

## Process

### 1. Ensure Dev Server is Running

Check if the dev server is accessible:
```
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321
```

If not running, start it:
```
npm run dev &
```

Wait for it to be ready before proceeding.

### 2. Capture Screenshots at All Breakpoints

For each built page, take screenshots using the Playwright MCP browser tools at these viewport sizes:

| Breakpoint | Width | Height | Name |
|------------|-------|--------|------|
| Mobile | 375 | 812 | mobile |
| Tablet | 768 | 1024 | tablet |
| Desktop | 1280 | 800 | desktop |
| Wide | 1440 | 900 | wide |

**Screenshot process per page:**
1. Navigate to the page URL
2. Resize viewport to target dimensions
3. Wait for all images and fonts to load
4. Take full-page screenshot
5. Save to `.site-factory/screenshots/[page-slug]-[breakpoint].png`

**File naming:**
```
.site-factory/screenshots/
  home-mobile.png
  home-tablet.png
  home-desktop.png
  home-wide.png
  about-mobile.png
  about-tablet.png
  ...
```

### 3. Visual Checks

For each screenshot, evaluate:

**Layout Integrity:**
- [ ] No horizontal scrollbar at any breakpoint
- [ ] Content doesn't overflow containers
- [ ] Grid layouts collapse properly on mobile
- [ ] Navigation transforms to mobile menu appropriately
- [ ] Footer stacks correctly on narrow viewports
- [ ] No overlapping elements

**Typography:**
- [ ] Text is readable at all sizes (no tiny text on mobile)
- [ ] Headings scale down appropriately
- [ ] No text truncation that hides important content
- [ ] Line lengths are comfortable (45-75 characters on desktop)

**Images:**
- [ ] Hero image fills expected area (no blank space)
- [ ] No broken images (missing src)
- [ ] Images aren't distorted (aspect ratio maintained)
- [ ] No visible pixelation on retina-density screenshots

**Spacing:**
- [ ] Consistent vertical rhythm between sections
- [ ] Adequate padding within sections (not cramped)
- [ ] Mobile sections have sufficient horizontal padding (min 16px)
- [ ] No elements touching viewport edges without padding

**Interactive Elements:**
- [ ] Buttons are tappable size on mobile (min 44x44px)
- [ ] Links are distinguishable from regular text
- [ ] Form inputs are full-width on mobile
- [ ] CTA buttons are prominent and visible

### 4. Compare Against Reference

If reference screenshots exist, compare:

**Overall impression:**
- Does the page feel like the same brand?
- Are the sections in a similar order?
- Is the visual weight distribution similar?

**Specific comparisons:**
- Hero section: similar impact and layout approach?
- Navigation: similar structure and behavior?
- Content sections: similar grid/card patterns?
- Footer: similar information hierarchy?

Note: The goal is NOT pixel-perfect replication, but capturing the same design intent and quality level.

### 5. Check for Common Issues

**CLS indicators:**
- Images without dimensions (will shift on load)
- Web fonts causing text reflow (check font-display)
- Dynamic content injected above fold

**Performance indicators:**
- Very large hero images visible in screenshot (check file size)
- Multiple large images above the fold
- Excessive DOM complexity visible in layout

**Dark mode (if applicable):**
- Text readable in dark mode
- No elements invisible against dark background
- Images don't clash with dark theme

## Output

### Screenshot Gallery

Save all screenshots and provide a summary:

```
Visual QA Report
================

Pages checked: 4
Breakpoints per page: 4
Total screenshots: 16

Screenshots saved to: .site-factory/screenshots/

Homepage (/)
  Mobile (375px):  ✅ Clean
  Tablet (768px):  ✅ Clean
  Desktop (1280px): ✅ Clean
  Wide (1440px):   ✅ Clean

About (/about)
  Mobile (375px):  ⚠️ Issue found
  Tablet (768px):  ✅ Clean
  Desktop (1280px): ✅ Clean
  Wide (1440px):   ✅ Clean
```

### Issues Report

```
Issues Found:

[Critical] /about mobile (375px): Team photo grid overflows container
  - Screenshot: .site-factory/screenshots/about-mobile.png
  - The 3-column grid doesn't collapse to 1 column
  - Fix: Add responsive classes (grid-cols-1 md:grid-cols-3)

[Warning] / desktop (1280px): Hero text hard to read over image
  - Screenshot: .site-factory/screenshots/home-desktop.png
  - White text on light image area lacks contrast
  - Fix: Add dark overlay or text shadow

[Info] /services tablet (768px): Cards have uneven heights
  - Screenshot: .site-factory/screenshots/services-tablet.png
  - Service cards are different heights due to varying text length
  - Fix: Consider min-height or line clamping

Reference comparison:
  Overall match: Good — same visual language and section ordering
  Differences:
    - Our hero is gradient-based; reference uses photography
    - Reference has more whitespace between sections
    - Footer is simpler than reference (missing social links)
```

### Severity Levels

**Critical** — Broken layout, unreadable text, missing content:
- Content overflow causing horizontal scroll
- Text completely unreadable (contrast, size, overlap)
- Major sections missing or collapsed to zero height
- Navigation unusable

**Warning** — Degraded but functional:
- Suboptimal contrast (readable but not ideal)
- Spacing inconsistencies
- Elements not quite aligned
- Images slightly wrong aspect ratio

**Info** — Polish items:
- Could improve visual hierarchy
- Minor spacing adjustments
- Enhancement suggestions from reference comparison
