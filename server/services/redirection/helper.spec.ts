import { prismaClient } from '~/server/prisma'
import { describe, expect, afterEach } from 'vitest'
import { test, createSecurityContext } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesSocialSupportSubjects
} from '~/prisma/fixtures'
import {
  resolveRedirectionReasonIds,
  deleteOrphanedRedirectionReasons
} from './helper'

const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById = fixturesUsers[FixtureUserRole.SocialWorker].id
const beneficiary = fixturesBeneficiaries[FixtureBeneficiary.COURSOR]
const beneficiaryId = beneficiary.id
const familyFileId = beneficiary.familyFileId
const subjectId = fixturesSocialSupportSubjects[0].id

let reasonIds: string[] = []
let socialSupportIds: string[] = []

async function createSocialSupportWithReason(reasonId: string) {
  const socialSupport = await prismaClient.socialSupport.create({
    select: { id: true },
    data: {
      structure: { connect: { id: structureId } },
      familyFile: { connect: { id: familyFileId } },
      beneficiary: { connect: { id: beneficiaryId } },
      createdBy: { connect: { id: createdById } },
      socialSupportType: 'Followup',
      status: 'InProgress',
      date: new Date(),
      followup: { create: { medium: 'PlannedInPerson' } },
      socialSupportRedirections: {
        create: {
          type: 'Other',
          redirectionReason: { connect: { id: reasonId } }
        }
      }
    }
  })
  socialSupportIds.push(socialSupport.id)
  return socialSupport
}

afterEach(async () => {
  if (socialSupportIds.length > 0) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: socialSupportIds } }
    })
    socialSupportIds = []
  }
  if (reasonIds.length > 0) {
    await prismaClient.redirectionReason.deleteMany({
      where: { id: { in: reasonIds } }
    })
    reasonIds = []
  }
})

describe('resolveRedirectionReasonIds', () => {
  test("crée le motif s'il n'existe pas et retourne son id", async ({
    trpc
  }) => {
    const name = `Nouveau motif ${Date.now()}`

    const { id: socialSupportId } = await trpc.socialWorker.followup.add({
      isMinistry: false,
      familyFileId,
      beneficiaryId,
      subjects: [subjectId],
      medium: 'PlannedInPerson',
      date: new Date(),
      status: 'InProgress',
      socialSupportRedirections: [
        {
          type: 'Other',
          redirectionReasonName: name,
          externalStructureName: 'Structure test'
        }
      ]
    })
    socialSupportIds.push(socialSupportId)

    const reason = await prismaClient.redirectionReason.findFirst({
      where: { name, structureId }
    })
    expect(reason).not.toBeNull()
    expect(reason?.name).toBe(name)
    expect(reason?.structureId).toBe(structureId)
    if (reason) {
      reasonIds.push(reason.id)
    }
  })

  test("retourne l'id existant sans créer de doublon si le motif existe déjà", async ({
    trpc
  }) => {
    const name = `Motif existant ${Date.now()}`
    const existing = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name, structureId, createdById }
    })
    reasonIds.push(existing.id)

    const { id: socialSupportId } = await trpc.socialWorker.followup.add({
      isMinistry: false,
      familyFileId,
      beneficiaryId,
      subjects: [subjectId],
      medium: 'PlannedInPerson',
      date: new Date(),
      status: 'InProgress',
      socialSupportRedirections: [
        {
          type: 'Other',
          redirectionReasonName: name,
          externalStructureName: 'Structure test'
        }
      ]
    })
    socialSupportIds.push(socialSupportId)

    const count = await prismaClient.redirectionReason.count({
      where: { structureId, name }
    })
    expect(count).toBe(1)
  })

  test("retourne une Map vide si aucune redirection n'a de redirectionReasonName", async ({
    users
  }) => {
    const ctx = createSecurityContext(users.socialWorker)
    const result = await resolveRedirectionReasonIds(ctx, [
      { redirectionReasonName: null },
      { redirectionReasonName: undefined },
      {}
    ])
    expect(result.size).toBe(0)
  })

  test('retourne une Map vide si la liste de redirections est null ou undefined', async ({
    users
  }) => {
    const ctx = createSecurityContext(users.socialWorker)
    expect((await resolveRedirectionReasonIds(ctx, null)).size).toBe(0)
    expect((await resolveRedirectionReasonIds(ctx, undefined)).size).toBe(0)
  })

  test("déduplique les noms identiques et ne crée qu'un seul motif", async ({
    trpc
  }) => {
    const name = `Motif dédupliqué ${Date.now()}`

    const { id: socialSupportId } = await trpc.socialWorker.followup.add({
      isMinistry: false,
      familyFileId,
      beneficiaryId,
      subjects: [subjectId],
      medium: 'PlannedInPerson',
      date: new Date(),
      status: 'InProgress',
      socialSupportRedirections: [
        {
          type: 'Other',
          redirectionReasonName: name,
          externalStructureName: 'Structure A'
        },
        {
          type: 'Other',
          redirectionReasonName: name,
          externalStructureName: 'Structure B'
        }
      ]
    })
    socialSupportIds.push(socialSupportId)

    const count = await prismaClient.redirectionReason.count({
      where: { structureId, name }
    })
    expect(count).toBe(1)

    const reason = await prismaClient.redirectionReason.findFirst({
      where: { structureId, name },
      select: { id: true }
    })
    if (reason) {
      reasonIds.push(reason.id)
    }
  })
})

describe('deleteOrphanedRedirectionReasons', () => {
  test("supprime le motif s'il n'est plus référencé par aucune SocialSupportRedirection", async () => {
    const reason = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name: `Motif orphelin ${Date.now()}`, structureId, createdById }
    })
    reasonIds.push(reason.id)

    await deleteOrphanedRedirectionReasons([reason.id])

    const found = await prismaClient.redirectionReason.findUnique({
      where: { id: reason.id }
    })
    expect(found).toBeNull()
    reasonIds = reasonIds.filter(id => id !== reason.id)
  })

  test("ne supprime pas le motif s'il est encore utilisé par une SocialSupportRedirection", async () => {
    const reason = await prismaClient.redirectionReason.create({
      select: { id: true },
      data: { name: `Motif utilisé ${Date.now()}`, structureId, createdById }
    })
    reasonIds.push(reason.id)

    await createSocialSupportWithReason(reason.id)

    await deleteOrphanedRedirectionReasons([reason.id])

    const found = await prismaClient.redirectionReason.findUnique({
      where: { id: reason.id }
    })
    expect(found).not.toBeNull()
  })

  test("ne fait rien si la liste d'ids est vide", async () => {
    await expect(deleteOrphanedRedirectionReasons([])).resolves.not.toThrow()
  })

  test('ignore les ids null et undefined sans erreur', async () => {
    await expect(
      deleteOrphanedRedirectionReasons([null, undefined])
    ).resolves.not.toThrow()
  })
})
