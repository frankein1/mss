---
paths:
  - server/schema/**
  - server/services/**/export*.ts
  - utils/export/**
  - public/handlebars-templates/**
  - server/email/**
---

## Input & Output Sanitization

### Defense-in-depth layers

User-controlled text passes through multiple sanitization layers before reaching a rendering sink:

1. **Input validation (Zod schemas):** `stringConstraint` rejects `<`, `>`, ASCII control characters, and Unicode bidi overrides via `.regex()`. This runs client-side (VeeValidate) before the API call and server-side (tRPC input parsing).
2. **HTTP middleware (`nuxt-security`):** `xssValidator` uses the `xss` library's `FilterXSS` to detect HTML in request bodies. It JSON-stringifies the payload, runs it through an HTML tag allowlist filter, and rejects with 400 if the output differs from the input. It catches dangerous tags (`<script>`, event handler attributes like `onerror`), sanitizes `href`/`src` (blocks `javascript:` URIs), and strips HTML comments. It does **not** catch control characters, Unicode bidi overrides, or Excel formula injection — those are handled by layers 1 and 3. Active on all routes except `/api/document/upload`.
3. **Output encoding at the rendering sink:** each rendering context has its own escaping rules (see below).

### Output encoding rules by context

When writing code that renders user-controlled text, always encode for the target context:

| Context                           | Rule                                                                                                                               | Example                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Handlebars templates** (`.hbs`) | Use `{{ }}` (double-stash) — never `{{{ }}}` (triple-stash). Double-stash auto-escapes `& < > " '`.                                | `{{firstName}}`                                  |
| **Vue templates**                 | Use `{{ }}` text interpolation — never `v-html` with user data. Vue auto-escapes via `textContent`.                                | `{{ beneficiary.name }}`                         |
| **Excel/CSV exports**             | Sanitize cell values starting with `=`, `+`, `-`, `@`, `\t`, `\r`, `\n` or full-width equivalents to prevent formula injection.    | Prepend `'` to neutralize formula interpretation |
| **Email templates**               | Only interpolate server-controlled values (URLs, constants). Never include user-authored free text in email HTML without escaping. | `${appUrl}` is safe; `${comment}` is not         |

### When adding new text fields

- Base all text fields on `stringConstraint` or its wrappers (`limitedStringConstraint`, `openText`). These inherit the control char / `<>` rejection.
- Do not create raw `z.string()` schemas for user-facing text — the sanitization regex will be missing.
- If the field needs `<` or `>` as legitimate input (e.g. mathematical expressions), document why and add compensating output encoding at every rendering sink.
