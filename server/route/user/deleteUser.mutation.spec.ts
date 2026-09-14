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
import {
  userBlockingRelationLabels,
  type UserBlockingRelation
} from '~~/client/labels'

const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id
const STRUCTURE_MANAGER_ID = fixturesUsers[FixtureUserRole.StructureManager].id
const SOCIAL_WORKER_NEW_ID = fixturesUsers[FixtureUserRole.SocialWorkerNew].id
const TEST_PREFIX = 'DELETE-TEST'

const blockedByMessage = (relation: UserBlockingRelation) =>
  `Cet utilisateur a des données liées et ne peut pas être supprimé : ${userBlockingRelationLabels[relation]}`

let sharedFamilyFileId = ''
let sharedBeneficiaryId = ''
let sharedUserId = ''

beforeEach(async () => {
  const user = await prismaClient.user.create({
    select: { id: true },
    data: {
      firstName: faker.person.firstName(),
      lastName: TEST_PREFIX,
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
      fileNumber: `${TEST_PREFIX}-${Date.now()}`,
      status: 'Active',
      familyFileId: sharedFamilyFileId
    }
  })
  sharedBeneficiaryId = beneficiary.id
})

afterEach(async () => {
  // Rows referencing the shared user must go first: their foreign keys are
  // restricting, which is exactly what the mutation guards against
  await prismaClient.workshop.deleteMany({
    where: { createdById: sharedUserId }
  })
  await prismaClient.workshopName.deleteMany({
    where: { name: { startsWith: TEST_PREFIX } }
  })
  await prismaClient.archivedBeneficiary.deleteMany({
    where: { archivedById: sharedUserId }
  })
  await prismaClient.redirectionReason.deleteMany({
    where: { name: { startsWith: TEST_PREFIX } }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { name: { startsWith: TEST_PREFIX } }
  })
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
    ).rejects.toThrow("Cet utilisateur n'existe plus")
  })

  test('User - Delete - A Structure Manager cannot delete their own account', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.user.delete({ id: STRUCTURE_MANAGER_ID })
    ).rejects.toThrow('Vous ne pouvez pas supprimer votre propre compte')
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
    ).rejects.toThrow(blockedByMessage('referentFor'))
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
    ).rejects.toThrow(blockedByMessage('createdDocuments'))
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
    ).rejects.toThrow(blockedByMessage('createdSocialSupports'))
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
    ).rejects.toThrow(blockedByMessage('createdComments'))
  })

  test('User - Delete - Cannot delete a user who has created workshops', async ({
    trpc
  }) => {
    const workshopName = await prismaClient.workshopName.create({
      select: { id: true },
      data: {
        name: `${TEST_PREFIX} Workshop ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: STRUCTURE_MANAGER_ID
      }
    })
    await prismaClient.workshop.create({
      select: { id: true },
      data: {
        workshopNameId: workshopName.id,
        structureId: STRUCTURE_ID,
        date: new Date(),
        createdById: sharedUserId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toThrow(blockedByMessage('workshops'))
  })

  test('User - Delete - Cannot delete a user who has created workshop names', async ({
    trpc
  }) => {
    await prismaClient.workshopName.create({
      select: { id: true },
      data: {
        name: `${TEST_PREFIX} Workshop ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: sharedUserId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toThrow(blockedByMessage('workshopNames'))
  })

  test('User - Delete - Cannot delete a user who has archived beneficiaries', async ({
    trpc
  }) => {
    await prismaClient.archivedBeneficiary.create({
      select: { id: true },
      data: {
        structureId: STRUCTURE_ID,
        archivedById: sharedUserId,
        oldBeneficiaryId: sharedBeneficiaryId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toThrow(blockedByMessage('archivedBeneficiaries'))
  })

  test('User - Delete - Cannot delete a user who has created redirection reasons', async ({
    trpc
  }) => {
    await prismaClient.redirectionReason.create({
      select: { id: true },
      data: {
        name: `${TEST_PREFIX} Redirection Reason ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: sharedUserId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toThrow(blockedByMessage('redirectionReasons'))
  })

  test('User - Delete - Cannot delete a user who has created support program names', async ({
    trpc
  }) => {
    await prismaClient.supportProgramName.create({
      select: { id: true },
      data: {
        name: `${TEST_PREFIX} Support Program ${Date.now()}`,
        structureId: STRUCTURE_ID,
        createdById: sharedUserId
      }
    })

    await expect(() =>
      trpc.structureManager.user.delete({ id: sharedUserId })
    ).rejects.toThrow(blockedByMessage('supportProgramNames'))
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
