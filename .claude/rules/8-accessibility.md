---
paths:
  - **/*.vue
---

# Accessibility

## Compliance

Must be RGAA compliant (https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)

## HTML components

- Use semantic HTML whenever possible
- Don't use tabindex > 0
- don't override DSFR components
- Use `aria-label` or `aria-labelledby` on every interactive element without visible text
- Use `aria-live="polite"` on dynamic content areas
