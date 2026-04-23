---
paths:
  - server/**
---

## Backend Architecture

**Layered Request Flow**:
HTTP/tRPC Request → Middleware (Auth validation) → tRPC Procedure → Route Handler → Service Layer → Repository Pattern → Prisma ORM → PostgreSQL

**Security Layers**:

1. **Middleware**: JWT validation, user context extraction
2. **tRPC Procedure Level**: Access type definition (public/auth/protected/admin). Procedures defined in `server/trpc/createRouter.ts`. `protectedProcedure` already rejects Administrators and users without a structure — never re-check these in `securityCheck`
3. **Route Handlers**: Role and resource ownership checks, Namespace-based router organization
4. **Repository Pattern**: Automatic data filtering by structure
5. **Audit Logging**: Automatic mutation tracking (CREATE, UPDATE, DELETE)

**Layer responsibilities — each layer has a single job, don't duplicate another layer's work**:

- **Zod schema** (`inputValidation`): input shape, types, and constraints (min/max lengths, array bounds, required fields). Violations produce validation errors (BAD_REQUEST)
- **`securityCheck`**: authorization only — does this user have permission on this resource? Returns `false` → FORBIDDEN. Never use it for input validation (e.g. array size limits)
- **Handler / Service**: business logic only

**Security check conventions**

- centralized permission system defined in `server/security/permissions/**` (`getFamilyFilePermissions`, `getEditionPermissions`, `getGranteRole`, etc.) — avoid reimplementing role logic manually
- Never write role deny-lists (`if (role === X) return false`). The permission system is allow-list by design
- When input references external entities (user IDs, structure IDs, etc.), verify they exist and belong to the caller's structure. Don't trust client-supplied relationships between entities — resolve and validate them server-side

Example:

```ts
const securityCheck = async (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({ ctx })
  return permissions.module.budget
}
```

**tRPC Configuration**:

- Type-safe RPC endpoints matching REST conventions
- Router composition in `/server/trpc/routers/index.ts` aggregates domain routers
- Automatic error handling with `server/trpc/trpcErrors.ts`
- Return DTOs instead of raw database models

**Route example pattern** — routes are created via `createQuery` / `createMutation` factories (`server/route/createRoute.ts`):

```ts
// server/route/followup/create.mutation.ts
export const create = createMutation({
  inputValidation: createFollowupSchema,        // Zod schema
  securityCheck: async (ctx, input) => {...},  // Security checks
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
- Batch operations: enforce limits in the Zod schema with `.min()` / `.max()`. In services, use `$transaction` or chunked queries — avoid unbounded `Promise.all` over individual DB calls
