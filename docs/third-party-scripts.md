# Adding Third-Party Scripts

This project uses a Content Security Policy (CSP) in `public/_headers` and Astro's script processing. Both can block third-party scripts silently. Follow this guide when adding any external script.

## Two things that will break scripts

### 1. Astro script processing (CORS errors)

Astro processes `<script>` tags by default — it tries to bundle external scripts, which causes CORS failures. Any external script loaded via `src="https://..."` needs the `is:inline` directive.

```astro
<!-- WRONG — Astro will try to fetch/bundle this, causing CORS error -->
<script type="text/javascript" src="https://example.com/widget.js" async="true"></script>

<!-- CORRECT — is:inline tells Astro to emit the tag as-is -->
<script is:inline type="text/javascript" src="https://example.com/widget.js" async="true"></script>
```

Add scripts to `src/layouts/BaseLayout.astro` inside `<head>` so they load on every page.

### 2. Content Security Policy (CSP errors)

The CSP in `public/_headers` controls which external domains the browser will allow. If the console shows `violates the following Content Security Policy directive`, you need to add the domain to the right CSP directive.

**CSP directives and what they control:**

| Directive | What it covers | Example scripts that need it |
|-----------|---------------|------------------------------|
| `script-src` | JavaScript files | GA, GTM, BugHerd, Hotjar, Intercom |
| `style-src` | CSS / stylesheets | Fonts, widget styling |
| `connect-src` | XHR, fetch, WebSocket | Analytics beacons, real-time connections |
| `img-src` | Images | Tracking pixels, CDN images |
| `font-src` | Font files | Google Fonts, custom font CDNs |
| `frame-src` | iframes | Embedded forms, videos, chat widgets |

**How to find what domains to add:**

1. Add the script tag with `is:inline`
2. Open the site in Chrome, open DevTools Console
3. Look for CSP violation errors — they tell you exactly which directive and domain is blocked
4. Add each blocked domain to the correct directive in `public/_headers`
5. Repeat until clean — scripts often load sub-dependencies from other domains

**Tip:** Use wildcards (`https://*.example.com`) to cover subdomains. Many services use multiple subdomains (e.g., BugHerd uses `www.bugherd.com` and `sidebar.bugherd.com`).

## Common scripts and their CSP requirements

### Google Analytics / GTM
```
script-src: https://www.googletagmanager.com https://www.google-analytics.com
connect-src: https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com
```

### BugHerd
Script tag:
```astro
<script is:inline type="text/javascript" src="https://www.bugherd.com/sidebarv2.js?apikey=YOUR_KEY" async="true"></script>
```
CSP domains required:
```
script-src: https://*.bugherd.com
style-src:  https://*.bugherd.com
font-src:   https://*.bugherd.com
connect-src: https://*.bugherd.com https://*.bugsnag.com wss://*.pusher.com https://*.pusher.com
frame-src:  https://*.bugherd.com
```

### Hotjar
```
script-src: https://*.hotjar.com
connect-src: https://*.hotjar.com wss://*.hotjar.com
font-src: https://*.hotjar.com
```

### Intercom
```
script-src: https://*.intercom.io https://*.intercomcdn.com
connect-src: https://*.intercom.io wss://*.intercom.io https://*.intercomcdn.com
frame-src: https://*.intercom.io
```

## Checklist for adding a new script

1. Add `<script is:inline ...>` tag to `BaseLayout.astro` `<head>`
2. Update `public/_headers` CSP with the script's domains
3. Build and deploy
4. Check browser console for CSP errors
5. For each blocked domain, add to the appropriate directive in `public/_headers`
6. Repeat until no CSP errors remain
