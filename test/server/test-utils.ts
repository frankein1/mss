import type { H3Event } from 'h3'
import { test as base } from 'vitest'
import { test as t } from '~/server/trpc/createRouter'
import { appRouter } from '~/server/trpc/routers'
import { AppContext } from '~/server/trpc'
import {
  fixturesUsers,
  fixtureStructures,
  FixtureUserRole
} from '~/prisma/fixtures'

const setupFactory = t.createCallerFactory(appRouter)

/**
 * Allow server side calls of trpc endpoints for integration tests
 * using a test context for tRPC with dummy event
 * see https://trpc.io/docs/server/server-side-calls
 */
const createCaller = (user: AppContext['user']) => {
  const event = { context: { auth: null } } as any as H3Event
  const ctx = { event, user }

  return setupFactory(ctx)
}

/** Create context user for each role to be tested */
const users = {
  structureManager: {
    id: fixturesUsers[FixtureUserRole.StructureManager].id,
    structure: { id: fixtureStructures[0].id, type: fixtureStructures[0].type },
    role: fixturesUsers[FixtureUserRole.StructureManager].role,
    status: fixturesUsers[FixtureUserRole.StructureManager].status
  },
  receptionAgent: {
    id: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
    structure: { id: fixtureStructures[0].id, type: fixtureStructures[0].type },
    role: fixturesUsers[FixtureUserRole.ReceptionAgent].role,
    status: fixturesUsers[FixtureUserRole.ReceptionAgent].status
  },
  socialWorker: {
    id: fixturesUsers[FixtureUserRole.SocialWorker].id,
    structure: { id: fixtureStructures[0].id, type: fixtureStructures[0].type },
    role: fixturesUsers[FixtureUserRole.SocialWorker].role,
    status: fixturesUsers[FixtureUserRole.SocialWorker].status
  },
  referent: {
    id: fixturesUsers[FixtureUserRole.Referent].id,
    structure: { id: fixtureStructures[0].id, type: fixtureStructures[0].type },
    role: fixturesUsers[FixtureUserRole.Referent].role,
    status: fixturesUsers[FixtureUserRole.Referent].status
  }
}

/** Setup a tRPC caller for each role */
const trpc = {
  structureManager: createCaller(users.structureManager),
  receptionAgent: createCaller(users.receptionAgent),
  socialWorker: createCaller(users.socialWorker),
  referent: createCaller(users.referent)
}

interface Fixtures {
  trpc: typeof trpc
  users: typeof users
}

/**
 * Setup a custom vitest context to directly call tRPC caller with the proper user context
 * see https://vitest.dev/guide/test-context#extend-test-context
 */
export const test = base.extend<Fixtures>({ trpc, users })
