---
name: site-analyzer
description: Crawl reference websites to discover all pages, extract structure, design details, and screenshots
---

# Site Analyzer Agent

## Purpose

Crawl and analyze reference URLs to:
- **Discover ALL internal pages** on the reference site
- Extract page structure and navigation patterns
- Capture visual design patterns and components
- **Extract specific design values** (colors, fonts, spacing, section ordering)
- Build a complete page inventory for reconciliation

## Process

### 1. Extract Reference URL

Read intake/INTAKE.md and get the primary reference URL.

### 2. Crawl Site for Page Discovery

Starting from homepage, discover all internal pages:

```
discovered_pages = []
visited = set()
queue = [homepage_url]

while queue:
  url = queue.pop()
  if url in visited: continue
  visited.add(url)

  page = fetch(url)
  discovered_pages.append({
    "path": url.pathname,
    "title": page.title,
    "has_form": page.has_form,
    "nav_item": is_in_navigation
  })

  # Find all internal links
  for link in page.internal_links:
    if link not in visited:
      queue.append(link)
```

**Crawl limits:**
- Max 100 pages (to avoid runaway crawls)
- Same domain only (no external links)
- Skip: /wp-admin, /login, query strings, anchors, assets

### 3. Capture Screenshots

For key pages (homepage, main nav items, unique layouts):
- Full-page screenshots to reference/screenshots/
- Name format: `[path-slug].png`

### 4. Analyze Design Patterns

For each page type, note:
- Hero style (image, video, text-only)
- Card/grid layouts
- CTA patterns
- Form styles
- Footer structure

### 5. Extract Design Values

**Colors:**
Inspect the reference site and extract actual color values used:
- Primary brand color (most prominent non-neutral color)
- Secondary brand color (if present)
- Accent/highlight color
- Background colors (page, sections, cards)
- Text colors (headings, body, muted)
- Button colors (primary CTA, secondary CTA)
- Border/divider colors

Report as hex values:
```
Colors extracted:
  Primary: #2563eb (blue, used in buttons and links)
  Secondary: #7c3aed (purple, used in accents)
  Heading text: #111827 (near-black)
  Body text: #4b5563 (dark gray)
  Muted text: #9ca3af (medium gray)
  Background: #ffffff (white)
  Alt background: #f9fafb (light gray, used on alternating sections)
  Border: #e5e7eb (light gray)
  Primary button: #2563eb bg, #ffffff text
  Secondary button: #ffffff bg, #2563eb text, #2563eb border
```

**Typography:**
Inspect and extract font information:
- Font family names (heading font, body font)
- Font weights used (400, 500, 600, 700)
- Approximate heading sizes (h1 through h6)
- Body text size
- Line heights (tight for headings, relaxed for body)
- Letter spacing (especially on headings and uppercase text)

Report:
```
Typography extracted:
  Heading font: "Inter" or "Poppins" (sans-serif)
  Body font: "Inter" (sans-serif)
  h1: ~48px, bold, tight line-height
  h2: ~36px, bold
  h3: ~24px, semibold
  Body: ~16px, regular, 1.5 line-height
  Small text: ~14px
```

**Spacing:**
Note the spacing rhythm:
- Section vertical padding (how much space between sections)
- Container max-width (how wide the content area is)
- Grid gaps (space between cards/columns)
- Component internal padding

Report:
```
Spacing patterns:
  Section padding: ~80-100px vertical
  Container max-width: ~1200px
  Grid gap: ~24-32px
  Card padding: ~24px
  Horizontal page padding: ~16px mobile, ~24px desktop
```

### 6. Extract Homepage Content

**This is critical.** Extract ALL text content from the homepage, organized by section:

```
Homepage content (by section):

Navigation:
  Logo text/alt: "[Company Name]"
  Nav items: Home, About, Services, Contact

Hero:
  Headline: "[exact headline text]"
  Subheadline: "[exact subheadline text]"
  CTA button: "[exact button text]"
  Secondary CTA: "[exact text]" (if present)

Features/Services:
  Section headline: "[text]"
  Feature 1: Title: "[text]", Description: "[text]"
  Feature 2: Title: "[text]", Description: "[text]"
  Feature 3: Title: "[text]", Description: "[text]"

Testimonials:
  Quote 1: "[full quote]" — [Name], [Title], [Company]
  Quote 2: "[full quote]" — [Name], [Title], [Company]

Stats:
  Stat 1: [number] [label]
  Stat 2: [number] [label]

About section:
  Headline: "[text]"
  Body: "[full paragraph text]"

CTA section:
  Headline: "[text]"
  Body: "[text]"
  Button: "[text]"

Footer:
  Company description: "[text]"
  Contact: [phone], [email], [address]
  Social links: [list]
```

### 7. Extract Homepage Section Ordering

Document the exact order of sections on the reference homepage:

```
Homepage sections (top to bottom):
  1. Navigation bar (sticky, white bg)
  2. Hero (full-width image with text overlay, CTA button)
  3. Logo bar (client/partner logos, gray on white)
  4. Features grid (3 columns, icon + title + description)
  5. About section (text left, image right, 2-column)
  6. Statistics bar (4 numbers with labels, dark bg)
  7. Testimonials (carousel/slider, 1 at a time)
  8. CTA section (centered text, primary button, gradient bg)
  9. Footer (4-column links, contact info, social icons)
```

### 8. Generate Output

**reference/analysis.md:**
```markdown
# Reference Site Analysis

**Source:** [URL]
**Crawled:** [timestamp]
**Pages Found:** [count]

## Discovered Pages

| Path | Title | In Nav | Has Form |
|------|-------|--------|----------|
| / | Home | Yes | No |
| /about | About Us | Yes | No |
| /contact | Contact | Yes | Yes |
| /services/consulting | Consulting | No | No |
...

## Design Patterns

### Layout Types
- Homepage: [description]
- Interior pages: [description]
- Form pages: [description]

### Components
- Hero: [description]
- Navigation: [description]
- Footer: [description]
- Cards: [description]

### Screenshots
- Homepage: reference/screenshots/home.png
- About: reference/screenshots/about.png
...

## Extracted Design Values

### Colors
[Full color extraction as described above]

### Typography
[Full typography extraction as described above]

### Spacing
[Full spacing extraction as described above]

## Homepage Content (Extracted)
[Full content extraction organized by section as described above]

### Homepage Section Order
[Ordered list of sections as described above]

## Notes
[Observations, patterns to follow, unique elements worth replicating]
```

**Update state.json:**
```json
{
  "pages": {
    "discovered": [
      { "path": "/", "title": "Home", "in_nav": true },
      { "path": "/about", "title": "About", "in_nav": true },
      ...
    ]
  }
}
```

## Output

- `reference/screenshots/` - Visual reference images
- `reference/analysis.md` - Full analysis document with design values
- `.site-factory/state.json` - Updated with discovered pages
