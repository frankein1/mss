import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { User } from '@prisma/client'
import { shield } from 'trpc-shield'
import { adminPermissions } from './routers/admin/permissions'
import { AppContext } from './createContext'
import { forbiddenError } from './trpcErrors'
import { canViewStats } from '~/server/security/rules'

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
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    })
  }
  return next({
    ctx: {
      // infers the user as non-nullable
      user: ctx.user
    }
  })
})

/**
 * Reusable middleware to ensure
 * users are active
 */
const isActive = isAuthenticated.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.status !== 'Active') {
    throw forbiddenError('User status non active')
  }
  return next({
    ctx: {
      // infers the user as active
      user: ctx.user
    }
  })
})

const isPartOfStructure = isAuthenticated.unstable_pipe(({ ctx, next }) => {
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

const statsMiddleware = isPartOfStructure.unstable_pipe(({ ctx, next }) => {
  if (!canViewStats(ctx.user)) {
    throw forbiddenError('User can not view stats')
  }
  return next({
    ctx: {
      // infers the user as part of structure
      user: ctx.user
    }
  })
})

/**
 * Reusable middleware to ensure
 * user is an administrator
 */
const isAdmin = isAuthenticated.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role !== 'Administrator') {
    throw forbiddenError('User is not an administrator')
  }
  return next({
    ctx: {
      // infers the user as admin
      user: ctx.user
    }
  })
})

/**
 * Protected procedure
 * */
export const protectedProcedure = t.procedure
  .use(isAuthenticated)
  .use(isActive)
  .use(isPartOfStructure)

// FIXME: There is no way to infer the context type of protectedProcedure
export type ProtectedAppContext = AppContext & {
  user: User & { structureId: string }
}
export type ProtectedAppContextUser = ProtectedAppContext['user']

/**
 * Stats procedure
 */
export const statsProcedure = protectedProcedure.use(statsMiddleware)

/**
 * Admin procedure
 */

export const adminPermissionsMiddleware = t.middleware(
  shield<AppContext>(adminPermissions)
)

export const adminProcedure = t.procedure
  .use(isAuthenticated)
  .use(isActive)
  .use(isAdmin)
  .use(adminPermissionsMiddleware)
