---
name: project:intake
description: Process intake materials, discover all pages from reference site, and reconcile with sitemap. Run this first.
disable-model-invocation: true
---

# Process Intake Materials

## Prerequisites Check

1. Verify required files exist:
   - `intake/sitemap.md` (REQUIRED)
   - `intake/INTAKE.md` (REQUIRED)

2. If missing, stop and tell the user what's needed.

## Process Steps

### 1. Update Project Config

Using the business name and domain from INTAKE.md, update these files:

- **`package.json`** — set `"name"` to the project slug (e.g., `"scarsdale-dental"`)
- **`wrangler.jsonc`** — set `"name"` to the same project slug (this becomes the Cloudflare Workers name)
- **`astro.config.mjs`** — set `site` to the production domain (e.g., `'https://www.scarsdaledentistry.com'`)
- **`src/pages/privacy.astro`** — replace `contact@example.com` with the real contact email

### 2. Read Intake Materials

- Parse sitemap.md to understand page scope
- Read INTAKE.md for project context and reference URL
- Scan branding/, content/, images/ for available assets

### 3. Run Site Analyzer Agent

If reference URL provided in INTAKE.md:
- **Crawl the entire reference site** to discover all pages
- Capture screenshots of key pages
- Analyze design patterns
- Update state.json with `pages.discovered[]`

### 4. Parse Sitemap Intent

sitemap.md can specify pages in two ways:

**Option A: Specific pages**
```markdown
- Home (/)
- About (/about)
- Services (/services)
- Contact (/contact)
```

**Option B: Build all discovered pages**
```markdown
# Sitemap

BUILD_ALL

Exclude:
- /wp-admin/*
- /old-*
```

If `BUILD_ALL`:
- Use all discovered pages as the plan
- Apply any exclude patterns
- Set `pages.planned` = filtered `pages.discovered`

If specific pages:
- Use sitemap list as the plan
- Set `pages.planned` = sitemap entries

### 5. Reconcile Pages

Compare discovered vs planned to identify:

| Discovered | Planned | Action |
|------------|---------|--------|
| Yes | Yes | Build this page |
| Yes | No | Create redirect or ignore |
| No | Yes | New page (no reference) |

**For pages discovered but NOT planned:**
- Ask user: "Found X pages not in sitemap. Should I create redirects?"
- If yes, add to `pages.redirects[]`
- Common redirect patterns:
  - `/old-page` → `/` (redirect to home)
  - `/services/old-service` → `/services` (redirect to parent)

### 6. Download and Copy Images

- Copy intake/images/* to public/images/ (preserve folder structure)
- **Download images from the reference site** (hero photos, team shots, office photos, logos) and save to public/images/
- **Never hotlink** — all images must be saved locally. The old site may go down or change paths after launch.
- Optimize downloaded images: use WebP/AVIF for photos, SVG for icons/logos, PNG only when transparency needed
- Resize to appropriate dimensions (hero max 1920px wide, content max 1200px, thumbnails max 600px)

### 7. Update State

```json
{
  "phase": "intake_complete",
  "intake_processed_at": "[timestamp]",
  "pages": {
    "discovered": [
      { "path": "/", "title": "Home", "in_nav": true },
      { "path": "/about", "title": "About Us", "in_nav": true },
      { "path": "/old-page", "title": "Old Page", "in_nav": false }
    ],
    "planned": ["/", "/about", "/services", "/contact"],
    "built": [],
    "redirects": [
      { "from": "/old-page", "to": "/" }
    ]
  }
}
```

### 8. Report Summary

Display to user:

```
Intake Complete!

Reference site: [URL]
Pages discovered: [count]
Pages to build: [count]
Redirects to create: [count]

Planned pages:
  - / (Home)
  - /about (About Us)
  - /services (Services)
  - /contact (Contact)

Redirects:
  - /old-page → /
  - /legacy-service → /services

Content gaps:
  - /services needs copy (no intake/content/services.md)

Ready for /project:homepage
```

## Notes

- The reconciliation step is crucial for SEO - ensures no 404s from old links
- Redirects are generated as `public/_redirects` (Cloudflare Workers format)
- State tracks everything for session recovery
