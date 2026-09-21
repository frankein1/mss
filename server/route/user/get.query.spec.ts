import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixtureStructures, FixtureStructure } from '~~/prisma/fixtures'
import { fakerFR as faker } from '@faker-js/faker'
import type { StructureTransferHistoryEntry } from '~~/server/schema/user/structureTransferHistory.schema'

const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id

let sharedUserId = ''
let sharedFamilyFileId = ''
let sharedBeneficiaryId = ''

beforeEach(async () => {
  const user = await prismaClient.user.create({
    select: { id: true },
    data: {
      firstName: faker.person.firstName(),
      lastName: 'GET-QUERY-TEST',
      email: `get-query-test-${Date.now()}@yopmail.com`,
      role: 'SocialWorker',
      status: 'Active',
      structureId: STRUCTURE_ID
    }
  })
  sharedUserId = user.id

  const familyFile = await prismaClient.familyFile.create({
    select: { id: true },
    data: { structureId: STRUCTURE_ID }
  })
  sharedFamilyFileId = familyFile.id

  const beneficiary = await prismaClient.beneficiary.create({
    select: { id: true },
    data: {
      structureId: STRUCTURE_ID,
      fileNumber: `GET-QUERY-TEST-${Date.now()}`,
      status: 'Active',
      familyFileId: sharedFamilyFileId
    }
  })
  sharedBeneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.familyFile.deleteMany({
    where: { id: sharedFamilyFileId }
  })
  await prismaClient.user.deleteMany({ where: { id: sharedUserId } })
})

describe('User - Get - WithCounts gate for never-transferred user', () => {
  test('A never-transferred blocked user returns _count breakdown and hasTransferredStructureInfo false', async ({
    trpc
  }) => {
    await prismaClient.document.create({
      data: {
        mimeType: 'application/pdf',
        name: 'test.pdf',
        filenameDisk: `test-${Date.now()}`,
        type: 'Cerfa',
        confidential: false,
        familyFileId: sharedFamilyFileId,
        beneficiaryId: sharedBeneficiaryId,
        createdById: sharedUserId
      }
    })

    const result = await trpc.structureManager.user.get({
      id: sharedUserId,
      withCounts: true
    })

    expect(result.hasBlockingContent).toBe(true)
    expect(result.hasTransferredStructureInfo).toBe(false)
    expect(result._count).toBeDefined()
    expect(result._count!.createdDocuments).toBeGreaterThan(0)
  })

  test('A never-transferred non-blocked user returns hasBlockingContent false', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.user.get({
      id: sharedUserId,
      withCounts: true
    })

    expect(result.hasBlockingContent).toBe(false)
    expect(result.hasTransferredStructureInfo).toBe(false)
  })
})

describe('User - Get - WithCounts gate for transferred user', () => {
  test('A transferred blocked user returns no _count and hasTransferredStructureInfo true', async ({
    trpc
  }) => {
    const history: StructureTransferHistoryEntry[] = [
      {
        structureId: fixtureStructures[FixtureStructure.Autun].id,
        role: 'SocialWorker',
        leftAt: new Date()
      }
    ]
    await prismaClient.user.update({
      where: { id: sharedUserId },
      data: { structureTransferHistory: history }
    })

    await prismaClient.document.create({
      data: {
        mimeType: 'application/pdf',
        name: 'test.pdf',
        filenameDisk: `test-transferred-${Date.now()}`,
        type: 'Cerfa',
        confidential: false,
        familyFileId: sharedFamilyFileId,
        beneficiaryId: sharedBeneficiaryId,
        createdById: sharedUserId
      }
    })

    const result = await trpc.structureManager.user.get({
      id: sharedUserId,
      withCounts: true
    })

    expect(result.hasBlockingContent).toBe(true)
    expect(result.hasTransferredStructureInfo).toBe(true)
    expect(result._count).toBeUndefined()
  })
})
