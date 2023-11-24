import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { H3Event } from 'h3'
import { StructureType, UserRole } from '@prisma/client'
import { SecurityRuleGrantee } from '../security/rules/types'
import { AppContext } from './createContext'
import { forbiddenError } from './trpcErrors'

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
      user: { ...ctx.user, structureId: ctx.user.structure?.id || null }
    }
  })
})

const structureMiddleware = userMiddleware.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role === 'Administrator' || !ctx.user.structure?.id) {
    throw forbiddenError('User is not part of any structure')
  }
  return next({
    ctx: {
      // infers the user as part of structure
      user: { ...ctx.user, structureId: ctx.user.structure.id },
      structure: ctx.user.structure
    }
  })
})

const adminMiddleware = userMiddleware.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role !== 'Administrator') {
    throw forbiddenError('User is not an administrator')
  }
  return next({
    ctx: {
      user: { ...ctx.user, role: UserRole.Administrator }
    }
  })
})

/**
 * Auth procedure
 */

export const authProcedure = t.procedure.use(userMiddleware)

// FIXME: There is no way to infer the context type of protectedProcedure
export type AuthContext = {
  event: H3Event
  user: SecurityRuleGrantee
}

/**
 * App procedure
 */

export const protectedProcedure = t.procedure.use(structureMiddleware)

export type ProtectedAppContext = AuthContext & {
  structure: { id: string; type: StructureType }
}

/**
 * Admin procedure
 */

export const adminProcedure = t.procedure.use(adminMiddleware)

export type AdminContext = {
  event: H3Event
  user: SecurityRuleGrantee & { role: (typeof UserRole)['Administrator'] }
}
