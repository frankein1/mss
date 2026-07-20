import {
  FollowupMedium,
  MinisterStatus,
  NotificationType,
  SocialSupportRedirectionType,
  SocialSupportStatus,
  SocialSupportType
} from '@prisma/client'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { test } from '~/test/server/test-utils'
import { createBeneficiary, createFamilyFile } from '~/test/server/fixtures'
import {
  FixtureBeneficiary,
  FixtureStructure,
  FixtureUserRole,
  fixtureStructures,
  fixturesBeneficiaries,
  fixturesSocialSupportSubjects,
  fixturesUsers
} from '~/prisma/fixtures'
import { generateFileNumber } from '~/utils/generateFileNumber'

const subjectId = fixturesSocialSupportSubjects[0].id

const createFollowup = (familyFileId: string, beneficiaryId: string) => ({
  isMinistry: false as const,
  familyFileId,
  beneficiaryId,
  subjects: [subjectId],
  medium: FollowupMedium.PlannedInPerson,
  date: new Date('2026-03-01'),
  status: SocialSupportStatus.Done
})

// COURSOR: referents = StructureManager + Referent
const coursorId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
// APFELMANN: referents = SocialWorker only — the Referent user is not on it
const apfelmannId = fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id

const createdSocialSupportIds: string[] = []

const track = <T extends { id: string }>(followup: T) => {
  createdSocialSupportIds.push(followup.id)
  return followup
}

afterEach(async () => {
  if (createdSocialSupportIds.length) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: createdSocialSupportIds } }
    })
    createdSocialSupportIds.length = 0
  }
})

describe('Followup - Create - Authorizations', () => {
  afterEach(async () => {
    await prismaClient.partnerOrganization.deleteMany({
      where: { name: { startsWith: 'FCM-' } }
    })
  })

  test('A referent of the family file can create a followup', async ({
    trpc
  }) => {
    const followup = track(
      await trpc.referent.followup.add(createFollowup(coursorId, coursorId))
    )

    expect(followup).toStrictEqual({ id: followup.id })
  })

  test('A referent cannot create a followup on a family file they are not referent for', async ({
    trpc
  }) => {
    // Blocked by FamilyFileConstraints
    await expect(() =>
      trpc.referent.followup.add(createFollowup(apfelmannId, apfelmannId))
    ).rejects.toThrowError(/familyFile[\s\S]*?no record/im)
  })

  test('A reception agent can create a followup on any family file of their structure', async ({
    trpc
  }) => {
    const followup = track(
      await trpc.receptionAgent.followup.add(
        createFollowup(apfelmannId, apfelmannId)
      )
    )

    expect(followup).toStrictEqual({ id: followup.id })
  })

  test('An administrator cannot create a followup', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.followup.add(createFollowup(coursorId, coursorId))
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })

  test('A manager cannot create a followup on a family file of another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.followup.add(
        createFollowup(coursorId, coursorId)
      )
    ).rejects.toThrowError(/familyFile[\s\S]*?no record/im)
  })

  test('A manager cannot create a followup with a prescribing organization from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrganization =
      await prismaClient.partnerOrganization.create({
        data: {
          structureId: fixtureStructures[FixtureStructure.Autun].id,
          name: 'FCM-Organisation Partenaire de la structure d Autun'
        },
        select: { id: true }
      })

    await expect(() =>
      trpc.structureManager.followup.add({
        ...createFollowup(coursorId, coursorId),
        prescribingOrganizationId: otherPartnerOrganization.id
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})

describe('Followup - Create - Rich text syntheses', () => {
  test('A manager cannot create a followup with a synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.followup.add({
        ...createFollowup(coursorId, coursorId),
        synthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })

  test('A manager cannot create a followup with a synthesis that is not valid JSON', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.followup.add({
        ...createFollowup(coursorId, coursorId),
        synthesisRichText: 'not json at all'
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })

  test('A manager cannot create a followup with a private synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.followup.add({
        ...createFollowup(coursorId, coursorId),
        privateSynthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })
})

describe('Followup - Create - Notifications', () => {
  let familyFileId: string
  let beneficiaryId: string

  beforeEach(async () => {
    const date = dayjs().subtract(1, 'month').toDate()
    // Connects exactly two referents: the StructureManager and the Referent
    const familyFile = await createFamilyFile(date)
    const beneficiary = await createBeneficiary(
      date,
      familyFile.id,
      undefined,
      undefined,
      generateFileNumber()
    )
    familyFileId = familyFile.id
    beneficiaryId = beneficiary.id
  })

  afterEach(async () => {
    await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
    await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  })

  test('Every referent of the family file except the author is notified', async ({
    trpc
  }) => {
    const followup = track(
      await trpc.structureManager.followup.add(
        createFollowup(familyFileId, beneficiaryId)
      )
    )

    const notifications = await prismaClient.notification.findMany({
      where: { socialSupportId: followup.id },
      select: { recipientId: true, type: true, itemCreatedById: true }
    })

    expect(notifications).toStrictEqual([
      {
        recipientId: fixturesUsers[FixtureUserRole.Referent].id,
        type: NotificationType.NewFollowupElement,
        itemCreatedById: fixturesUsers[FixtureUserRole.StructureManager].id
      }
    ])
  })
})

describe('Followup - Create - Redirections', () => {
  let familyFileId: string
  let beneficiaryId: string

  beforeEach(async () => {
    const date = dayjs().subtract(1, 'month').toDate()
    const familyFile = await createFamilyFile(date)
    const beneficiary = await createBeneficiary(
      date,
      familyFile.id,
      undefined,
      undefined,
      generateFileNumber()
    )
    familyFileId = familyFile.id
    beneficiaryId = beneficiary.id
  })

  afterEach(async () => {
    await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
    await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
    await prismaClient.redirectionReason.deleteMany({
      where: { name: { startsWith: 'FCM-' } }
    })
  })

  test('A manager can create a followup carrying several redirections and their reasons', async ({
    trpc
  }) => {
    const followup = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          {
            type: SocialSupportRedirectionType.Intern,
            redirectionReasonName: 'FCM-Suivi budgétaire'
          },
          {
            type: SocialSupportRedirectionType.Other,
            externalStructureName: 'Association locale',
            redirectionReasonName: 'FCM-Accès aux droits'
          }
        ]
      })
    )

    const redirections = await prismaClient.socialSupportRedirection.findMany({
      where: { socialSupportId: followup.id },
      select: {
        type: true,
        externalStructureName: true,
        redirectionReason: { select: { name: true } }
      },
      orderBy: { redirectionReason: { name: 'asc' } }
    })

    expect(redirections).toStrictEqual([
      {
        type: SocialSupportRedirectionType.Other,
        externalStructureName: 'Association locale',
        redirectionReason: { name: 'FCM-Accès aux droits' }
      },
      {
        type: SocialSupportRedirectionType.Intern,
        externalStructureName: null,
        redirectionReason: { name: 'FCM-Suivi budgétaire' }
      }
    ])
  })

  test('A redirection without a type is silently dropped', async ({ trpc }) => {
    // TODO: `type` must be made compulsory in SocialSupportRedirectionSchema.
    // It is currently `.nullish()`, and the redirection form pushes rows as
    // `{ id }`, so a user who types a reason without picking a type loses the
    // redirection with no error — and the reason is still added to the
    // structure catalog, where nothing references it. This test pins the
    // current behaviour; it should be inverted to expect a validation error
    // once the schema is fixed.
    const followup = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          { redirectionReasonName: 'FCM-Motif sans type' }
        ]
      })
    )

    const redirections = await prismaClient.socialSupportRedirection.count({
      where: { socialSupportId: followup.id }
    })

    expect(redirections).toBe(0)
  })
})

