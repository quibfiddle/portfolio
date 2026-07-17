---
name: project:generate-pages
description: Generate all remaining pages from planned list and create redirects. Run after homepage approved.
disable-model-invocation: true
---

# Generate Remaining Pages

## Prerequisites

1. Check state: must be `homepage_approved`
2. Read src/DESIGN.md for design system
3. Read `.site-factory/state.json` for:
   - `pages.planned[]` - pages to build
   - `pages.redirects[]` - redirects to create

## Generation Steps

### 1. Content Accuracy Rules

**CRITICAL:** Do not fabricate or assume business information. Follow these rules for all generated content:

- **Never change hours, addresses, phone numbers, or contact info** unless explicitly told to
- **Never add services the business doesn't offer** — only use services listed on the reference site or in intake materials
- **Never fabricate testimonials, stats, or credentials** — only use real ones from the reference site
- **Never assume how a procedure or service works** — only describe what the reference site describes
- **Standard industry information is okay** (e.g., "what to expect during a dental cleaning") but should be clearly general, not presented as the practice's specific process
- If information is missing, leave a placeholder or ask — don't make it up

### 2. Generate Each Planned Page

For each page in `state.pages.planned` (excluding home):

- Create page file in `src/pages/[path].astro`
- Use BaseLayout
- Follow design system from src/DESIGN.md
- Pull content from `intake/content/[page].md` if exists
- Generate content using Content Writer agent if needed
- Reference design from `reference/screenshots/` if available
- Update `state.pages.built[]` after each page

**Page type requirements:**

#### Location pages
- Locally SEO optimized (city/area name in title, meta description, headings, content)
- Full address, phone, hours (including Saturday/special hours)
- Google Maps embed or link
- List of services offered at this location
- Providers/doctors who work at this location with links to their pages
- LocalBusiness structured data (JSON-LD) with address, geo, hours, phone
- Insurance accepted (if available)
- Unique content per location — don't duplicate the same text across locations

#### Provider / doctor pages
- Provider name, credentials (DDS, DMD, etc.), title
- Headshot photo
- Locations they work at with links to location pages
- Services they provide
- Education, affiliations, certifications
- Bio content (from current site or intake)
- Languages spoken
- PersonSchema structured data
- SEO: provider name + practice name + city in title

#### Service pages
- Clear description of the service
- Benefits to the patient (not just features)
- What to expect / the process (only if sourced from the reference site or standard industry info)
- Related services with links
- Which locations offer this service (if not all)
- Which providers perform this service
- CTA to book/contact
- MedicalProcedure or Service structured data where appropriate
- SEO: service name + practice name + city in title

### 3. Handle Images for Each Page

For every page, follow image-sourcer agent guidelines:
- **Never hotlink** — all images must be saved locally in `public/images/`
- Download any additional images needed from the reference site
- Set explicit `width` and `height` on every `<img>` tag
- Use `loading="lazy"` on all images (only the homepage hero uses `eager`)
- Optimize formats: WebP/AVIF for photos, SVG for icons/logos
- Compress appropriately

### 4. Create Page-Specific Components

As needed for unique page layouts:
- Service cards
- Team member profiles
- Contact forms
- Gallery grids

### 5. Generate Redirects File

Create `public/_redirects` for Cloudflare Workers:

```
# Redirects from old pages
/old-page /  301
/legacy-service /services  301
/old-blog/* /  301
```

Format from `state.pages.redirects[]`:
```
{from} {to} 301
```

### 6. Run Playwright Tests

- All planned pages load (200 status)
- All internal links resolve
- Redirects work correctly
- Forms submit without JS errors
- Report failures but continue

### 7. Run SEO Auditor Agent

- Validate meta tags on all pages
- Check Open Graph tags
- Verify Lighthouse basics (Performance 80+, others 90+)
- Report issues found

### 8. Update State

```json
{
  "phase": "pages_pending_approval",
  "pages_generated_at": "[timestamp]",
  "pages": {
    "discovered": [...],
    "planned": ["/", "/about", "/services", "/contact"],
    "built": ["/", "/about", "/services", "/contact"],
    "redirects": [
      { "from": "/old-page", "to": "/" }
    ]
  },
  "test_results": { "passed": N, "failed": N },
  "seo_issues": [list]
}
```

### 9. Request Approval

Display to user:

```
All pages generated!

Pages built: [count]
  - / (Home) ✓
  - /about (About) ✓
  - /services (Services) ✓
  - /contact (Contact) ✓

Redirects created: [count]
  - /old-page → / (301)

Test results: [X passed, Y failed]
SEO audit: [issues or "all passed"]

Review at http://localhost:4321 (or correct port)
Say "approved" to finalize, or describe what needs to change.
```

## On Approval

When user approves:
1. Update state to `complete`
2. Confirm deployment instructions:

```
Site complete!

To deploy to Cloudflare Workers:
  npm run deploy

Or push to git for CI/CD deployment.

Files ready:
  - dist/ (built site)
  - public/_redirects (redirect rules)
```
