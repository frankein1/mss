---
paths:
  - server/**
---

## Backend Architecture

**Layered Request Flow**:
HTTP/tRPC Request → Middleware (Auth validation) → tRPC Procedure → Route Handler → Service Layer → Repository Pattern → Prisma ORM → PostgreSQL

**Security Layers**:

1. **Middleware**: JWT validation, user context extraction
2. **tRPC Procedure Level**: Access type definition (public/auth/protected/admin)
3. **Route Handlers**: Role and resource ownership checks, Namespace-based router organization
4. **Repository Pattern**: Automatic data filtering by structure
5. **Audit Logging**: Automatic mutation tracking (CREATE, UPDATE, DELETE)

**tRPC Configuration**:

- Type-safe RPC endpoints matching REST conventions
- Procedures defined in `server/trpc/createRouter.ts`
- Router composition in `/server/trpc/routers/index.ts` aggregates domain routers
- Automatic error handling with `server/trpc/trpcErrors.ts`
- Return DTOs instead of raw database models

**Route example pattern** — routes are created via `createQuery` / `createMutation` factories (`server/route/createRoute.ts`):

```ts
// server/route/followup/create.mutation.ts
export const create = createMutation({
  inputValidation: createFollowupSchema,        // Zod schema
  securityCheck: async (ctx, input) => {...},  // Access checks
  handler,                                     // calls Service layer
  auditLog: { key, target, targetId, action }  // activity logging
})
```

Router wires it to tRPC (`server/trpc/routers/followup/router.ts`):

```ts
export const followupRouter = router({
  create: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute)
})
```

**ORM conventions**:

- No direct SQL queries except in `scheduler/db-anonymizer`
- Performance: avoid large joins, large data fetches (rather paginate)
- Performance: make use of `relationLoadStrategy: "query"` if necessary
