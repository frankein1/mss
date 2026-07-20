import {
  FileInstructionType,
  MinisterStatus,
  NotificationType,
  PaymentMethod,
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

const createHelpRequest = (familyFileId: string, beneficiaryId: string) => ({
  isMinistry: false as const,
  familyFileId,
  beneficiaryId,
  subjectId,
  date: new Date('2026-03-01'),
  status: SocialSupportStatus.Done,
  financialSupport: false,
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

describe('Help Request - Create - Authorizations', () => {
  afterEach(async () => {
    await prismaClient.partnerOrganization.deleteMany({
      where: { name: { startsWith: 'HRCM-' } }
    })
  })

  test('A referent of the family file can create a help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.referent.helpRequest.add(
        createHelpRequest(coursorId, coursorId)
      )
    )

    expect(result).toStrictEqual({
      id: result.id,
      socialSupportId: result.socialSupportId
    })
  })

  test('A referent cannot create a help request on a family file they are not referent for', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.referent.helpRequest.add(createHelpRequest(apfelmannId, apfelmannId))
    ).rejects.toThrowError(/familyFile[\s\S]*?no record/im)
  })

  test('A reception agent cannot create a help request', async ({ trpc }) => {
    await expect(() =>
      trpc.receptionAgent.helpRequest.add(
        createHelpRequest(apfelmannId, apfelmannId)
      )
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('An administrator cannot create a help request', async ({ trpc }) => {
    await expect(() =>
      trpc.administrator.helpRequest.add(
        createHelpRequest(coursorId, coursorId)
      )
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })

  test('A manager cannot create a help request on a family file of another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.helpRequest.add(
        createHelpRequest(coursorId, coursorId)
      )
    ).rejects.toThrowError(/familyFile[\s\S]*?no record/im)
  })

  test('A manager cannot create a help request with a prescribing organization from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrganization =
      await prismaClient.partnerOrganization.create({
        data: {
          structureId: fixtureStructures[FixtureStructure.Autun].id,
          name: 'HRCM-Organisation Partenaire de la structure d Autun'
        },
        select: { id: true }
      })

    await expect(() =>
      trpc.structureManager.helpRequest.add({
        ...createHelpRequest(coursorId, coursorId),
        prescribingOrganizationId: otherPartnerOrganization.id
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A manager cannot create a help request with an instructor organization from another structure', async ({
    trpc
  }) => {
    const otherPartnerOrganization =
      await prismaClient.partnerOrganization.create({
        data: {
          structureId: fixtureStructures[FixtureStructure.Autun].id,
          name: 'HRCM-Organisation Instructrice de la structure d Autun'
        },
        select: { id: true }
      })

    await expect(() =>
      trpc.structureManager.helpRequest.add({
        ...createHelpRequest(coursorId, coursorId),
        externalStructure: 'true',
        instructorOrganizationId: otherPartnerOrganization.id
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})

describe('Help Request - Create - Rich text syntheses', () => {
  test('A manager cannot create a help request with a synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.helpRequest.add({
        ...createHelpRequest(coursorId, coursorId),
        synthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })

  test('A manager cannot create a help request with a synthesis that is not valid JSON', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.helpRequest.add({
        ...createHelpRequest(coursorId, coursorId),
        synthesisRichText: 'not json at all'
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })

  test('A manager cannot create a help request with a private synthesis that is not a valid rich text document', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManager.helpRequest.add({
        ...createHelpRequest(coursorId, coursorId),
        privateSynthesisRichText: JSON.stringify({ type: 'notATiptapNode' })
      })
    ).rejects.toThrowError(/invalid json was received by the server/i)
  })
})

describe('Help Request - Create - Notifications', () => {
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
      await trpc.structureManager.helpRequest.add(
        createHelpRequest(familyFileId, beneficiaryId)
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

describe('Help Request - Create - Redirections', () => {
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
      where: { name: { startsWith: 'HRCM-' } }
    })
  })

  test('A manager can create a help request carrying several redirections and their reasons', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          {
            type: SocialSupportRedirectionType.Intern,
            redirectionReasonName: 'HRCM-Suivi budgétaire'
          },
          {
            type: SocialSupportRedirectionType.Other,
            externalStructureName: 'Association locale',
            redirectionReasonName: 'HRCM-Accès aux droits'
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
        redirectionReason: { name: 'HRCM-Accès aux droits' }
      },
      {
        type: SocialSupportRedirectionType.Intern,
        externalStructureName: null,
        redirectionReason: { name: 'HRCM-Suivi budgétaire' }
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
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        socialSupportRedirections: [
          { redirectionReasonName: 'HRCM-Motif sans type' }
        ]
      })
    )

    const redirections = await prismaClient.socialSupportRedirection.count({
      where: { socialSupportId: result.socialSupportId }
    })

    expect(redirections).toBe(0)
  })
})

