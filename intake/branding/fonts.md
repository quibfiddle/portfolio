# Brand Typography

Client requested the Ubuntu font family (https://fonts.google.com/specimen/Ubuntu) — pairs with the Ubuntu brand color palette.

## Font Families

### Display Font (Headings)
**Font:** Ubuntu
**Weights:** 500 (Medium), 700 (Bold)
**Google Fonts URL:** https://fonts.googleapis.com/css2?family=Ubuntu:wght@500;700&display=swap

### Body Font (Text)
**Font:** Ubuntu
**Weights:** 400 (Regular), 500 (Medium)
**Google Fonts URL:** https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=swap

### Monospace Accent (code snippets, technical flourishes)
**Font:** Ubuntu Mono
**Weights:** 400 (Regular), 700 (Bold)
**Google Fonts URL:** https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap
- Use for: code-styled elements (e.g., a `profile object` hero treatment like the reference site), skill tags, terminal-flavored accents. Fits the developer/IT audience and the "little bit of fun" voice.

## Combined Load (single request)

https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono:wght@400;700&display=swap

## Font Loading Strategy

Fonts are loaded via Google Fonts with `display=swap` to prevent layout shift.
Fallback stack: system-ui, -apple-system, sans-serif (Ubuntu Mono falls back to ui-monospace, monospace).
