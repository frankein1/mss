import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { User } from '@prisma/client'
import { allow, deny, shield } from 'trpc-shield'
import { adminPermissions } from './routers/admin/permissions'
import { AppContext } from './createContext'
import { forbiddenError } from './trpcErrors'
import { statPermissions } from './routers/stat/permissions'

const t = initTRPC.context<AppContext>().create({
  transformer: superjson
})

export const { router } = t

/**
 * Unprotected procedure
 * */
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const userMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    })
  }
  if (ctx.user.status !== 'Active') {
    throw forbiddenError('User status non active')
  }
  return next({
    ctx: {
      // infers the user as non-nullable
      user: ctx.user
    }
  })
})

const structureMiddleware = userMiddleware.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role !== 'Administrator' && !ctx.user.structureId) {
    throw forbiddenError('User is not part of any structure')
  }
  return next({
    ctx: {
      // infers the user as part of structure
      user: ctx.user as User & { structureId: string }
    }
  })
})

// FIXME: There is no way to infer the context type of protectedProcedure
export type ProtectedAppContext = AppContext & {
  user: User & { structureId: string }
}

export type ProtectedAppContextUser = ProtectedAppContext['user']

/**
 * App procedure
 * */

export const appPermissionsMiddleware = t.middleware(
  shield<ProtectedAppContext>(
    {
      query: {
        stat: statPermissions.query
      },
      mutation: {
        stat: statPermissions.mutation
      }
    },
    { fallbackRule: allow }
  )
)

export const protectedProcedure = t.procedure
  .use(userMiddleware)
  .use(structureMiddleware)
  .use(appPermissionsMiddleware)

/**
 * Admin procedure
 */

export const adminPermissionsMiddleware = t.middleware(
  shield<AppContext>(adminPermissions, { fallbackRule: deny })
)

export const adminProcedure = t.procedure
  .use(userMiddleware)
  .use(adminPermissionsMiddleware)
