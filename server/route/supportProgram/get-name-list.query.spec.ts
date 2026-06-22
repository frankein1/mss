import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let supportProgramNameId: string

beforeEach(async () => {
  const suffix = v4()

  const supportProgramName = await prismaClient.supportProgramName.create({
    data: {
      name: `GSPNL-${suffix}`,
      structureId,
      createdById: socialWorkerId
    }
  })
  supportProgramNameId = supportProgramName.id
})

afterEach(async () => {
  await prismaClient.supportProgramName.deleteMany({
    where: { id: supportProgramNameId }
  })
})

describe('Support Program - Get Name List - Filtering', () => {
  test('Returns all names for the structure including ones without enrollments', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.supportProgram.getNameList()

    const ids = result.map(d => d.id)
    expect(ids).toContain(supportProgramNameId)
  })
})

describe('Support Program - Get Name List - Authorizations', () => {
  test('Another structure cannot see names from this structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.supportProgram.getNameList()

    const ids = result.map(d => d.id)
    expect(ids).not.toContain(supportProgramNameId)
  })
})
