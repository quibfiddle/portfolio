# Site Build Process

A guide for PMs, strategists, developers, and site builders on how we build websites using this template and Claude Code.

---

## How This Works

Claude Code does the heavy lifting — writing code, generating components, building pages. Your job is to provide clear direction, review the output, and make sure the final product matches client expectations. You don't need to know how to write Astro or Tailwind. You need to know what good looks like and how to tell Claude what to change.

This document describes our process in phases. **Not every project follows every phase exactly.** Some projects are a near-copy of an existing site. Some are built from scratch with only a logo and a color palette. Some merge five sites into one. The phases below are the ideal flow — adapt them to what the project actually needs. What matters is the *intent* of each phase, not rigid adherence to every step.

---

## Phase 0: Intake

### Purpose

Give Claude (and the team) enough context to build the right thing. The more complete the intake, the better the first output. Bad intake = more revision cycles.

### Who Does This

The PM or strategist gathers information from the client. The developer (or whoever is running the build) puts that information into the intake files. You can do this by editing the files directly, or by telling Claude what you know and asking it to update the intake files for you.

### What Goes in Intake

The `intake/` folder has template files. Fill in as much as you can:

| File | What It Covers | Required? |
|------|---------------|-----------|
| `intake/INTAKE.md` | Business info, audience, goals, brand voice, technical needs | Yes — at minimum, what the site should do and who it's for |
| `intake/sitemap.md` | Pages to build, hierarchy, navigation structure | Strongly recommended |
| `intake/branding/colors.md` | Brand colors (hex values, usage notes) | If available |
| `intake/branding/fonts.md` | Font families, weights, where to use them | If available |
| `intake/images/` | Logo files, hero images, team photos, any visual assets | If available |

**You can also put reference materials in `intake/`** — Google Docs links, PDFs, competitor URLs, mood boards, screenshots. Anything that helps Claude understand what the client wants.

### The Intake Conversation

Once you've put what you have into the intake files, tell Claude to review them. Claude will look at what's there, identify gaps, and ask you about anything critical that's missing. This isn't a 20-question interview — if the files are thorough, Claude might only have one or two questions. If the files are sparse, expect more.

Example:

```
I've filled out the intake files. Review them and let me know
what's missing or unclear before we start the build.
```

### Reference Sites

**Every project should have at least one reference.** This could be:

- The client's current website (most common — we're rebuilding/improving it)
- A competitor's site the client admires
- A design reference for visual direction
- Multiple sites if we're merging or drawing from several sources

Put the primary reference URL in `INTAKE.md`. If there are multiple references, note what each one is for (e.g., "use this site's layout but that site's color approach").

### Content Direction

Tell Claude what to do with content. This matters a lot for the quality of the first draft. Examples:

- "Pull all content from the existing site and reuse it as-is"
- "Use the existing site's content but tighten up the copy and strengthen CTAs"
- "Rewrite everything in a warmer, more approachable tone"
- "Here's a Google Doc with all the approved copy — use this exactly"
- "The client has no copy yet — generate it based on what we know about the business"

### Redirects

If the new site is replacing an existing one, think about redirects early. Pages that exist on the old site but won't exist on the new one need to redirect somewhere. Note any known redirect needs in the intake. Claude will also discover pages during the crawl phase and flag ones that need redirect decisions.

### Sitemap

Define the pages you want built. You can:

- List them explicitly in `intake/sitemap.md`
- Say `BUILD_ALL` and let Claude discover pages from the reference site
- Start with a rough list and refine after the crawl

The sitemap drives everything downstream — which pages get built, what the navigation looks like, and what redirects are needed.

---

## Phase 1: Site Analysis

### Purpose

Crawl the reference site(s) to extract everything Claude needs to build: design values, content, page structure, and screenshots. This is the foundation for the design system and all page generation.

### What Happens

Claude will:

1. **Crawl the reference URL** to discover all pages (up to 100)
2. **Take screenshots** of key pages for visual reference
3. **Extract the actual text content** from the homepage — every heading, paragraph, CTA, testimonial, stat
4. **Extract design values** — colors, fonts, spacing, section ordering
5. **Download images locally** — pull usable images (hero photos, team shots, logos) into `public/images/`
6. **Write `reference/analysis.md`** with all findings
7. **Reconcile with the sitemap** — compare discovered pages against planned pages, flag gaps

