import { prismaClient } from '~~/server/prisma'
import { test } from '~~/test/server/test-utils'
import {
  fixturesUsers,
  FixtureUserRole,
  fixtureStructures,
  FixtureStructure
} from '~~/prisma/fixtures'
import { describe, expect, beforeEach, afterEach } from 'vitest'
import { fakerFR as faker } from '@faker-js/faker'

const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id
const STRUCTURE_MANAGER_ID = fixturesUsers[FixtureUserRole.StructureManager].id
const SOCIAL_WORKER_NEW_ID = fixturesUsers[FixtureUserRole.SocialWorkerNew].id

let sharedFamilyFileId = ''
let sharedBeneficiaryId = ''
let sharedUserId = ''

beforeEach(async () => {
  const user = await prismaClient.user.create({
    select: { id: true },
    data: {
      firstName: faker.person.firstName(),
      lastName: 'DELETE-TEST',
      email: `delete-test-${Date.now()}@yopmail.com`,
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
      fileNumber: `DELETE-TEST-${Date.now()}`,
      status: 'Active',
      familyFileId: sharedFamilyFileId
    }
  })
  sharedBeneficiaryId = beneficiary.id
})

afterEach(async () => {
  // Cascade-deletes: beneficiary, documents, social supports, comments
  await prismaClient.familyFile.deleteMany({
    where: { id: sharedFamilyFileId }
  })
  await prismaClient.user.deleteMany({ where: { id: sharedUserId } })
})

describe('Authorizations', () => {
  test('User - Delete - Only a Structure Manager can delete a user', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.socialWorker.user.delete({ id: SOCIAL_WORKER_NEW_ID })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('User - Delete - A Structure Manager cannot delete a user from another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.user.delete({ id: SOCIAL_WORKER_NEW_ID })
    ).rejects.toThrow(/user[\s\S]*?no record/im)
  })

  test('User - Delete - A Structure Manager cannot delete their own account', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.user.delete({ id: STRUCTURE_MANAGER_ID })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})

describe('Linked data blocks deletion', () => {
  test('User - Delete - Cannot delete a user who is a referent', async ({
    trpc
  }) => {
    await prismaClient.user.update({
      where: { id: sharedUserId },
      data: { referentFor: { connect: [{ id: sharedFamilyFileId }] } }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('User - Delete - Cannot delete a user who has created documents', async ({
    trpc
  }) => {
    await prismaClient.document.create({
      select: { key: true },
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

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('User - Delete - Cannot delete a user who has created social supports', async ({
    trpc
  }) => {
    await prismaClient.socialSupport.create({
      select: { id: true },
      data: {
        structureId: STRUCTURE_ID,
        familyFileId: sharedFamilyFileId,
        beneficiaryId: sharedBeneficiaryId,
        createdById: sharedUserId,
        status: 'InProgress',
        socialSupportType: 'Followup'
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('User - Delete - Cannot delete a user who has created comments', async ({
    trpc
  }) => {
    const socialSupport = await prismaClient.socialSupport.create({
      select: { id: true },
      data: {
        structureId: STRUCTURE_ID,
        familyFileId: sharedFamilyFileId,
        beneficiaryId: sharedBeneficiaryId,
        createdById: STRUCTURE_MANAGER_ID,
        status: 'InProgress',
        socialSupportType: 'Followup'
      }
    })
    await prismaClient.comment.create({
      select: { id: true },
      data: {
        content: 'test comment',
        socialSupportId: socialSupport.id,
        createdById: sharedUserId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('User - Delete - Cannot delete a user who has created workshops', async ({
    trpc
  }) => {
    const workshopName = await prismaClient.workshopName.create({
      select: { id: true },
      data: {
        name: `Workshop Test ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: STRUCTURE_MANAGER_ID
      }
    })
    const workshop = await prismaClient.workshop.create({
      select: { id: true },
      data: {
        workshopNameId: workshopName.id,
        structureId: STRUCTURE_ID,
        date: new Date(),
        createdById: sharedUserId
      }
    })

    try {
      await expect(() =>
        trpc.structureManager.user.delete({ id: sharedUserId })
      ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    } finally {
      await prismaClient.workshop.delete({ where: { id: workshop.id } })
      await prismaClient.workshopName.delete({ where: { id: workshopName.id } })
    }
  })

  test('User - Delete - Cannot delete a user who has created workshop names', async ({
    trpc
  }) => {
    const workshopName = await prismaClient.workshopName.create({
      select: { id: true },
      data: {
        name: `Workshop Test ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: sharedUserId
      }
    })
    try {
      await expect(() =>
        trpc.structureManager.user.delete({ id: sharedUserId })
      ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    } finally {
      await prismaClient.workshopName.delete({ where: { id: workshopName.id } })
    }
  })
})

describe('No linked data deletion', () => {
  test('User - Delete - A Structure Manager can delete a user with no linked data', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.user.delete({ id: sharedUserId })
    expect(result.id).toBe(sharedUserId)
  })
})
