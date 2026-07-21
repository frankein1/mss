import {
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
  fixturesUsers
} from '~/prisma/fixtures'
import { generateFileNumber } from '~/utils/generateFileNumber'

const createHousingHelpRequest = (
  familyFileId: string,
  beneficiaryId: string
) => ({
  isMinistry: false as const,
  familyFileId,
  beneficiaryId,
  date: new Date('2026-03-01'),
  status: SocialSupportStatus.Done,
  externalStructure: 'false' as const
})

const coursorId = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const apfelmannId = fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id

const createdSocialSupportIds: string[] = []

const track = <T extends { socialSupportId: string }>(result: T) => {
  createdSocialSupportIds.push(result.socialSupportId)
  return result
}

afterEach(async () => {
  if (createdSocialSupportIds.length) {
    await prismaClient.socialSupport.deleteMany({
      where: { id: { in: createdSocialSupportIds } }
    })
    createdSocialSupportIds.length = 0
  }
})

describe('Housing Help Request - Create - Authorizations', () => {
  afterEach(async () => {
    await prismaClient.partnerOrganization.deleteMany({
      where: { name: { startsWith: 'HHRCM-' } }
    })
  })

  test('A referent of the family file can create a housing help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.referent.housingHelpRequest.add(
        createHousingHelpRequest(coursorId, coursorId)
      )
    )

    expect(result).toStrictEqual({
      id: result.id,
      socialSupportId: result.socialSupportId
    })
  })

  test('A referent cannot create a housing help request on a family file they are not referent for', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.housingHelpRequest.add(
        createHousingHelpRequest(apfelmannId, apfelmannId)
      )
    ).rejects.toThrow(/familyFile[\s\S]*?no record/im)
  })

  test('A reception agent cannot create a housing help request', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.receptionAgent.housingHelpRequest.add(
        createHousingHelpRequest(apfelmannId, apfelmannId)
      )
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An administrator cannot create a housing help request', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.housingHelpRequest.add(
        createHousingHelpRequest(coursorId, coursorId)
      )
    ).rejects.toThrow(/user routes are not available to admins/i)
  })

  test('A manager cannot create a housing help request on a family file of another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.housingHelpRequest.add(
        createHousingHelpRequest(coursorId, coursorId)
      )
    ).rejects.toThrow(/familyFile[\s\S]*?no record/im)
  })

  test('A manager cannot create a housing help request with a prescribing organization from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrganization =
      await prismaClient.partnerOrganization.create({
        data: {
          structureId: fixtureStructures[FixtureStructure.Autun].id,
          name: 'HHRCM-Organisation Partenaire de la structure d Autun'
        },
        select: { id: true }
      })

    await expect(() =>
      trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(coursorId, coursorId),
        prescribingOrganizationId: otherPartnerOrganization.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A manager cannot create a housing help request with an instructor organization from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrganization =
      await prismaClient.partnerOrganization.create({
        data: {
          structureId: fixtureStructures[FixtureStructure.Autun].id,
          name: 'HHRCM-Organisation Instructrice de la structure d Autun'
        },
        select: { id: true }
      })

    await expect(() =>
      trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(coursorId, coursorId),
        externalStructure: 'true',
        instructorOrganizationId: otherPartnerOrganization.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Housing Help Request - Create - Rich text syntheses', () => {
  test('A manager cannot create a housing help request with a synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(coursorId, coursorId),
        synthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrow(/invalid json was received by the server/i)
  })

  test('A manager cannot create a housing help request with a synthesis that is not valid JSON', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(coursorId, coursorId),
        synthesisRichText: 'not json at all'
      })
    ).rejects.toThrow(/invalid json was received by the server/i)
  })

  test('A manager cannot create a housing help request with a private synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(coursorId, coursorId),
        privateSynthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrow(/invalid json was received by the server/i)
  })
})

describe('Housing Help Request - Create - Notifications', () => {
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
  })

  test('Every referent of the family file except the author is notified', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.housingHelpRequest.add(
        createHousingHelpRequest(familyFileId, beneficiaryId)
      )
    )

    const notifications = await prismaClient.notification.findMany({
      where: { socialSupportId: result.socialSupportId },
      select: { recipientId: true, type: true, itemCreatedById: true }
    })

    expect(notifications).toStrictEqual([
      {
        recipientId: fixturesUsers[FixtureUserRole.Referent].id,
        type: NotificationType.NewFileInstructionElement,
        itemCreatedById: fixturesUsers[FixtureUserRole.StructureManager].id
      }
    ])
  })
})

describe('Housing Help Request - Create - Redirections', () => {
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
      where: { name: { startsWith: 'HHRCM-' } }
    })
  })

  test('A manager can create a housing help request carrying several redirections and their reasons', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          {
            type: SocialSupportRedirectionType.Intern,
            redirectionReasonName: 'HHRCM-Suivi budgétaire'
          },
          {
            type: SocialSupportRedirectionType.Other,
            externalStructureName: 'Association locale',
            redirectionReasonName: 'HHRCM-Accès aux droits'
          }
        ]
      })
    )

    const redirections = await prismaClient.socialSupportRedirection.findMany({
      where: { socialSupportId: result.socialSupportId },
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
        redirectionReason: { name: 'HHRCM-Accès aux droits' }
      },
      {
        type: SocialSupportRedirectionType.Intern,
        externalStructureName: null,
        redirectionReason: { name: 'HHRCM-Suivi budgétaire' }
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
    const result = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          { redirectionReasonName: 'HHRCM-Motif sans type' }
        ]
      })
    )

    const redirections = await prismaClient.socialSupportRedirection.count({
      where: { socialSupportId: result.socialSupportId }
    })

    expect(redirections).toBe(0)
  })
})