**Important: Never hotlink images.** All images must be downloaded and saved locally to `public/images/`. Never reference images by pointing to the old site's URLs. The old site may go down, change paths, or block requests from other domains.

### What You Should Review

After the crawl, glance at `reference/analysis.md` to make sure:

- The discovered pages make sense (nothing important was missed)
- The extracted colors and fonts look right
- The homepage content was captured accurately
- The section ordering reflects what's actually on the reference site

If intake has branding files (`colors.md`, `fonts.md`), those take priority over whatever Claude extracted from the reference site.

### Why This Matters

Everything downstream — the design system, the homepage, the page generation — builds on this analysis. If the analysis is wrong, the output will be wrong. A quick review here saves hours of corrections later.

---

## Phase 2: Design System

### Purpose

Turn the brand values (colors, fonts, spacing) into a complete design system that Claude will use consistently across every page. This ensures visual consistency without you having to specify colors and fonts on every component.

### What Happens

Claude will:

1. **Generate color palettes** — takes the brand colors and creates full shade ranges (50-950), semantic tokens (background, foreground, muted, border, etc.), and verifies contrast ratios meet accessibility standards (WCAG 2.2 AA)
2. **Set up typography** — font loading, a responsive type scale, heading hierarchy
3. **Define spacing and patterns** — section spacing, container widths, button styles
4. **Document everything** in `src/DESIGN.md`

### What You Should Know

You generally don't need to review the design system in detail. It's a technical layer. If the colors or fonts look wrong once you see the homepage, that's when you flag it — and Claude will trace the fix back to the design system.

---

## Phase 3: Homepage

### Purpose

The homepage is the most important deliverable. It establishes the design direction for the entire site and is what we present to the client for initial approval. Getting this right before moving on saves significant rework.

### What Happens

Claude builds:

- Base layout (header, footer, page structure)
- All homepage sections following the reference site's ordering (but optimized for conversion)
- Responsive design across mobile, tablet, and desktop
- Content based on the direction from intake

**Note:** Internal navigation links to pages that haven't been built yet will point to `/404`. This is expected — only the homepage exists at this point.

### Your Role: Dev Review & Iteration

Once the homepage is generated, **you review it in the browser** (`npm run dev` starts the local server at localhost:4321). This is a hands-on review — look at it on desktop and mobile, read through the content, check that it feels right.

Then iterate with Claude:

- "The hero headline is too generic — make it more specific to their dental practice"
- "The spacing between sections feels too tight on mobile"
- "Try five different versions of the testimonials section"
- "The colors feel off — the blue should be darker and more muted"
- "Move the stats section above the testimonials"

This back-and-forth is normal and expected. The goal is to get the homepage to a state where you're confident presenting it to the client.

### Tips for Good Feedback

- Be specific. "This doesn't look right" is hard to act on. "The card grid should be 3 columns on desktop, not 2" is easy.
- Reference the screenshot or section name so Claude knows exactly what you're talking about.
- If you want to explore options, ask for multiple versions of a section.
- If something is close but not quite, say what's working and what isn't.

### Content Quality Check

Watch for AI-generated content patterns:

- Em dashes everywhere — Claude loves these. Remove them.
- Overly polished, generic-sounding copy ("Unlock your potential", "Elevate your experience")
- Claims that aren't real (made-up stats, fabricated testimonials). If the reference site had real testimonials and stats, make sure Claude used the actual ones.

### Client Presentation

Once you're satisfied, the homepage goes to the client for review. Client feedback comes in through BugHerd (see Phase 5).

---

## Phase 4: Generate Remaining Pages

### Purpose

Build out all the pages defined in the sitemap. The design system and patterns established in the homepage carry forward, so these pages should be stylistically consistent without much intervention.

### What Happens

Claude builds each page from the sitemap that isn't already built. This includes:

- Interior pages (About, Services, Contact, etc.)
- Any page-specific components or layouts
- Navigation links updated to point to real pages instead of `/404`
- Redirects for any discovered pages that aren't in the sitemap (`public/_redirects`)

### Content Accuracy

