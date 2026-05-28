---
paths:
  - server/**/*.spec.ts
  - test/server/**
---

# Testing: Backend

## Unit/integration Tests (Vitest)

- Favor integration testing for API endpoints over mocking (setup by `test/server/test-utils.ts`)
- Co-locate with source files (.spec.ts) and create one test file per endpoint ([route-name].spec.ts)
- Permission testing isolated in `describe('Authorizations), () => {...}`
- Aim for greater than 80% coverage on critical paths with a focus on roles and permissions
- Test both allowed and forbidden roles — not just the happy path. Use the role-based callers from `test/server/test-utils.ts` (`trpc.structureManager`, `trpc.referent`, `trpc.receptionAgent`, etc.)

## Error Assertion Convention

- For securityCheck failures: `.rejects.toThrowError(/not allowed to access route/i)`
- For admin calling protectedProcedure: `.rejects.toThrowError(/user routes are not available to admins/i)`
- For not-found / constraint violations: include the Prisma model name before "no record", e.g. `.rejects.toThrowError(/workshop[\s\S]*?no record/im)`
