---
paths:
  - server/**
---

## Backend Architecture

**Layered Request Flow**:
HTTP/tRPC Request → Middleware (Auth validation) → tRPC Procedure → Route Handler → Service Layer → Repository Pattern → Prisma ORM → PostgreSQL

### Security Layers

1. **Middleware**: JWT validation, user context extraction
2. **tRPC Procedure Level**: access scope gate — defined in `server/trpc/createRouter.ts`
3. **Route Handlers**: role and resource ownership checks via `securityCheck`
4. **Repository Pattern**: automatic data filtering by structure
5. **Audit Logging**: automatic mutation tracking (CREATE, UPDATE, DELETE)

### tRPC Procedures

Four procedure types, from least to most restrictive:

| Procedure            | Who passes                                                       | Context provided      |
| -------------------- | ---------------------------------------------------------------- | --------------------- |
| `publicProcedure`    | Anyone                                                           | `event` only          |
| `authProcedure`      | Authenticated active user (any role)                             | `user`                |
| `protectedProcedure` | Authenticated user **with a structure** (rejects Administrators) | `user` + `structure`  |
| `adminProcedure`     | Administrator only                                               | `user` (no structure) |

`protectedProcedure` already rejects Administrators and users without a structure — never re-check these in `securityCheck`.

### Layer responsibilities

Each layer has a single job — don't duplicate another layer's work:

- **Zod schema** (`inputValidation`): input shape, types, and constraints (min/max lengths, array bounds, required fields). Violations produce validation errors (BAD_REQUEST)
- **`securityCheck`**: authorization only — does this user have permission on this resource? Returns `false` → FORBIDDEN. Never use it for input validation (e.g. array size limits)
- **Handler / Service**: business logic only

### Security check conventions

- Centralized permission system in `server/security/permissions/` (`getContextPermissions`, `getFamilyFilePermissions`, `getFollowupPermissions`, `getDocumentPermissions`, `getSocialSupportPermissions`, etc.) — avoid reimplementing role logic manually. Role helpers (`getGranteRole`) are in `server/security/rules/helpers`
- Never write role deny-lists (`if (role === X) return false`). The permission system is allow-list by design
- When input references external entities (user IDs, structure IDs, etc.), verify they exist and belong to the caller's structure. Don't trust client-supplied relationships between entities — resolve and validate them server-side

Example — permission-based check:

```ts
const securityCheck = async (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions(ctx)
  return permissions.module.budget
}
```

Example — ownership check via repository:

```ts
const securityCheck = async (ctx: SecurityRuleContext, input: Input) => {
  const some = await SomeRepo.findUnique(ctx.user, {
    select: { id: true },
    where: { id: input.entityId }
  })
  if (!some) {
    return false
  }
}
```

### Route pattern

Routes are created via `createQuery` / `createMutation` factories (`server/route/createRoute.ts`).
Files follow the naming convention `[action].[query|mutation].ts` (e.g. `create.mutation.ts`, `get-one.query.ts`).

```ts
// server/route/followup/create.mutation.ts
export const create = createMutation({
  inputValidation: createFollowupSchema,
  securityCheck: async (ctx, input) => {...},
  handler,       // receives { ctx, input } where ctx has user + structure
  auditLog: { key, target, targetId, action }
})
```

For admin-only routes, use `adminHandler` instead of `handler` (ctx has user but no structure):

```ts
export const getStructures = createQuery({
  inputValidation: schema,
  adminHandler // receives { ctx, input } where ctx has user only
})
```

Router wires it to tRPC (`server/trpc/routers/followup/router.ts`):

```ts
export const followupRouter = router({
  add: protectedProcedure
    .input(routes.create.inputValidation)
    .mutation(routes.create.execute)
  // admin routes use adminProcedure + executeAsAdmin
})
```

Router composition in `/server/trpc/routers/index.ts` aggregates domain routers. Error handling via `server/trpc/trpcErrors.ts`. Return DTOs instead of raw database models.

### ORM conventions

- No direct SQL queries except in `scheduler/db-anonymizer`
- Performance: avoid large joins, large data fetches (rather paginate)
- Performance: make use of `relationLoadStrategy: "query"` if necessary
- Batch operations: enforce limits in the Zod schema with `.min()` / `.max()`. In services, use `$transaction` or chunked queries — avoid unbounded `Promise.all` over individual DB calls
