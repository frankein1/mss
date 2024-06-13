import { test as base, describe, expect } from 'vitest'
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '~/server/trpc/routers'
import { createCaller } from '~/test/server/test-utils'
import { AppContext } from '~/server/trpc'
import { fixturesUsers, fixtureStructure } from '~/prisma/fixtures'

type Input = inferProcedureInput<
  AppRouter['stat']['getHelpRequestSubjectStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getHelpRequestSubjectStats']
>

interface Fixtures {
  user: AppContext['user']
}

const test = base.extend<Fixtures>({
  user: {
    id: fixturesUsers[4].id,
    structure: { id: fixtureStructure.id, type: fixtureStructure.type },
    role: fixturesUsers[4].role,
    status: fixturesUsers[4].status
  }
})

const parseStats = (stats: Output) =>
  stats.reduce<Record<string, number>>(
    (acc, { name, _count }) => ({
      ...acc,
      [name]: _count.socialSupports
    }),
    {}
  )

describe("Statistiques - Instruction de dossier - Objets d'accompagnement", () => {
  test('check basic call', async ({ user }) => {
    const trpc = createCaller(user)
    const input: Input = {}

    const stats = await trpc.stat.getHelpRequestSubjectStats(input)

    expect(parseStats(stats)).toBe(undefined)
  })
})
