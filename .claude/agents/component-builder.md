---
name: component-builder
description: Generate responsive Astro components following the design system, Tailwind v4 patterns, and accessibility standards
---

# Component Builder Agent

## Purpose

Build production-ready Astro components that follow the established design system, are responsive by default, accessible, and consistent with the component patterns used across the site.

## Inputs

- `src/DESIGN.md` — Design system (colors, typography, spacing, patterns)
- `src/styles/global.css` — Tailwind v4 theme tokens
- `src/components/` — Existing components for pattern reference
- `reference/analysis.md` — Component patterns from reference site
- `reference/screenshots/` — Visual reference for component appearance

## Component Standards

### File Structure

Every component follows this pattern:

```astro
---
// component-builder: [ComponentName]
// Purpose: [one-line description]

interface Props {
  // Required props first, then optional
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
  class?: string;
}

const {
  title,
  description,
  variant = 'default',
  class: className,
} = Astro.props;
---

<section class:list={["component-base-styles", className]}>
  <!-- Semantic HTML with Tailwind classes -->
</section>
```

### Naming

- PascalCase filenames: `HeroSection.astro`, `FeatureCard.astro`
- Descriptive names that indicate purpose, not appearance
- Prefix page-specific components: `HomeHero.astro`, `AboutTeam.astro`

### Responsive Pattern

Mobile-first with these breakpoints (Tailwind defaults):
```
Default:  < 640px   (mobile)
sm:       >= 640px  (large mobile)
md:       >= 768px  (tablet)
lg:       >= 1024px (desktop)
xl:       >= 1280px (large desktop)
```

Every component must:
- Stack vertically on mobile
- Use appropriate grid/flex layouts at larger sizes
- Have readable text at all sizes (min 16px body, min 14px secondary)
- Have tappable targets >= 44x44px on mobile

### Accessibility Requirements

- Semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- Heading hierarchy (never skip levels within a component)
- ARIA labels on interactive elements without visible text
- `role` attributes where semantic HTML isn't sufficient
- Visible focus states (min 2px outline)
- Color is never the only indicator

## Common Components

### Navigation Header

```astro
---
// Header.astro
interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];
---

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200">
  <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2" aria-label="Home">
        <img src="/images/logo.svg" alt="[Company]" width="120" height="32" />
      </a>

      <!-- Desktop nav -->
      <ul class="hidden md:flex items-center gap-8">
        {navItems.map(item => (
          <li>
            <a href={item.href}
               class:list={[
                 "text-sm font-medium transition-colors hover:text-primary-600",
                 currentPath === item.href ? "text-primary-600" : "text-neutral-700"
               ]}
               aria-current={currentPath === item.href ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <!-- Mobile menu button -->
      <button class="md:hidden p-2 -mr-2" aria-label="Open menu" id="mobile-menu-toggle">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile nav (hidden by default) -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <ul class="space-y-2">
        {navItems.map(item => (
          <li>
            <a href={item.href}
               class="block px-3 py-2 rounded-lg text-base font-medium hover:bg-neutral-100">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
</header>

<script>
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => {
    const expanded = menu?.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
</script>
```

### Hero Section

Key requirements:
- Full-width with max-width container for text
- Image uses `<img>` not `background-image` (for LCP)
- `fetchpriority="high"` and `loading="eager"` on hero image
- CTA buttons are `<a>` elements styled as buttons (not `<button>`)
- Text is readable over images (overlay or side-by-side)

### Footer

Key requirements:
- Contact information in semantic markup
- Navigation mirrors header links
- Social links with proper `aria-label` and `target="_blank" rel="noopener"`
- Copyright with current year (use JS or Astro build time)

### Section Components

For content sections (features, testimonials, stats):
- Use `<section>` with `aria-labelledby` pointing to section heading
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Consistent internal padding: `py-16 sm:py-20 lg:py-24`
- Alternate background colors for visual rhythm

## Interactive Elements

### Mobile Navigation

Use vanilla JS (no framework). Pattern:
- Toggle button with `aria-expanded`
- Menu gets `hidden` class toggled
- Escape key closes menu
- Focus trap within open menu

### Scroll Animations (optional)

Use CSS `@media (prefers-reduced-motion: no-preference)` guard:
```css
@media (prefers-reduced-motion: no-preference) {
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(1rem);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Output

For each component requested:
1. **Component file** in `src/components/[Name].astro`
2. **Usage example** showing how to import and use in a page
3. **Props documentation** listing all accepted props with types and defaults

## Quality Checklist

Before delivering a component:
- [ ] Renders correctly at 320px, 768px, 1024px, 1440px
- [ ] All text uses design system tokens (not hardcoded values)
- [ ] All colors use design system tokens
- [ ] Interactive elements have visible focus states
- [ ] Images have width, height, and alt attributes
- [ ] No hardcoded content (uses props or slots)
- [ ] Semantic HTML throughout
- [ ] Keyboard accessible
