---
paths:
  - server/**/*.spec.ts
  - test/server/**
---

# Testing: Backend

## Unit/integration Tests (Vitest)

- Favor integration testing for API endpoints over mocking (setup by `test/server/test-utils.ts`)
- Co-locate with source files (.spec.ts) and create one test file per endpoint ([route-name].spec.ts)
- Aim for greater than 80% coverage on critical paths with a focus on roles and permissions
- Test both allowed and forbidden roles — not just the happy path. Use the role-based callers from `test/server/test-utils.ts` (`trpc.structureManager`, `trpc.referent`, `trpc.receptionAgent`, etc.)

## Test Naming

All `describe` and `test` strings must be in English.

### `describe` blocks

Required for route specs — they always have at least two sections. Optional for non-route specs (unit tests, utilities) — use only when the file has multiple logical sections.

Format: `{Entity} - {Operation} - {Sub-scenario}` in title case. `{Sub-scenario}` must be descriptive — never use a generic label like "Behavior". The only fixed sub-scenario name is `Authorizations` for permission tests.
- e.g. `'Workshop - Update - Authorizations'`
- e.g. `'Workshop - Update - Update workshop name'`
- e.g. `'Beneficiary - Archive - Permission to archive active beneficiary'`

### `test` inside a `describe`

Plain English sentence, actor-first.
- Authorization: `'{Actor} can/cannot {action}'` or `'{Actor} should/should not {action}'`
- Behavior: `'{condition}, {expected outcome}'`

### Flat `test` (no `describe`)

Embed full context: `'{Entity} - {Operation} - {Assertion sentence}'`.
- e.g. `'Workshop - Create - An Agent cannot create a workshop with a partner organisation from another structure'`

## Error Assertion Convention

- For securityCheck failures: `.rejects.toThrowError(/not allowed to access route/i)`
- For admin calling protectedProcedure: `.rejects.toThrowError(/user routes are not available to admins/i)`
- For not-found / constraint violations: include the Prisma model name before "no record", e.g. `.rejects.toThrowError(/workshop[\s\S]*?no record/im)`
