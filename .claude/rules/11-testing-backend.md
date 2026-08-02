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
- e.g. `'Workshop - Update - Workshop name'`
- e.g. `'Beneficiary - Archive - Permission to archive active beneficiary'`

### `test` inside a `describe`

Plain English sentence, actor-first.

- Preferred: `'{Actor} can/cannot {action}'` or `'{Actor} should/should not {action}'`
- Tolerated: `'{condition}, {expected outcome}'`

### Flat `test` (no `describe`)

Embed full context: `'{Entity} - {Operation} - {Assertion sentence}'`.

- e.g. `'Workshop - Create - An Agent cannot create a workshop with a partner organisation from another structure'`

## Error Assertion Convention

- For securityCheck failures: `.rejects.toThrow(/not allowed to access route/i)`
- For admin calling protectedProcedure: `.rejects.toThrow(/user routes are not available to admins/i)`
- For not-found / constraint violations: include the Prisma model name before "no record", e.g. `.rejects.toThrow(/workshop[\s\S]*?no record/im)`

## Assertion precision

- Favor exact assertions (`toEqual`, `toStrictEqual`) over imprecise ones — assert **what** the result is, not merely that it exists or is non-empty
- Anti-patterns: `toBeDefined()`, `toBeTruthy()`, `toBeGreaterThan(0)`, `.length > 0` — these pass on any non-trivial result and catch almost no regressions
- Use `toMatchObject` only when some fields are genuinely non-deterministic (timestamps, auto-generated IDs) — when the full shape is known, use `toEqual`
- Use `toHaveLength` only when the exact content isn't the point of the test
- For opaque generated values, use `expect.any(String)` rather than `toBeDefined()`

## Test setup / teardown

- Favor using seed data rather than setting up custom data. Generate custom data only when using seed data would require modifications that make teardown difficult.
- Always tear down in `afterEach` hook and never in the test itself.

You can use ids as global values and remove specifically the ids. Prefer this approach for structures, beneficiaries, family files, or when creating one or only a few objects.

The track function is useful because you can also use it anywhere in the test and not only in the setup.

```js
let familyFileIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  familyFileIds.push(result.id)
  return result
}

beforeEach(async () => {
  const familyFile = track(await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  }))
})

afterEach(async () => {
  if (familyFileIds.length) {
    await prismaClient.familyFile.deleteMany({
      where: { id: { in: familyFileIds } }
    })
    familyFileIds.length = 0
  }
})
```

You also can use prefix for naming and delete with matching the corresponding prefix. Prefer this approach when creating many objects.

```js
afterEach(async () => {
  await prismaClient.partnerOrganization.deleteMany({
    where: { name: { startsWith: 'UDT-' } }
  })
})
```
