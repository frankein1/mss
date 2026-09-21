import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixturesUsers,
  FixtureUserRole,
  fixtureStructures,
  FixtureStructure
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'
import type { StructureTransferHistoryEntry } from '~~/server/schema/user/structureTransferHistory.schema'

const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id
const AUTUN_STRUCTURE_ID = fixtureStructures[FixtureStructure.Autun].id

describe('User - Get User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getUser({
        id: fixturesUsers[FixtureUserRole.StructureManager].id
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('User - Get User - Results', () => {
  test('Administrator can retrieve a non-admin user by ID', async ({
    trpc
  }) => {
    const referent = fixturesUsers[FixtureUserRole.Referent]

    const result = await trpc.administrator.admin.getUser({
      id: referent.id
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(referent.id)
  })

  test('Administrator cannot fetch an Administrator user', async ({ trpc }) => {
    const admin = fixturesUsers[FixtureUserRole.Administrator]

    await expect(() =>
      trpc.administrator.admin.getUser({ id: admin.id })
    ).rejects.toThrow(/no.*record/i)
  })
})

describe('User - Get User - Former structures', () => {
  let testUserId = ''

  beforeEach(async () => {
    const user = await prismaClient.user.create({
      select: { id: true },
      data: {
        firstName: 'Former',
        lastName: 'StructureTest',
        email: `former-struct-test-${Date.now()}@yopmail.com`,
        role: 'SocialWorker',
        status: 'Active',
        structureId: STRUCTURE_ID
      }
    })
    testUserId = user.id
  })

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: { id: testUserId } })
  })

  test('A never-transferred user returns an empty formerStructures list', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.getUser({ id: testUserId })
    expect(result.formerStructures).toEqual([])
  })

  test('A transferred user returns resolved structure names, roles, and dates sorted newest-first', async ({
    trpc
  }) => {
    const olderDate = new Date('2025-01-15T10:00:00Z')
    const newerDate = new Date('2025-06-20T14:00:00Z')
    const history: StructureTransferHistoryEntry[] = [
      { structureId: STRUCTURE_ID, role: 'SocialWorker', leftAt: olderDate },
      { structureId: AUTUN_STRUCTURE_ID, role: 'Referent', leftAt: newerDate }
    ]
    await prismaClient.user.update({
      where: { id: testUserId },
      data: { structureTransferHistory: history }
    })

    const result = await trpc.administrator.admin.getUser({ id: testUserId })

    expect(result.formerStructures).toHaveLength(2)
    expect(result.formerStructures.at(0)).toMatchObject({
      structureName: 'CCAS Autun',
      roleLabel: 'Référent'
    })
    expect(result.formerStructures.at(1)).toMatchObject({
      structureName: 'CCAS de Test',
      roleLabel: 'Travailleur social'
    })
  })

  test('A disabled former structure resolves to "Structure désactivée"', async ({
    trpc
  }) => {
    const disabledStructure = await prismaClient.structure.create({
      data: {
        name: '',
        type: 'Ccas',
        disabled: true,
        address: '1 rue Disabled',
        city: 'Disabled',
        zipcode: '00000',
        phone: '01 00 00 00 00',
        email: `disabled-former-${Date.now()}@test.com`
      }
    })

    try {
      const history: StructureTransferHistoryEntry[] = [
        {
          structureId: disabledStructure.id,
          role: 'StructureManager',
          leftAt: new Date()
        }
      ]
      await prismaClient.user.update({
        where: { id: testUserId },
        data: { structureTransferHistory: history }
      })

      const result = await trpc.administrator.admin.getUser({ id: testUserId })

      expect(result.formerStructures).toHaveLength(1)
      expect(result.formerStructures.at(0)?.structureName).toBe(
        'Structure désactivée'
      )
      expect(result.formerStructures.at(0)?.disabled).toBe(true)
    } finally {
      await prismaClient.structure.delete({
        where: { id: disabledStructure.id }
      })
    }
  })

  test('An unresolvable structure id resolves to "Structure inconnue"', async ({
    trpc
  }) => {
    const fakeId = '00000000-0000-4000-8000-000000000000'
    const history: StructureTransferHistoryEntry[] = [
      { structureId: fakeId, role: 'SocialWorker', leftAt: new Date() }
    ]
    await prismaClient.user.update({
      where: { id: testUserId },
      data: { structureTransferHistory: history }
    })

    const result = await trpc.administrator.admin.getUser({ id: testUserId })

    expect(result.formerStructures).toHaveLength(1)
    expect(result.formerStructures.at(0)?.structureName).toBe(
      'Structure inconnue'
    )
  })
})
