---
name: project:launch
description: Prepare the site for production launch. Removes staging artifacts, verifies everything is ready, builds, and deploys.
disable-model-invocation: true
---

# Launch Preparation

Prepare the site for production launch. Remove staging artifacts, verify all launch requirements, build, and deploy.

## Steps

### 1. Remove Staging Artifacts

- **Remove BugHerd script** — search all layouts and pages for BugHerd `<script>` tags and remove them. Confirm removal.
- **Remove `noindex`** — find and remove any `<meta name="robots" content="noindex">` or `noindex, nofollow` tags. Replace with `<meta name="robots" content="index, follow">` or remove entirely.

### 2. Verify Scripts & Tracking

**Important:** Read `docs/third-party-scripts.md` before adding any scripts. All external scripts require:
- `is:inline` directive on the `<script>` tag (Astro will CORS-fail without it)
- CSP entries in `public/_headers` for the script's domains

Checks:
- **GTM/GA** — check if installed. If not, report: "GTM/GA not found. Provide your GTM container ID (GTM-XXXXXX) or GA measurement ID (G-XXXXXX) to install." When adding, use the CSP entries from `docs/third-party-scripts.md`.
- **Reference site scripts** — check the reference site's `<head>` for scripts that should carry over. Report any found with: "The reference site has [script]. Is this needed on the new site?"
- **Verify all external `<script>` tags use `is:inline`**
- **Verify `public/_headers` CSP includes domains for all installed scripts**
- **Verify all scripts from old site are accounted for** — either installed or explicitly declined.

### 3. Verify SEO Readiness

- `sitemap.xml` exists and is accessible
- `robots.txt` allows crawling (no disallow on important paths)
- All pages have unique `<title>` and `<meta name="description">`
- Open Graph tags present on all pages
- Structured data / JSON-LD is valid

### 4. Verify Functionality

- All navigation links work (no `/404` references remaining)
- Forms submit correctly
- Redirects in `public/_redirects` are present and properly formatted
- Console has no critical errors

### 5. Build

```bash
npm run build
```

Confirm the build completes cleanly with no errors.

### 6. Deploy

```bash
npm run deploy
```

Deploy to Cloudflare Workers. After deployment:
- Verify the site loads on the production URL
- Verify SSL certificate is active (HTTPS works)
- Spot-check a few redirects to confirm they work
- Spot-check a form submission

### 7. Report

```
Launch Report
=============

✅ READY
  - BugHerd removed
  - noindex removed
  - GTM/GA installed
  - sitemap.xml accessible
  - robots.txt allows crawling
  - Build clean
  - Deployed successfully
  - SSL active
  - [X] redirects working

⚠️ NEEDS ATTENTION
  - [anything that couldn't be verified or needs follow-up]

❌ NEEDS HUMAN INPUT
  - [anything that requires information or a decision]
  - Example: "DNS not yet pointed to Cloudflare. Coordinate with client."
  - Example: "GA measurement ID needed to complete analytics setup."

🚀 Site is live at: [production URL]

Post-launch:
  - Add to Baseline monitoring
  - Verify analytics data flowing in 24 hours
```

## Notes

- DNS setup is handled separately and may require coordination with the client
- If GTM/GA credentials aren't available, deploy without them and flag for follow-up
- The site should be fully functional before DNS cutover
