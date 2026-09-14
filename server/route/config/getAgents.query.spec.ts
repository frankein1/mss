import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'

const toAgent = (role: FixtureUserRole, name: string) => ({
  id: fixturesUsers[role].id,
  name,
  status: fixturesUsers[role].status
})

// All non-administrator users seeded in the Test structure (see test-utils
// `structure`), which every default role caller belongs to.
const expectedTestAgents = [
  toAgent(FixtureUserRole.Instructor, 'Jeanne INSTRUCTEUR'),
  toAgent(FixtureUserRole.Referent, 'Jeanne RÉFÉRENTE'),
  toAgent(FixtureUserRole.ReceptionAgent, 'Jean AGENT'),
  toAgent(FixtureUserRole.SocialWorker, 'Jean TRAVAILLEUR SOCIAL'),
  toAgent(FixtureUserRole.StructureManager, 'Jeanne RESPONSABLE'),
  toAgent(FixtureUserRole.InstructorActive, 'Marc INSTRUCTEUR')
]

const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id)

describe('Config - Get Agents - Authorizations', () => {
  test('An Administrator cannot retrieve agents', async ({ trpc }) => {
    await expect(() => trpc.administrator.config.getAgents()).rejects.toThrow(
      /user routes are not available to admins/i
    )
  })
})

describe('Config - Get Agents - Results', () => {
  test('A SocialWorker retrieves every non-administrator agent of their structure', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.config.getAgents()

    expect([...result].sort(byId)).toEqual([...expectedTestAgents].sort(byId))
  })

  test('A ReceptionAgent retrieves the same agents as any other role of the structure', async ({
    trpc
  }) => {
    const result = await trpc.receptionAgent.config.getAgents()

    expect([...result].sort(byId)).toEqual([...expectedTestAgents].sort(byId))
  })

  test('A disabled agent is included in the results', async ({ trpc }) => {
    const result = await trpc.socialWorker.config.getAgents()

    expect(result).toContainEqual(
      toAgent(FixtureUserRole.Instructor, 'Jeanne INSTRUCTEUR')
    )
    expect(fixturesUsers[FixtureUserRole.Instructor].status).toBe('Disabled')
  })

  test('A StructureManager only sees agents from their own structure', async ({
    trpc
  }) => {
    const result = await trpc.structureManagerMinistere.config.getAgents()

    expect(result).toEqual([
      toAgent(
        FixtureUserRole.StructureManagerMinistere,
        'Laura CI-MSS RESPONSABLE MINISTÈRE'
      )
    ])
  })
})