**Do not fabricate or assume business information.** Never change hours, addresses, or contact info unless explicitly told to. Never add services the business doesn't offer. Never fabricate testimonials, stats, or credentials. If information is missing, leave a placeholder or ask — don't make it up. Standard industry information (e.g., "what to expect during a dental cleaning") is okay but should be general, not presented as the practice's specific process.

### Page Type Requirements

**Location pages** should be locally SEO optimized:
- City/area name in title, meta description, and headings
- Full address, phone, hours (including Saturday/special hours)
- List of services offered at this location
- Providers/doctors who work at this location
- Insurance accepted
- LocalBusiness structured data (JSON-LD)
- Unique content per location — don't duplicate text across locations

**Provider/doctor pages** should include:
- Name, credentials (DDS, DMD, etc.), title, headshot
- Locations they work at and services they provide
- Education, affiliations, certifications
- Bio content and languages spoken
- PersonSchema structured data

**Service pages** should include:
- Clear description and patient benefits
- What to expect (only if sourced from reference site or standard industry info)
- Related services, which locations/providers offer it
- CTA to book or contact
- Service/MedicalProcedure structured data

### Your Role

Review each page in the browser using the template approach — perfect one location page, one provider page, one service page, then apply to the rest. Look for:

- Content accuracy — especially if Claude generated copy rather than pulling from a source
- Layout issues — sections that look odd, images that don't fit
- Navigation — all links work, header/footer are consistent
- Mobile — quick check that nothing breaks at small screens

---

## Phase 5: Client Review (BugHerd)

### Purpose

The client reviews the entire site and submits feedback. We use BugHerd so feedback is tied to specific elements on specific pages, which makes it actionable.

### Setup

Deploy the site to Cloudflare Workers with:

- **BugHerd script installed** — so the client can submit visual feedback
- **`noindex` meta tag** — so search engines don't index the staging version

The client gets a URL to review. They click on elements, leave comments, and BugHerd captures screenshots and browser context automatically.

### Processing Feedback

BugHerd feedback gets processed in batch, not one ticket at a time:

1. **PM reviews BugHerd tickets first** — confirms each ticket is clear, actionable, and ready for dev. Some tickets might need clarification from the client before they're dev-ready. Claude can help flag which tickets aren't clear enough to act on.
2. **Claude processes all dev-ready tickets at once** — using the BugHerd skill, Claude reads through the feedback, makes the fixes, and presents them for your review.
3. **You review Claude's fixes** before they go live — make sure the changes match what was requested.

Depending on the project, there may be multiple rounds of BugHerd feedback. The flow is the same each time: client submits feedback, PM triages, Claude fixes, you review.

---

## Phase 6: Pre-Launch

### Purpose

Make sure everything is production-ready before the site goes live. This is the checklist phase — systematic, thorough, nothing creative.

### Checklist

**Performance & Optimization**
- [ ] No hotlinked images (all saved locally in public/images/, none pointing to external URLs)
- [ ] Images in the right format (WebP/AVIF for photos, SVG for icons/logos, PNG only if transparency needed)
- [ ] Images sized appropriately (no oversized originals served at smaller display sizes)
- [ ] Images compressed (reasonable file size without visible quality loss)
- [ ] All `<img>` tags have explicit width and height attributes (prevents layout shift)
- [ ] Hero image uses `loading="eager"` and `fetchpriority="high"`; all others use `loading="lazy"`
- [ ] Page speed review — run Lighthouse or similar, address major issues
- [ ] Build completes cleanly (`npm run build`)

