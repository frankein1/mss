import { afterEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id

afterEach(async () => {
  await prismaClient.supportProgramName.deleteMany({
    where: { name: { startsWith: 'UPN-' }, structureId }
  })
})

describe('SupportProgram - Upsert Name - Authorizations', () => {
  test('A SocialWorker cannot create a support program name', async ({
    trpc
  }) => {
    await expect(
      trpc.socialWorker.supportProgram.upsertName({ name: 'UPN-Test' })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A ReceptionAgent cannot create a support program name', async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.supportProgram.upsertName({ name: 'UPN-Test' })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A StructureManager cannot update a support program name from another structure', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: {
        name: 'UPN-Cross-Structure',
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })

    await expect(
      trpc.structureManagerMinistere.supportProgram.upsertName({
        id,
        name: 'UPN-Renamed'
      })
    ).rejects.toThrowError(/supportProgramName[\s\S]*?no record/im)
  })
})

describe('SupportProgram - Upsert Name - Create And Rename', () => {
  test('A StructureManager can create a new support program name', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.supportProgram.upsertName({
      name: 'UPN-Nouveau dispositif'
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id: result.id }
    })
    expect(record?.name).toBe('UPN-Nouveau dispositif')
    expect(record?.structureId).toBe(structureId)
    expect(record?.createdById).toBe(managerId)
  })

  test('A StructureManager can rename an existing support program name', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UPN-Ancien nom', structureId, createdById: managerId },
      select: { id: true }
    })

    await trpc.structureManager.supportProgram.upsertName({
      id,
      name: 'UPN-Nouveau nom'
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id }
    })
    expect(record?.name).toBe('UPN-Nouveau nom')
  })

  test('Creating a duplicate name throws a unique constraint error', async ({
    trpc
  }) => {
    await prismaClient.supportProgramName.create({
      data: { name: 'UPN-Doublon', structureId, createdById: managerId }
    })

    await expect(
      trpc.structureManager.supportProgram.upsertName({ name: 'UPN-Doublon' })
    ).rejects.toThrowError(/unique constraint/i)
  })
})
