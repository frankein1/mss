import picocolors from 'picocolors'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { H3Event } from 'h3'
import { UserRole } from '@prisma/client'
import type {
  SecurityRuleGrantee,
  SecurityRuleStructure
} from '../security/rules/types'
import { forbiddenError, unauthorizedError } from './trpcErrors'
import { shouldLog } from '~/server/utils/logging'
import { setAuthenticatedContext } from '~/server/auth/auth-middleware'

/** Create authenticated trpc context */
export const createContext = async (event: H3Event) => {
  await setAuthenticatedContext(event)
  const user = event.context.auth?.user

  if (!user) {
    return { event }
  }

  return { event, user }
}

export type AppContext = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<AppContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        // Allow the 'MSS_CODE' field to be available on error.data.MSS_CODE on the frontend.
        // It's meant to be used when the backend needs to send a specific error code.
        ...(error?.cause !== undefined && 'MSS_CODE' in error.cause
          ? { MSS_CODE: error.cause.MSS_CODE }
          : {})
      }
    }
  }
})

export const { router, createCallerFactory } = t

export const loggingMidleware = t.middleware(async opts => {
  const start = Date.now()
  const result = await opts.next()
  const durationMs = Date.now() - start
  // eslint-disable-next-line no-console
  console.log(
    picocolors.bgCyan(picocolors.bold(picocolors.whiteBright(' tRPC '))),
    picocolors.dim(opts.type.charAt(0).toUpperCase() + opts.type.slice(1)),
    '|',
    picocolors.underline(opts.path),
    '|',
    picocolors.bold(durationMs + 'ms'),
    durationMs > 100 ? '❌' : durationMs > 50 ? '⚠️' : '✅'
  )
  return result
})

const baseMiddleware = shouldLog('trpc')
  ? loggingMidleware.unstable_pipe
  : t.middleware

/** User is authenticated and active */
const authedMiddleware = baseMiddleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw unauthorizedError('Not authenticated')
  }
  if (ctx.user.status !== 'Active') {
    throw forbiddenError('deactivated user')
  }
  return next({
    ctx: {
      // infers the user as non-nullable
      user: { ...ctx.user, structureId: ctx.user.structure?.id || null }
    }
  })
})

/** Authenticated User is active, belongs to a structure and has no Admin role */
const userMiddleware = authedMiddleware.unstable_pipe(({ ctx, next }) => {
  if (
    ctx.user.role === 'Administrator' ||
    !ctx.user.structure?.id ||
    !ctx.user.structureId
  ) {
    throw forbiddenError('User routes are not available to admins')
  }

  return next({
    ctx: {
      user: ctx.user,
      structure: ctx.user.structure
    }
  })
})

/** Authenticated User is active and has an admin role */
const adminMiddleware = authedMiddleware.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role !== 'Administrator') {
    throw forbiddenError('User is not an administrator')
  }
  return next({
    ctx: {
      user: { ...ctx.user, role: UserRole.Administrator }
    }
  })
})

// FIXME: There is no way to infer the context type of protectedProcedure
export type AuthContext = {
  event: H3Event
  user: SecurityRuleGrantee
}

/**
 * User authenticated app procedure
 */

export const protectedProcedure = t.procedure.use(userMiddleware)

export type ProtectedAppContext = AuthContext & {
  structure: SecurityRuleStructure
}

/**
 * Admin authenticated app procedure
 */

export const adminProcedure = t.procedure.use(adminMiddleware)

export type AdminContext = {
  event: H3Event
  user: SecurityRuleGrantee & { role: (typeof UserRole)['Administrator'] }
}

/** Server side calls for tests */
export const test = {
  createCallerFactory
}