describe('Help Request - Create - Status dependent fields', () => {
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

  const readHelpRequest = (id: string) =>
    prismaClient.helpRequest.findUniqueOrThrow({
      where: { id },
      select: {
        financialSupport: true,
        isRefundable: true,
        askedAmount: true,
        allocatedAmount: true,
        paymentMethod: true,
        paymentDate: true,
        fileInstruction: {
          select: {
            type: true,
            externalStructure: true,
            examinationDate: true,
            dispatchDate: true,
            decisionDate: true,
            refusalReason: true,
            instructorOrganizationId: true
          }
        }
      }
    })

  test('Financial fields and internal structure fields are kept for a financial accepted internal help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        financialSupport: true,
        status: SocialSupportStatus.Accepted,
        externalStructure: 'false',
        askedAmount: 500,
        allocatedAmount: 300,
        paymentMethod: PaymentMethod.WireTransfer,
        paymentDate: new Date('2026-04-01'),
        examinationDate: new Date('2026-02-15'),
        dispatchDate: new Date('2026-02-20'),
        decisionDate: new Date('2026-03-10'),
        isRefundable: 'true'
      })
    )

    const helpRequest = await readHelpRequest(result.id)

    expect(helpRequest).toMatchObject({
      financialSupport: true,
      isRefundable: true,
      askedAmount: expect.any(Object),
      allocatedAmount: expect.any(Object),
      paymentMethod: PaymentMethod.WireTransfer,
      paymentDate: expect.any(Date),
      fileInstruction: {
        type: FileInstructionType.Financial,
        externalStructure: false,
        examinationDate: expect.any(Date),
        dispatchDate: null,
        decisionDate: expect.any(Date),
        refusalReason: null
      }
    })
  })

  test('Payment fields are dropped and dispatch is kept for a financial accepted external help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        financialSupport: true,
        status: SocialSupportStatus.Accepted,
        externalStructure: 'true',
        askedAmount: 500,
        allocatedAmount: 300,
        paymentMethod: PaymentMethod.WireTransfer,
        paymentDate: new Date('2026-04-01'),
        examinationDate: new Date('2026-02-15'),
        dispatchDate: new Date('2026-02-20'),
        decisionDate: new Date('2026-03-10')
      })
    )

    const helpRequest = await readHelpRequest(result.id)

    expect(helpRequest).toMatchObject({
      financialSupport: true,
      askedAmount: expect.any(Object),
      allocatedAmount: expect.any(Object),
      paymentMethod: null,
      paymentDate: null,
      fileInstruction: {
        type: FileInstructionType.Financial,
        externalStructure: true,
        examinationDate: null,
        dispatchDate: expect.any(Date),
        decisionDate: expect.any(Date)
      }
    })
  })

  test('All financial fields are nulled for a non-financial help request', async ({
    trpc
  }) => {
    const result = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        financialSupport: false,
        status: SocialSupportStatus.Done,
        askedAmount: 500,
        allocatedAmount: 300,
        paymentMethod: PaymentMethod.WireTransfer,
        paymentDate: new Date('2026-04-01'),
        isRefundable: 'true'
      })
    )

    const helpRequest = await readHelpRequest(result.id)

    expect(helpRequest).toMatchObject({
      financialSupport: false,
      isRefundable: null,
      askedAmount: null,
      allocatedAmount: null,
      paymentMethod: null,
      paymentDate: null,
      fileInstruction: {
        type: FileInstructionType.Other
      }
    })
  })

  test('The refusal reason is kept only when the status is Refused', async ({
    trpc
  }) => {
    const refused = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Refused,
        refusalReason: 'IncompleteFile',
        decisionDate: new Date('2026-03-10')
      })
    )
    const accepted = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        status: SocialSupportStatus.Accepted,
        refusalReason: 'IncompleteFile',
        decisionDate: new Date('2026-03-10')
      })
    )

    expect((await readHelpRequest(refused.id)).fileInstruction).toMatchObject({
      refusalReason: 'IncompleteFile',
      decisionDate: expect.any(Date)
    })
    expect((await readHelpRequest(accepted.id)).fileInstruction).toMatchObject({
      refusalReason: null,
      decisionDate: expect.any(Date)
    })
  })
})

describe('Help Request - Create - Ministry', () => {
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
      where: { lastName: 'HRCM-MINISTRE' }
    })
  })

  test('The minister is connected only when the help request is flagged as ministry', async ({
    trpc
  }) => {
    const minister = await prismaClient.ministerEntity.create({
      data: {
        firstName: 'Camille',
        lastName: 'HRCM-MINISTRE',
        function: 'Ministre des Solidarités',
        government: 'Gouvernement de test',
        status: MinisterStatus.Current
      },
      select: { id: true }
    })

    const ministryHelpRequest = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        isMinistry: true,
        ministerId: minister.id
      })
    )
    const regularHelpRequest = track(
      await trpc.structureManager.helpRequest.add({
        ...createHelpRequest(familyFileId, beneficiaryId),
        ministerId: minister.id
      })
    )

    const socialSupports = await prismaClient.socialSupport.findMany({
      where: {
        id: {
          in: [
            ministryHelpRequest.socialSupportId,
            regularHelpRequest.socialSupportId
          ]
        }
      },
      select: { id: true, ministerId: true, socialSupportType: true }
    })

    expect(socialSupports).toEqual(
      expect.arrayContaining([
        {
          id: ministryHelpRequest.socialSupportId,
          ministerId: minister.id,
          socialSupportType: SocialSupportType.HelpRequest
        },
        {
          id: regularHelpRequest.socialSupportId,
          ministerId: null,
          socialSupportType: SocialSupportType.HelpRequest
        }
      ])
    )
  })
})
