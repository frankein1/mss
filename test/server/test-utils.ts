import type { H3Event } from 'h3'
import { test } from '~/server/trpc/createRouter'
import { appRouter } from '~/server/trpc/routers'
import { AppContext } from '~/server/trpc'

/**
 * Allow server side calls of trpc endpoints for integration tests
 * using a test context for tRPC with dummy event
 */
export const createCaller = (user: AppContext['user']) => {
  const event = { context: { auth: null } } as any as H3Event
  const ctx = { event, user }

  return test.createCallerFactory(appRouter)(ctx)
}
