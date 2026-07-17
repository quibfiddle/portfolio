---
name: project:test
description: Run Playwright tests and responsive checks across all pages.
disable-model-invocation: true
---

# Run Tests

## 1. Playwright Test Suite

```bash
npm run test
```

Report results:
- Total tests run
- Passed / Failed counts
- Details on any failures
- Suggest fixes for failing tests if patterns are clear

## 2. Responsive Spot-Check

After Playwright tests, verify responsive layouts by checking key pages at multiple breakpoints:

- **Mobile (375px)**: Homepage, one location page, one service page
- **Tablet (768px)**: Homepage, navigation behavior
- **Desktop (1280px)**: Homepage, full navigation

Flag any layout issues: horizontal scroll, overlapping elements, cut-off text, broken navigation.

## 3. Link Verification

- Scan all pages for internal links pointing to `/404`
- Verify all navigation links resolve to real pages
- Check that redirect URLs in `public/_redirects` are valid

Fix what you can automatically. Report anything that needs user input.