describe('Housing Help Request - Create - Status dependent fields', () => {
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
    await prismaClient.partnerOrganization.deleteMany({
      where: { name: { startsWith: 'HHRCM-' } }
    })
  })

  const readHousingHelpRequest = (id: string) =>
    prismaClient.housingHelpRequest.findUniqueOrThrow({
      where: { id },
      select: {
        fileInstruction: {
          select: {
            type: true,
            externalStructure: true,
            examinationDate: true,
            dispatchDate: true,
            decisionDate: true,
            refusalReason: true,
            instructorOrganizationId: true,
            instructorOrganizationContactId: true
          }
        }
      }
    })

  test('Internal structure fields are kept and external fields are dropped for an internal accepted housing help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Accepted,
        externalStructure: 'false',
        examinationDate: new Date('2026-02-15'),
        dispatchDate: new Date('2026-02-20'),
        decisionDate: new Date('2026-03-10')
      })
    )

    const housingHelpRequest = await readHousingHelpRequest(result.id)

    expect(housingHelpRequest.fileInstruction).toMatchObject({
      externalStructure: false,
      examinationDate: expect.any(Date),
      dispatchDate: null,
      decisionDate: expect.any(Date),
      instructorOrganizationId: null
    })
  })

  test('External structure fields are kept and internal fields are dropped for an external accepted housing help request', async ({
    trpc
  }) => {
    const partnerOrganization = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        name: 'HHRCM-Organisation Instructrice'
      },
      select: { id: true }
    })

    const result = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Accepted,
        externalStructure: 'true',
        instructorOrganizationId: partnerOrganization.id,
        examinationDate: new Date('2026-02-15'),
        dispatchDate: new Date('2026-02-20'),
        decisionDate: new Date('2026-03-10')
      })
    )

    const housingHelpRequest = await readHousingHelpRequest(result.id)

    expect(housingHelpRequest.fileInstruction).toMatchObject({
      externalStructure: true,
      examinationDate: null,
      dispatchDate: expect.any(Date),
      decisionDate: expect.any(Date),
      instructorOrganizationId: partnerOrganization.id
    })
  })

  test('The refusal reason is kept only when the status is Refused', async ({
    trpc
  }) => {
    const refused = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Refused,
        refusalReason: 'IncompleteFile',
        decisionDate: new Date('2026-03-10')
      })
    )
    const accepted = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Accepted,
        refusalReason: 'IncompleteFile',
        decisionDate: new Date('2026-03-10')
      })
    )

    expect(
      (await readHousingHelpRequest(refused.id)).fileInstruction
    ).toMatchObject({
      refusalReason: 'IncompleteFile',
      decisionDate: expect.any(Date)
    })
    expect(
      (await readHousingHelpRequest(accepted.id)).fileInstruction
    ).toMatchObject({
      refusalReason: null,
      decisionDate: expect.any(Date)
    })
  })

  test('Instructor organization and contact are both nulled for an internal structure even when sent', async ({
    trpc
  }) => {
    const partnerOrganization = await prismaClient.partnerOrganization.create({
      data: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        name: 'HHRCM-Organisation Instructrice Interne'
      },
      select: { id: true }
    })

    const contact = await prismaClient.partnerOrganizationContact.create({
      data: {
        name: 'HHRCM-Contact Instructeur',
        partnerId: partnerOrganization.id
      },
      select: { id: true }
    })

    const result = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        externalStructure: 'false',
        instructorOrganizationId: partnerOrganization.id,
        instructorOrganizationContactId: contact.id
      })
    )

    const housingHelpRequest = await readHousingHelpRequest(result.id)

    expect(housingHelpRequest.fileInstruction).toMatchObject({
      externalStructure: false,
      instructorOrganizationId: null,
      instructorOrganizationContactId: null
    })
  })
})

describe('Housing Help Request - Create - Ministry', () => {
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
      where: { lastName: 'HHRCM-MINISTRE' }
    })
  })

  test('The minister is connected only when the housing help request is flagged as ministry', async ({
    trpc
  }) => {
    const minister = await prismaClient.ministerEntity.create({
      data: {
        firstName: 'Camille',
        lastName: 'HHRCM-MINISTRE',
        function: 'Ministre des Solidarités',
        government: 'Gouvernement de test',
        status: MinisterStatus.Current
      },
      select: { id: true }
    })

    const ministryHousingHelpRequest = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        isMinistry: true,
        ministerId: minister.id
      })
    )
    const regularHousingHelpRequest = track(
      await trpc.structureManager.housingHelpRequest.add({
        ...createHousingHelpRequest(familyFileId, beneficiaryId),
        ministerId: minister.id
      })
    )

    const socialSupports = await prismaClient.socialSupport.findMany({
      where: {
        id: {
          in: [
            ministryHousingHelpRequest.socialSupportId,
            regularHousingHelpRequest.socialSupportId
          ]
        }
      },
      select: { id: true, ministerId: true, socialSupportType: true }
    })

    expect(socialSupports).toEqual(
      expect.arrayContaining([
        {
          id: ministryHousingHelpRequest.socialSupportId,
          ministerId: minister.id,
          socialSupportType: SocialSupportType.HelpRequestHousing
        },
        {
          id: regularHousingHelpRequest.socialSupportId,
          ministerId: null,
          socialSupportType: SocialSupportType.HelpRequestHousing
        }
      ])
    )
  })
})
