# Project Intake

## Business Information

**Business Name:** Stuart Bingham
**Tagline:** Full-stack developer & IT professional — 10+ years building, automating, and modernizing web platforms
**Industry:** Technology / Software Development (personal portfolio for job seeking)

## Target Audience

**Primary audience:** Hiring managers, recruiters, and technical leads evaluating Stuart for software developer, automation developer, and IT infrastructure roles
**What action should visitors take?** Contact Stuart (email/phone) and download his resume

## Reference Sites

**Primary reference:** https://thanhtran-portfolio.vercel.app/
**Additional inspiration:** https://stuartbingham.net/ (current site — carry over its content; extracted to `intake/current-site-content.md`)

## Brand Voice

**Tone:** Professional with a little bit of fun — confident, technically credible, approachable. Think Ubuntu/Canonical brand energy: polished but human.
**Key messages:**
- 10+ years of experience spanning full-stack development, automation, and IT infrastructure
- Proven modernizer: legacy PHP migrations with up to 50% faster page loads and 30x query performance improvements
- Builder of real tools: 22 custom automation/analysis tools (UiPath, TypeScript), 4 custom APIs, AI-based lead generation systems
- Operates at scale: 14 client companies currently, 30,000–124,000+ managed devices in past roles
- Versatile: equally strong as a developer (JavaScript/TypeScript, PHP, Python, React, AWS) and as an IT/systems professional (deployments, endpoint security, server migrations)

## Content Sources

**Existing content:**

Current-site content extracted to `intake/current-site-content.md` — carry over as needed. Includes hero tagline, About Me bio, two project case studies (Sounds True e-learning migration, DHS document cataloging with UiPath/computer vision), certifications (UiPath Advanced Developer, VMware Airwatch, Microsoft MTA), and CTA copy. Where the site conflicts with the resumes (location, latest role), the resumes win.

Four NEW case studies (not on the old site) with gathered facts in `intake/new-case-studies.md`: Claude-powered lead analysis for Dixon Golf and their brands (+40% qualified leads), Dixon Golf platform modernization (PHP 7.x→8.3, MySQL/MariaDB, 50% faster / 30x queries), Git-based 13-site deployment workflow, and 30,000-device deployment automation (resume bullets only — needs Stuart's review). More API case studies may come later — keep the Work page layout extensible.

Two resume versions in `intake/resumes/`:
- `Stuart_Bingham_Resume-developer.pdf` — framed as full-stack developer (10+ yrs web apps, RESTful APIs, automation tooling)
- `Stuart_Bingham_Resume-IT.pdf` — framed as IT professional (systems administration, infrastructure, 100,000+ managed devices)
The site should present Stuart's dual strengths (development + IT/infrastructure) rather than picking one framing.

**Contact details:** Chandler, AZ | (480) 498-8273 | bingham.stuart@gmail.com

**Career history (from resumes):**
- Charity Golf Today — Software Developer (Oct 2024–Present), Chandler, AZ
- Proveo Automation — Lead Developer, Automation & API Development (Dec 2019–Sep 2024), Remote
- TeamLogicIT — Automation Developer & Web Application Support (May 2017–Oct 2019), Phoenix, AZ
- Allcovered, Konica Minolta Business Solutions — Service Design and Transition Engineer (Nov 2014–Mar 2017), Phoenix, AZ
- McDermit Consulting — Onsite and Remote Support Engineer (Mar–Oct 2014)
- Mytek Network Solutions — Remote Support Analyst & NOC Analyst (Jan 2013–Nov 2013)
- Northland Pioneer College — IT Department Intern (Jan–May 2010)

**Technical skills (from resumes):**
- Languages: JavaScript, TypeScript, PHP, Python, VBScript, XML, SQL
- Frameworks & Technologies: React, Serverless, NestJS Microservices, PostgreSQL, MySQL, DynamoDB, AWS (CloudFormation, Lambda, S3, EC2), Azure (Function Apps, DevOps)
- Tools: UiPath, Docker, Git, NPM, RESTful APIs, Microsoft IIS, Power Automate, Auth0
- Development Practices: Agile, Code Reviews, Clean Architecture, CI/CD

**Content to generate:** Homepage hero + summary, About page bio, Work/Experience page copy (expanded from resume bullets into readable case-study-style entries), skills presentation, contact page copy, and meta/SEO copy. Write in the brand voice above.

## Design Directives

- **Hero code card:** The reference site uses a macOS-window code card (`const developer = {...}`). Build it **Ubuntu-style instead**: Ubuntu terminal window chrome (Yaru-style titlebar with round window controls, not macOS traffic lights), classic Ubuntu terminal dark-aubergine background (#300a24), Ubuntu Mono type, and a `stuart@stuartbingham:~$` style prompt. Content can stay in the `const developer = {...}` / terminal-output spirit.
- Lean into the Ubuntu identity throughout: palette in `branding/colors.md`, Ubuntu + Ubuntu Mono fonts, terminal/CLI-flavored accents.

## Technical Requirements

**Forms:** Contact form on /contact/ (plus direct email/phone links)
**Integrations:** None required at launch
**Special features:**
- Resume button downloads a PDF — use the **developer version** (`intake/resumes/Stuart_Bingham_Resume-developer.pdf`, serve as `/Stuart-Bingham-Resume.pdf`). The IT version is held in reserve; not linked on the site for now.
- Link to LinkedIn: https://www.linkedin.com/in/stuart-bingham-6267356a/ (no GitHub link)
- No blog or interactive labs at launch (the reference site has these; skip for v1)
