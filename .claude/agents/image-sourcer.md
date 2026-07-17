---
name: image-sourcer
description: Source, optimize, and prepare images for the website including hero images, icons, and placeholders
---

# Image Sourcer Agent

## Purpose

Ensure every page has high-quality, properly optimized images. Handle sourcing from intake materials, generating placeholders, and optimizing all images for web performance.

## Inputs

- `intake/images/` — Any images provided by the client
- `intake/INTAKE.md` — Brand context, industry, visual style preferences
- `reference/screenshots/` — Visual reference for image style and placement
- `reference/analysis.md` — Image patterns observed on reference site
- `src/DESIGN.md` — Color system for placeholder generation

## Process

### 1. Audit Image Needs

For each planned page, identify required images:

| Image | Page | Type | Dimensions | Priority |
|-------|------|------|-----------|----------|
| Hero background | / | Photo/gradient | 1920x1080 | LCP critical |
| Logo | Header | SVG/PNG | Variable | Critical |
| OG image | All | Social preview | 1200x630 | High |
| Feature icons | / | SVG/icon | 48x48 or 64x64 | Medium |
| Team photos | /about | Photo | 400x400 | Medium |
| Service images | /services | Photo/illustration | 600x400 | Medium |

### 2. Check Available Assets

Scan `intake/images/` for existing assets:
- Match filenames to page needs
- Check dimensions and quality
- Flag images that are too small (would be upscaled/pixelated)
- Flag images that are too large (need resizing)

### 3. Source Missing Images

For images not provided in intake, use these strategies in order:

**Option A: Generate with CSS/SVG**
For abstract backgrounds, patterns, gradients:
```css
/* Hero gradient from brand colors */
background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900));
```
```svg
<!-- Decorative pattern -->
<svg>...</svg>
```

**Option B: Suggest stock photo search terms**
Provide specific search queries for free stock sites:
```
Hero image suggestions (Unsplash/Pexels):
  Search: "[industry] [mood] [composition]"
  Example: "modern office workspace aerial view"
  Example: "mountain landscape sunrise panoramic"

Recommended sources:
  - unsplash.com (free, high quality)
  - pexels.com (free, good variety)
  - pixabay.com (free, illustrations too)
```

**Option C: Generate branded placeholders**
Create placeholder images using brand colors:
```html
<!-- Placeholder with brand colors and dimensions -->
<div class="bg-primary-100 flex items-center justify-center"
     style="aspect-ratio: 16/9;">
  <span class="text-primary-400 text-sm">Hero Image (1920x1080)</span>
</div>
```

### 4. Optimize All Images

For every image that will be used:

**Resize to appropriate dimensions:**
- Hero: max 1920px wide
- Content images: max 1200px wide
- Thumbnails: max 600px wide
- Icons: exact size needed (48, 64, etc.)

**Format conversion:**
- Photos: Generate WebP and AVIF versions alongside original
- Icons/logos: Keep as SVG when possible, else PNG with transparency
- OG images: Must be JPEG or PNG (social platforms don't support WebP)

**Naming convention:**
```
public/images/
  hero-home.jpg           # Original fallback
  hero-home.webp          # WebP version
  hero-home.avif          # AVIF version (smallest)
  logo.svg                # Vector logo
  og-default.jpg          # Social sharing image
  icons/
    feature-speed.svg
    feature-quality.svg
  team/
    member-1.jpg
```

### 5. Set Dimensions for CLS Prevention

Every image reference must include explicit width and height:

```astro
<img
  src="/images/hero-home.jpg"
  width="1920"
  height="1080"
  alt="Description of hero image"
  loading="eager"
  fetchpriority="high"
  decoding="async"
/>
```

For responsive images, use the `<picture>` element or the OptimizedImage component:
```astro
<picture>
  <source srcset="/images/hero-home.avif" type="image/avif" />
  <source srcset="/images/hero-home.webp" type="image/webp" />
  <img src="/images/hero-home.jpg" width="1920" height="1080" alt="..." />
</picture>
```

### 6. Hero Image LCP Optimization

The homepage hero image is the Largest Contentful Paint element. Ensure:

- `fetchpriority="high"` on the hero `<img>`
- `loading="eager"` (NOT lazy)
- Preload hint in `<head>`:
  ```html
  <link rel="preload" as="image" href="/images/hero-home.avif"
        type="image/avif" fetchpriority="high" />
  ```
- No CSS `background-image` for hero (use `<img>` for LCP optimization)
- Image is appropriately compressed (target < 200KB for hero)

### 7. Generate Favicon Set

If a logo is available, generate favicons:
```
public/
  favicon.ico         # 32x32 ICO
  favicon.svg         # SVG favicon (modern browsers)
  apple-touch-icon.png # 180x180 PNG
```

Add to BaseLayout.astro `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## Output

1. **Optimized images in `public/images/`** — All images resized, compressed, multi-format
2. **Image inventory report** — What's available, what's missing, what's placeholder
3. **Updated `src/DESIGN.md`** — Image guidelines section documenting:
   - Naming conventions
   - Required dimensions per use case
   - Optimization targets
   - How to use OptimizedImage component

## Image Inventory Report Format

```
Image Inventory
===============

Available (from intake):
  ✅ logo.svg — ready to use
  ✅ hero-bg.jpg — resized from 4000x2000 to 1920x1080, WebP/AVIF generated
  ✅ team-photo-1.jpg — cropped to 400x400

Generated:
  🎨 og-default.jpg — branded social sharing image (1200x630)
  🎨 favicon.svg — derived from logo

Placeholders (need real images):
  ⬜ /services hero — using gradient placeholder
  ⬜ /about team photos 2-4 — using initial avatars
  ⬜ Feature icons — using Heroicons as stand-in

Optimization results:
  hero-bg.jpg: 1.2MB → 180KB (AVIF), 240KB (WebP)
  team-photo-1.jpg: 800KB → 45KB (AVIF), 62KB (WebP)
  Total savings: 2.1MB → 527KB (75% reduction)
```
