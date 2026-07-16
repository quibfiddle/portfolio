# New Case Studies (not on old site)

Four case studies to add to the Work page alongside the six carried over from the old site (see `current-site-content.md`). These are source facts gathered from Stuart — the content-writer should draft them in the same voice as the existing project write-ups. Case study 4 is drafted from resume bullets only and should get Stuart's review before launch.

## Naming / attribution guidance

- Stuart was officially employed by **Charity Golf Today** but did work for ~14 companies through them, including **Dixon Golf** and several sister companies.
- Attribution is approved for both new Charity Golf Today-era case studies: name **Dixon Golf and their brands**.

---

## 1. AI-Powered Lead Analysis (Dixon Golf and their brands, current role)

Category: AI / Automation

**The problem:** The previous lead-scraping tool produced a lot of junk leads — sites could include random red-herring text and low-quality content that the old tool couldn't see through.

**What Stuart built:** An AI scraping tool, built with **Claude** (Anthropic), that takes existing website leads and analyzes them in ways the previous tool could not:
- Interacts with JavaScript buttons on lead pages to reveal additional hidden information
- Uses Claude's vision capabilities to look at images and extract text from them
- Analyzes the page/code with the model to quickly identify and throw out bad leads

**Result:** Increased relative (qualified) leads by about **40%**.

---

## 2. Legacy Platform Modernization (Dixon Golf & sister companies)

Category: IT / Web Development

**The problem:** An aging server ran critical infrastructure for Dixon Golf and several sister companies' websites, on end-of-life software versions.

**What Stuart did:**
- Migrated the database layer to a new, patched version of MySQL/MariaDB
- Updated or migrated all sites from PHP 7.x (some as old as 7.0) to **PHP 8.3**, moving some sites to a new server in the process

**Results (from resume):** Cut average page load times by up to **50%**; reduced some long-running queries from 24–30 seconds to sub-second — up to a **30x performance improvement**.

---

## 3. Git-Based Deployment Workflow — 13-Site Consolidation (Charity Golf Today)

Category: Web Development / DevOps

**The problem (before state):** Developers edited code directly on the production server over FTP/FileZilla. No source control across 13 legacy sites.

**What Stuart built:**
- Moved all code into separate Git repositories (one per site)
- Created webhooks that automatically deploy a repository to production on push
- Trained the developers — who were new to Git — on the common workflows they'd need day to day

**Result:** 13 legacy sites consolidated into standardized, version-controlled workflows; improved maintainability and deployment consistency (per resume). The team-enablement angle (walking non-Git developers through the transition) is part of the story — include it.

---

## 4. 30,000-Device Deployment Automation (TeamLogicIT)

Category: IT

**From resume (no additional detail gathered — draft from these bullets and mark for Stuart's review):**
- Automated deployments and managed tools for over 30,000 devices using VBScript and KML scripting
- Managed web applications for clients in healthcare and power generation sectors, achieving 99% uptime
- Provided advanced technical support for web applications and automation tools

Pairs with the existing 124,000-endpoint AVG→Bitdefender case study to strengthen the IT category.

---

## Held for later

Stuart has additional API projects he wants to add as case studies — info still being collected. Leave room in the Work page structure to add more later (don't hard-cap the layout at 10 projects).
