import { afterEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

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
    ).rejects.toThrow(/unique constraint/i)
  })
})

describe('SupportProgram - Upsert Name - HasLifecycle', () => {
  test('New name defaults hasLifecycle to false', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.upsertName({
      name: 'UPN-Default-Lifecycle'
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id: result.id }
    })
    expect(record?.hasLifecycle).toBe(false)
  })

  test('New name can be created with hasLifecycle true', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.upsertName({
      name: 'UPN-With-Lifecycle',
      hasLifecycle: true
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id: result.id }
    })
    expect(record?.hasLifecycle).toBe(true)
  })

  test('HasLifecycle is persisted on update', async ({ trpc }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UPN-Toggle', structureId, createdById: managerId },
      select: { id: true }
    })

    await trpc.structureManager.supportProgram.upsertName({
      id,
      name: 'UPN-Toggle',
      hasLifecycle: true
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id }
    })
    expect(record?.hasLifecycle).toBe(true)
  })

  test('Switching from non-lifecycle to lifecycle is always allowed', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UPN-Upgrade', structureId, createdById: managerId },
      select: { id: true }
    })

    const familyFile = await prismaClient.familyFile.create({
      data: {
        structure: { connect: { id: structureId } },
        referents: { connect: [{ id: referentId }] }
      }
    })
    const beneficiary = await prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFile.id } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: managerId } },
        fileNumber: `UPN-UPGRADE-${crypto.randomUUID()}`,
        status: 'Active'
      }
    })
    await prismaClient.supportProgram.create({
      data: {
        id: crypto.randomUUID(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id } }
      }
    })

    await trpc.structureManager.supportProgram.upsertName({
      id,
      name: 'UPN-Upgrade',
      hasLifecycle: true
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id }
    })
    expect(record?.hasLifecycle).toBe(true)

    await prismaClient.supportProgram.deleteMany({
      where: { beneficiaryId: beneficiary.id }
    })
    await prismaClient.beneficiary.deleteMany({ where: { id: beneficiary.id } })
    await prismaClient.familyFile.deleteMany({ where: { id: familyFile.id } })
  })

  test('Switching from lifecycle to non-lifecycle is blocked when name has usage', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: {
        name: 'UPN-Lock',
        structureId,
        createdById: managerId,
        hasLifecycle: true
      },
      select: { id: true }
    })

    const familyFile = await prismaClient.familyFile.create({
      data: {
        structure: { connect: { id: structureId } },
        referents: { connect: [{ id: referentId }] }
      }
    })
    const beneficiary = await prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFile.id } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: managerId } },
        fileNumber: `UPN-LOCK-${crypto.randomUUID()}`,
        status: 'Active'
      }
    })
    await prismaClient.supportProgram.create({
      data: {
        id: crypto.randomUUID(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id } }
      }
    })

    await expect(
      trpc.structureManager.supportProgram.upsertName({
        id,
        name: 'UPN-Lock',
        hasLifecycle: false
      })
    ).rejects.toThrow(/cannot switch from lifecycle to non-lifecycle/i)

    await prismaClient.supportProgram.deleteMany({
      where: { beneficiaryId: beneficiary.id }
    })
    await prismaClient.beneficiary.deleteMany({ where: { id: beneficiary.id } })
    await prismaClient.familyFile.deleteMany({ where: { id: familyFile.id } })
  })

  test('Switching from lifecycle to non-lifecycle is allowed when name has no usage', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: {
        name: 'UPN-Unlock',
        structureId,
        createdById: managerId,
        hasLifecycle: true
      },
      select: { id: true }
    })

    await trpc.structureManager.supportProgram.upsertName({
      id,
      name: 'UPN-Unlock',
      hasLifecycle: false
    })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id }
    })
    expect(record?.hasLifecycle).toBe(false)
  })
})
