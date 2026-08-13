---
paths:
  - ./**/*.vue
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

## Lists

- Use semantic `<ul>` / `<ol>` + `<li>` for any repeated group of items — screen readers announce list length and let users skip ahead
- Apply `class="fr-raw-list"` (DSFR utility) on the `<ul>` / `<ol>` to remove bullet styling when a visual list marker is unwanted
- Never use bare `<div>` loops with `v-for` when the items form a list — wrap them in `<ul>` + `<li>`
- For description-style pairs (label + value), `<dl>` / `<dt>` / `<dd>` is acceptable as an alternative

## Headings

- Maintain a strict heading hierarchy — never skip levels (e.g. `<h2>` → `<h4>`)
- Use heading tags (`<h1>`–`<h6>`) for section titles, not `<p class="fr-text--bold">` — screen readers rely on headings for page navigation
- In content components rendered inside `BeneficiaryInfoSection` (which uses `aria-level="4"`), sub-section titles should use `<h5>`
- Apply DSFR typographic classes (`fr-h5`, `fr-h6`, etc.) to control visual size independently of the semantic level when needed

## Focus management on dynamically revealed form fields

- When:
  - a button adds a new entry via `useFieldArray.push()`
  - a button reveals a field via `v-if`
- How to manage focus:
  - Add the `v-autofocus` directive to the sub-component or the revealed element so keyboard focus moves to its first focusable child on mount.

Notes:

- Place `v-autofocus` inside the sub-component, not at the call site in the parent.
- The directive's default selector covers `input`, `select`, `textarea`, and `[tabindex]`.
- Never use manual DOM focus calls (`querySelector` + `.focus()`) inside the parent component's click handler.

## Automatic testing

- End to end playwright tests for a11y validation with Axe plugin tool
- Test files in folder /e2e/\*
- Run E2E tests via `pnpm test:e2e`
