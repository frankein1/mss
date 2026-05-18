---
paths:
  - **/*.spec.ts
  - test/**
---

# Testing

## Unit/integration Tests (Vitest)

- Favor integration testing for API endpoints over mocking (setup by `test/server/test-utils.ts`)
- Co-locate with source files (.spec.ts) and create one test file per endpoint ([route-name].spec.ts)
- Permission testing isolated in `describe('Authorizations), () => {...}`
- Aim for greater than 80% coverage on critical paths with a focus on roles and permissions
- Test both allowed and forbidden roles — not just the happy path. Use the role-based callers from `test/server/test-utils.ts` (`trpc.structureManager`, `trpc.referent`, `trpc.receptionAgent`, etc.)

## End-to-End Tests (Playwright)

- User flow testing in /e2e/
- Realistic interaction scenarios

## Error Assertion Convention

- Use `.rejects.toThrowError(/regex/i)` with a case-insensitive regex matching a stable fragment of the error message
- Never use bare `.rejects.toThrow()` — always assert on the error content
- For securityCheck failures: `.rejects.toThrowError(/not allowed to access route/i)`
- For admin calling protectedProcedure: `.rejects.toThrowError(/user routes are not available to admins/i)`
- For not-found / constraint violations: include the Prisma model name before "no record", e.g. `.rejects.toThrowError(/workshop[\s\S]*?no record/im)`

## Common Commands

- Run all tests via `pnpm test`
- Run E2E tests via `pnpm test:e2e`
