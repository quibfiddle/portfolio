---
name: project:homepage
description: Generate the homepage and establish the design system. Run after intake.
disable-model-invocation: true
---

# Generate Homepage

## Prerequisites

1. Check state: must be `intake_complete` or later
2. Read reference/analysis.md for context
3. Read intake/INTAKE.md for brand voice

## Generation Steps

1. **Create base layout** (`src/layouts/BaseLayout.astro`):
   - HTML structure with head, body
   - Import global.css
   - Slots for content

2. **Create shared components:**
   - `src/components/Header.astro` - Navigation from sitemap
   - `src/components/Footer.astro` - Contact info, links
   - `src/components/Hero.astro` - Main homepage hero

3. **Update Tailwind theme** (`src/styles/global.css`):
   - Apply colors from intake/branding/colors.md
   - Apply fonts from intake/branding/fonts.md

4. **Handle images** using **image-sourcer** agent:
   - Use images downloaded during intake from `public/images/`
   - If additional images are needed, download from the reference site and save locally
   - **Never hotlink** to external image URLs — all images must be in `public/images/`
   - Set explicit `width` and `height` on every `<img>` tag (prevents layout shift)
   - Hero image: `loading="eager"` and `fetchpriority="high"`
   - All other images: `loading="lazy"`
   - Use WebP/AVIF with `<picture>` fallbacks where possible
   - Compress appropriately (hero target < 200KB)

5. **Generate homepage** (`src/pages/index.astro`):
   - Hero section
   - Key content sections
   - Call-to-action

6. **Create 404 page** (`src/pages/404.astro`):
   - Use the BaseLayout with Header and Footer
   - Simple, branded message ("Page not found" or similar)
   - Link back to homepage
   - Match the design system (colors, typography, spacing)
   - This page is used for all unbuilt pages during development and for missing pages in production

7. **Document design system** (`src/DESIGN.md`):
   - Colors with usage guidelines
   - Typography scale
   - Spacing conventions
   - Component patterns

8. **Run Design Reviewer agent:**
   - Check WCAG 2.1 AA compliance
   - Verify responsive breakpoints
   - Report issues found

9. **Update state:**
   ```json
   {
     "phase": "homepage_pending_approval",
     "homepage_generated_at": "[timestamp]"
   }
   ```

10. **Request approval:**
   > Homepage generated. Please review at http://localhost:4321
   >
   > Design review found: [issues or "no issues"]
   >
   > Say "approved" to proceed to page generation, or describe what needs to change.

## On Iteration

If user requests changes:
1. Make the requested modifications
2. Re-run Design Reviewer
3. Request approval again

## On Approval

When user says "approved", "looks good", "proceed", etc.:
1. Update state to `homepage_approved`
2. Confirm: "Homepage approved. Run `/project:generate-pages` to continue."
