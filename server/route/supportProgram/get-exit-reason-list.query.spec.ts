import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const otherStructureId = fixtureStructures[FixtureStructure.Ministère].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id
const otherManagerId =
  fixturesUsers[FixtureUserRole.StructureManagerMinistere].id

let exitReasonId: string
let otherStructureExitReasonId: string

// Create an exit reason with the same name in two structures: the query must
// only return the one belonging to the caller's structure.
// Names are prefixed with 'GERL-' (Get Exit Reason List) for the teardown.
beforeEach(async () => {
  const [exitReason, otherStructureExitReason] = await Promise.all([
    prismaClient.supportProgramExitReason.create({
      data: { name: 'GERL-Motif', structureId, createdById: managerId }
    }),
    prismaClient.supportProgramExitReason.create({
      data: {
        name: 'GERL-Motif',
        structureId: otherStructureId,
        createdById: otherManagerId
      }
    })
  ])
  exitReasonId = exitReason.id
  otherStructureExitReasonId = otherStructureExitReason.id
})

afterEach(async () => {
  await prismaClient.supportProgramExitReason.deleteMany({
    where: { name: { startsWith: 'GERL-' } }
  })
})

describe('Support Program - Get Exit Reason List', () => {
  test('Returns the exit reasons of the structure only', async ({ trpc }) => {
    // The social worker belongs to the Test structure
    const result = await trpc.socialWorker.supportProgram.getExitReasonList()

    // The list may contain other exit reasons of the structure (e.g. from the
    // seed), so check by id rather than comparing the whole list
    const ids = result.map(r => r.id)
    expect(ids).toContain(exitReasonId)
    // Same name, but owned by the Ministère structure: must not leak
    expect(ids).not.toContain(otherStructureExitReasonId)
    // Each item exposes the name, used as the combobox option
    expect(result.find(r => r.id === exitReasonId)?.name).toBe('GERL-Motif')
  })
})
