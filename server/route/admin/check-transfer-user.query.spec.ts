import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'

// Isolated data so the beneficiary count and manager count are deterministic and
// unaffected by seed fixtures or other specs.
const structurePrefix = 'check-transfer-spec-'

let multiManagerStructureId: string
let soloManagerStructureId: string
let managerAId: string
let workerId: string
let soloManagerId: string
const createdFamilyFileIds: string[] = []

beforeEach(async () => {
  // Structure with two StructureManagers and one SocialWorker who is referent on
  // two family files.
  const multiManagerStructure = await prismaClient.structure.create({
    data: {
      name: `${structurePrefix}multi`,
      type: 'Ccas',
      address: '1 rue Multi',
      city: 'Multi',
      zipcode: '00000',
      phone: '01 00 00 00 00',
      email: `${structurePrefix}multi@test.com`
    }
  })
  multiManagerStructureId = multiManagerStructure.id

  const [managerA, , worker] = await Promise.all([
    prismaClient.user.create({
      data: {
        email: `${structurePrefix}manager-a@test.com`,
        firstName: 'Manager',
        lastName: 'A',
        role: 'StructureManager',
        status: 'Active',
        structureId: multiManagerStructureId
      }
    }),
    prismaClient.user.create({
      data: {
        email: `${structurePrefix}manager-b@test.com`,
        firstName: 'Manager',
        lastName: 'B',
        role: 'StructureManager',
        status: 'Active',
        structureId: multiManagerStructureId
      }
    }),
    prismaClient.user.create({
      data: {
        email: `${structurePrefix}worker@test.com`,
        firstName: 'Worker',
        lastName: 'Multi',
        role: 'SocialWorker',
        status: 'Active',
        structureId: multiManagerStructureId
      }
    })
  ])
  managerAId = managerA.id
  workerId = worker.id

  const [file1, file2] = await Promise.all([
    prismaClient.familyFile.create({
      data: {
        structureId: multiManagerStructureId,
        referents: { connect: [{ id: workerId }] }
      }
    }),
    prismaClient.familyFile.create({
      data: {
        structureId: multiManagerStructureId,
        referents: { connect: [{ id: workerId }] }
      }
    })
  ])
  createdFamilyFileIds.push(file1.id, file2.id)

  // Structure with a single StructureManager.
  const soloManagerStructure = await prismaClient.structure.create({
    data: {
      name: `${structurePrefix}solo`,
      type: 'Ccas',
      address: '1 rue Solo',
      city: 'Solo',
      zipcode: '00001',
      phone: '01 00 00 00 00',
      email: `${structurePrefix}solo@test.com`
    }
  })
  soloManagerStructureId = soloManagerStructure.id

  const soloManager = await prismaClient.user.create({
    data: {
      email: `${structurePrefix}solo-manager@test.com`,
      firstName: 'Solo',
      lastName: 'Manager',
      role: 'StructureManager',
      status: 'Active',
      structureId: soloManagerStructureId
    }
  })
  soloManagerId = soloManager.id
})

afterEach(async () => {
  if (createdFamilyFileIds.length) {
    await prismaClient.familyFile.deleteMany({
      where: { id: { in: createdFamilyFileIds } }
    })
    createdFamilyFileIds.length = 0
  }
  await prismaClient.user.deleteMany({
    where: { email: { startsWith: structurePrefix } }
  })
  await prismaClient.structure.deleteMany({
    where: { name: { startsWith: structurePrefix } }
  })
})

describe('Admin - Check Transfer User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.checkTransferUser({ id: workerId })
    ).rejects.toThrow(/user is not an administrator/i)
  })

  test('An administrator cannot check an Administrator user', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.admin.checkTransferUser({
        id: fixturesUsers[FixtureUserRole.Administrator].id
      })
    ).rejects.toThrow(/no.*record/i)
  })
})

describe('Admin - Check Transfer User - Last structure manager', () => {
  test('The sole StructureManager of a structure is flagged as the last one', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.checkTransferUser({
      id: soloManagerId
    })

    expect(result).toEqual({
      nBeneficiaries: 0,
      isLastStructureManager: true
    })
  })

  test('A StructureManager is not the last one when the structure has other managers', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.checkTransferUser({
      id: managerAId
    })

    expect(result).toEqual({
      nBeneficiaries: 0,
      isLastStructureManager: false
    })
  })

  test('A non-manager user is never flagged as the last structure manager', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.checkTransferUser({
      id: workerId
    })

    expect(result.isLastStructureManager).toBe(false)
  })
})

describe('Admin - Check Transfer User - Beneficiary count', () => {
  test('The count reflects the number of family files the user is referent on', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.checkTransferUser({
      id: workerId
    })

    expect(result).toEqual({
      nBeneficiaries: 2,
      isLastStructureManager: false
    })
  })
})