describe('Followup - Create - Medium dependent fields', () => {
  let familyFileId: string
  let beneficiaryId: string

  beforeEach(async () => {
    const date = dayjs().subtract(1, 'month').toDate()
    const familyFile = await createFamilyFile(date)
    const beneficiary = await createBeneficiary(
      date,
      familyFile.id,
      undefined,
      undefined,
      generateFileNumber()
    )
    familyFileId = familyFile.id
    beneficiaryId = beneficiary.id
  })

  afterEach(async () => {
    await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
    await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
    await prismaClient.ministerEntity.deleteMany({
      where: { lastName: 'FCM-MINISTRE' }
    })
  })

  const readFollowup = (id: string) =>
    prismaClient.followup.findUniqueOrThrow({
      where: { socialSupportId: id },
      select: { medium: true, place: true, thirdPersonName: true }
    })

  test('The place is kept for an external appointment and dropped for any other medium', async ({
    trpc
  }) => {
    const externalAppointment = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        medium: FollowupMedium.ExternalAppointment,
        place: 'Mairie de Dijon'
      })
    )
    const phoneCall = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        medium: FollowupMedium.PhoneCall,
        place: 'Mairie de Dijon'
      })
    )

    expect(await readFollowup(externalAppointment.id)).toMatchObject({
      place: 'Mairie de Dijon'
    })
    expect(await readFollowup(phoneCall.id)).toMatchObject({ place: null })
  })

  test('The third person name is kept for a third party followup and dropped for any other medium', async ({
    trpc
  }) => {
    const thirdParty = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        medium: FollowupMedium.ThirdParty,
        thirdPersonName: 'Madame Dupont'
      })
    )
    const sms = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        medium: FollowupMedium.Sms,
        thirdPersonName: 'Madame Dupont'
      })
    )

    expect(await readFollowup(thirdParty.id)).toMatchObject({
      thirdPersonName: 'Madame Dupont'
    })
    expect(await readFollowup(sms.id)).toMatchObject({ thirdPersonName: null })
  })

  test('The minister is connected only when the followup is flagged as ministry', async ({
    trpc
  }) => {
    const minister = await prismaClient.ministerEntity.create({
      data: {
        firstName: 'Camille',
        lastName: 'FCM-MINISTRE',
        function: 'Ministre des Solidarités',
        government: 'Gouvernement de test',
        status: MinisterStatus.Current
      },
      select: { id: true }
    })

    const ministryFollowup = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        isMinistry: true,
        ministerId: minister.id
      })
    )
    const regularFollowup = track(
      await trpc.structureManager.followup.add({
        ...createFollowup(familyFileId, beneficiaryId),
        ministerId: minister.id
      })
    )

    const socialSupports = await prismaClient.socialSupport.findMany({
      where: { id: { in: [ministryFollowup.id, regularFollowup.id] } },
      select: { id: true, ministerId: true, socialSupportType: true }
    })

    expect(socialSupports).toEqual(
      expect.arrayContaining([
        {
          id: ministryFollowup.id,
          ministerId: minister.id,
          socialSupportType: SocialSupportType.Followup
        },
        {
          id: regularFollowup.id,
          ministerId: null,
          socialSupportType: SocialSupportType.Followup
        }
      ])
    )
  })
})