**SEO & Metadata**
- [ ] Page titles and meta descriptions on every page
- [ ] Open Graph tags (og:title, og:description, og:image) for social sharing
- [ ] Structured data / JSON-LD schema (Organization, LocalBusiness, FAQs as appropriate)
- [ ] `sitemap.xml` generated (Astro can do this — make sure it's configured)
- [ ] `robots.txt` allows indexing
- [ ] Canonical URLs set

**Accessibility**
- [ ] Color contrast passes WCAG 2.2 AA
- [ ] All images have alt text
- [ ] Heading hierarchy is logical (h1 > h2 > h3, no skipped levels)
- [ ] Interactive elements are keyboard accessible
- [ ] Forms have proper labels

**Scripts & Tracking**
- [ ] Google Tag Manager (GTM) or Google Analytics (GA) installed
- [ ] Check the existing live site's `<head>` for any scripts that need to carry over (chat widgets, tracking pixels, remarketing tags, heatmaps, etc.)
- [ ] BugHerd script **removed**
- [ ] `noindex` meta tag **removed**

**Responsiveness**
- [ ] Review at mobile (375px), tablet (768px), and desktop (1280px+)
- [ ] No horizontal scroll, no overlapping elements, no cut-off text

**Functionality**
- [ ] All navigation links work (no remaining `/404` links)
- [ ] Forms submit correctly (contact forms, newsletter signups)
- [ ] Any integrations tested (CRM, email service, etc.)
- [ ] Console errors reviewed — fix what you can

**Redirects**
- [ ] `public/_redirects` includes all necessary redirects from old pages
- [ ] Test redirect URLs to confirm they work

### How Claude Can Help

You can ask Claude to run through many of these checks:

- "Run an accessibility review on all pages"
- "Check all pages for SEO issues"
- "Optimize all images"
- "Review the site for any remaining /404 links"
- "Check the existing site at [URL] for scripts in the head that we need to add"

Claude won't catch everything (especially visual/subjective issues), but it handles the systematic checks well.

---

## Phase 7: Launch

### Purpose

Flip the site live. Remove staging artifacts, confirm everything is indexed and tracked, and deploy to the production domain.

### Steps

1. **Final build** — `npm run build` one more time to make sure everything is clean
2. **Confirm removals:**
   - BugHerd script is gone
   - `noindex` is gone
   - Any test/staging content is removed
3. **Confirm additions:**
   - GTM/GA is installed and firing
   - All scripts from the old site are carried over
   - `sitemap.xml` is accessible
   - `robots.txt` allows crawling
4. **Deploy** — push to production on Cloudflare Workers
5. **DNS** — this varies by project and is handled separately (not covered in this doc)
6. **Verify post-deploy:**
   - Site loads on the production domain
   - SSL certificate is active
   - Redirects work
   - Forms work
   - Analytics are receiving data

---

## Phase 8: Post-Launch

### Purpose

Confirm the site is healthy and set up ongoing monitoring.

### Steps

- [ ] Add the site to **Baseline** (our internal monitoring tool)
- [ ] Do a quick review of the live site — sometimes things behave differently in production
- [ ] Confirm analytics data is flowing (give it 24 hours, then check)
- [ ] If there are issues, address them promptly — the first few days after launch are when clients are paying the most attention

### Ongoing

We host and maintain the site. The client does not typically edit content directly — changes go through our team.

---

## Quick Reference: Common Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start the local dev server (localhost:4321) |
| `npm run build` | Build the site for production |
| `npm run test` | Run Playwright tests |
| `npm run deploy` | Deploy to Cloudflare Workers |

---

## Quick Reference: Project Structure

```
intake/               Client inputs — brand info, content, images, sitemap
  INTAKE.md           Business info, goals, audience, references
  sitemap.md          Pages to build
  branding/           Colors, fonts
  images/             Logo, photos, visual assets

reference/            Output from site analysis
  analysis.md         Crawl results, design values, extracted content
  screenshots/        Visual reference from the reference site

src/                  The actual website source code
  components/         Reusable UI pieces (Header, Footer, sections)
  layouts/            Page templates
  pages/              Route pages (index.astro, about.astro, etc.)
  styles/             CSS and design tokens
  DESIGN.md           Design system documentation

public/               Static files served as-is
  images/             Site images
  _redirects          Redirect rules for Cloudflare Workers

.site-factory/        Build state tracking
  state.json          Current phase, page inventory, progress

.claude/              Claude Code configuration
  agents/             Agent instructions for each build phase
```

---

## What This Process Can and Can't Do

**Works well for:**
- Marketing websites and landing pages
- Service business sites (dental, law, consulting, etc.)
- Rebuilds/redesigns of existing sites
- Multi-site consolidations
- Content-heavy sites with mostly static pages

**May need additional planning for:**
- E-commerce or complex transactional flows
- Sites with custom web applications or portals
- Heavy animation or interactive experiences
- Sites requiring CMS integration for client self-service
- Multi-language / internationalization

If a project falls into the second category, it doesn't mean you can't use this process — it means you should flag it early so the team can plan for the additional complexity.
