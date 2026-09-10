import { expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import {
  createStructure,
  createUsers,
  createFamilyFile,
  createBeneficiary,
  createSocialSupports,
  TestFixtureUsers,
  TestFixturePartnerOrganizations
} from '~~/test/server/fixtures'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'
import dayjs from 'dayjs'

// Mock email sending context
mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return {
      app: { baseURL: '/' },
      public: {
        email: { from: 'mss@example.com' }
      },
      document: {
        useS3Storage: true
      }
    }
  }
})

let structureId: string
let userReferentId: string
let userStructureManagerId: string
let beneficiaryId: string
let beneficiaryFileNumber: string
let familyFileId: string
let documentContentIds: string[]
let partnerOrganizationId: string
let partnerOrganizationContactId: string

beforeEach(async () => {
  const date = dayjs(dayjs()).subtract(7, 'month').toDate()
  // The structure must have gone through the whole alert email cycle to be disabled
  // (see app/utils/structure/canBeDisabled.ts)
  const structure = await createStructure(date, {
    deactivationAlertEmail: 2,
    deactivationAlertEmailDate: dayjs().subtract(5, 'week').toDate()
  })
  const users = await createUsers(date, structure.id)
  const familyFile = await createFamilyFile(
    date,
    structure.id,
    users[TestFixtureUsers.Referent].id,
    users[TestFixtureUsers.StructureManager].id
  )

  const beneficiary = await createBeneficiary(
    date,
    familyFile.id,
    structure.id,
    users[TestFixtureUsers.Referent].id,
    generateFileNumber()
  )

  const franceTravailId =
    users[TestFixtureUsers.Referent].createdPartnerOrganizations[
      TestFixturePartnerOrganizations.FranceTravail
    ]?.id
  const franceTravailContactId =
    users[TestFixtureUsers.Referent].createdPartnerOrganizations[
      TestFixturePartnerOrganizations.FranceTravail
    ]?.contacts[TestFixturePartnerOrganizations.FranceTravail]?.id
  if (!franceTravailId || !franceTravailContactId) {
    throw new Error('partner: wrong index')
  }

  await createSocialSupports(
    date,
    familyFile.id,
    beneficiary.id,
    structure.id,
    users[TestFixtureUsers.Referent].id,
    users[TestFixtureUsers.StructureManager].id,
    franceTravailId,
    franceTravailContactId,
    undefined,
    beneficiary.documents.map(d => d.key)
  )

  structureId = structure.id
  userReferentId = users[TestFixtureUsers.Referent].id
  userStructureManagerId = users[TestFixtureUsers.StructureManager].id
  beneficiaryId = beneficiary.id
  beneficiaryFileNumber = beneficiary.fileNumber
  familyFileId = familyFile.id
  documentContentIds = beneficiary.documents.map(
    d => d.documentContent?.id || ''
  )
  partnerOrganizationId = franceTravailId
  partnerOrganizationContactId = franceTravailContactId
})

afterEach(async () => await resetDatabase(structureId))

test('Structure - Disable - Administrator should be able to deactivate structure and remove all personal data associated to it', async ({
  trpc
}) => {
  // Snapshot what the fixtures set up, so the assertions below cannot pass vacuously
  const [linkedDocumentsBefore, subjectsBefore] = await Promise.all([
    prismaClient.socialSupport.count({
      where: { structureId, documents: { some: {} } }
    }),
    prismaClient.socialSupportSubject.count({
      where: { ownedByStructureId: structureId }
    })
  ])
  expect(linkedDocumentsBefore).toBeGreaterThan(0)
  expect(subjectsBefore).toBeGreaterThan(0)

  await trpc.administrator.admin.disableStructure({ id: structureId })

  const structure = await prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId }
  })

  expect(structure.disabled).toBe(true)
  expect(structure.name).toBe('')
  expect(structure.email).toBe('')
  expect(structure.externalRdvspActive).toBe(false)
  expect(structure.externalRdvspId).toBeNull()

  const [
    comments,
    notifications,
    documents,
    documentsContent,
    relatives,
    budget,
    accounts
  ] = await Promise.all([
    prismaClient.comment.findMany({
      where: {
        createdById: { in: [userReferentId, userStructureManagerId] }
      }
    }),
    prismaClient.notification.findMany({
      where: { structureId }
    }),
    prismaClient.document.findMany({
      where: { beneficiaryId }
    }),
    prismaClient.documentContent.findMany({
      where: { id: { in: documentContentIds } }
    }),
    prismaClient.beneficiaryRelative.findMany({
      where: { beneficiaryId }
    }),
    prismaClient.budget.findMany({
      where: { familyFileId }
    }),
    prismaClient.account.findMany({
      where: { userId: { in: [userReferentId, userStructureManagerId] } }
    })
  ])
  expect(comments).toHaveLength(0)
  expect(notifications).toHaveLength(0)
  expect(documents).toHaveLength(0)
  expect(documentsContent).toHaveLength(0)
  expect(relatives).toHaveLength(0)
  expect(budget).toHaveLength(0)
  expect(accounts).toHaveLength(0)

  const socialSupports = await prismaClient.socialSupport.findMany({
    where: { familyFileId },
    select: {
      privateSynthesis: true,
      status: true,
      socialSupportType: true,
      followup: {
        select: {
          duration: true,
          updated: true,
          prescribingOrganizationId: true,
          prescribingOrganizationContactId: true
        }
      },
      documents: {
        select: { key: true }
      },
      fileInstruction: {
        select: {
          externalStructure: true,
          refusalReason: true,
          type: true,
          updated: true,
          instructorOrganizationId: true,
          instructorOrganizationContactId: true,
          helpRequest: {
            select: {
              subjectId: true,
              financialSupport: true,
              askedAmount: true,
              allocatedAmount: true,
              prescribingOrganizationId: true,
              prescribingOrganizationContactId: true
            }
          },
          housingHelpRequest: {
            select: {
              prescribingOrganizationId: true,
              prescribingOrganizationContactId: true,
              isFirst: true,
              firstOpeningDate: true,
              askedHousing: true,
              uniqueId: true,
              taxHouseholdAdditionalInformation: true,
              maxRent: true,
              maxCharges: true,
              housingType: true,
              roomCount: true,
              isPmr: true,
              reason: true,
              lowIncomeHousingType: true,
              handlingDate: true
            }
          }
        }
      }
    }
  })
  expect(socialSupports).toHaveLength(3)
  socialSupports.map(ss => {
    expect(ss.privateSynthesis).toBeNull()
    expect(ss.status).toBeOneOf(['InProgress', 'Refused'])
    expect(ss.socialSupportType).toBeOneOf(['HelpRequest', 'Followup'])
  })

  const followups = socialSupports
    .filter(ss => ss.followup)
    .map(ss => ss.followup)
  expect(followups).toHaveLength(1)
  followups.map(f => {
    expect(f?.duration).toBeNull()
    expect(f?.updated).not.toBeNull()
  })

  const fileInstructions = socialSupports
    .filter(ss => ss.fileInstruction)
    .map(ss => ss.fileInstruction)
  expect(fileInstructions).toHaveLength(2)
  fileInstructions.map(fi => {
    expect(fi?.externalStructure).toBe(false)
    expect(fi?.refusalReason).toBe(null)
    expect(fi?.type).toBeOneOf(['Financial', 'Housing'])
    expect(fi?.updated).not.toBeNull()
    expect(fi?.instructorOrganizationId).toBeNull()
    expect(fi?.instructorOrganizationContactId).toBeNull()
  })

  const helpRequests = socialSupports
    .filter(ss => ss.fileInstruction?.helpRequest)
    .map(ss => ss.fileInstruction?.helpRequest)
  expect(helpRequests).toHaveLength(1)
  helpRequests.map(hr => {
    expect(hr?.subjectId).not.toBeNull()
    expect(hr?.financialSupport).toBe(true)
    expect(hr?.askedAmount).toBeNull()
    expect(hr?.allocatedAmount).toBeNull()
    expect(hr?.prescribingOrganizationId).toBeNull()
    expect(hr?.prescribingOrganizationContactId).toBeNull()
  })

  const housingHelpRequests = socialSupports
    .filter(ss => ss.fileInstruction?.housingHelpRequest)
    .map(ss => ss.fileInstruction?.housingHelpRequest)
  expect(housingHelpRequests).toHaveLength(1)
  housingHelpRequests.map(hhr => {
    expect(hhr?.prescribingOrganizationId).toBeNull()
    expect(hhr?.prescribingOrganizationContactId).toBeNull()
    expect(hhr?.isFirst).toBe(false)
    expect(hhr?.firstOpeningDate).toBeNull()
    expect(hhr?.askedHousing).toHaveLength(0)
    expect(hhr?.uniqueId).toBeNull()
    expect(hhr?.taxHouseholdAdditionalInformation).toBeNull()
    expect(hhr?.maxRent).toBeNull()
    expect(hhr?.maxCharges).toBeNull()
    expect(hhr?.housingType).toHaveLength(0)
    expect(hhr?.roomCount).toHaveLength(0)
    expect(hhr?.isPmr).toBeNull()
    expect(hhr?.reason).toBeNull()
    expect(hhr?.lowIncomeHousingType).toHaveLength(0)
    expect(hhr?.handlingDate).toBeNull()
  })

  // Documents are deleted, so the links to the social supports go with them
  socialSupports.map(ss => expect(ss.documents).toHaveLength(0))

  // Social support subjects and partner organizations carry no beneficiary data:
  // they are kept, only the references from the social supports are cleared
  const [
    socialSupportSubjects,
    partnerOrganization,
    partnerOrganizationContact
  ] = await Promise.all([
    prismaClient.socialSupportSubject.findMany({
      where: { ownedByStructureId: structureId }
    }),
    prismaClient.partnerOrganization.findUnique({
      where: { id: partnerOrganizationId }
    }),
    prismaClient.partnerOrganizationContact.findUnique({
      where: { id: partnerOrganizationContactId }
    })
  ])
  expect(socialSupportSubjects).toHaveLength(subjectsBefore)
  expect(partnerOrganization).not.toBeNull()
  expect(partnerOrganizationContact).not.toBeNull()

  const beneficiaries = await prismaClient.beneficiary.findMany({
    where: { structureId }
  })
  expect(beneficiaries).toHaveLength(1)
  beneficiaries.map(b => {
    expect(b.firstName).toBeNull()
    expect(b.birthName).toBeNull()
    expect(b.usualName).toBeNull()
    expect(b.street).toBeNull()
    expect(b.email).toBeNull()
    expect(b.fileNumber).toBeOneOf([beneficiaryFileNumber])
    expect(b.status).toBeOneOf(['Deceased'])
  })

  const users = await prismaClient.user.findMany({
    where: { structureId }
  })
  expect(users).toHaveLength(2)
  users.map(u => {
    expect(u.firstName).toBe('')
    expect(u.lastName).toBe('')
    expect(u.email).toMatch(/@disabled-structure-.*\.org$/)
    expect(u.status).toBe('Disabled')
    expect(u.firstAccess).not.toBeNull()
    expect(u.lastAccess).not.toBeNull()
  })
})

test('Structure - Disable - Administrator cannot deactivate structure with activity in the last 6 months', async ({
  trpc
}) => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: { lastAccess: dayjs(dayjs()).subtract(5, 'month').toDate() }
  })

  await expect(() =>
    trpc.administrator.admin.disableStructure({ id: structureId })
  ).rejects.toThrow(/cannot disable/i)
})

test('Structure - Disable - Administrator cannot deactivate structure created in the last 6 months', async ({
  trpc
}) => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: {
      created: dayjs(dayjs()).subtract(5, 'month').toDate(),
      lastAccess: null
    }
  })

  await expect(() =>
    trpc.administrator.admin.disableStructure({ id: structureId })
  ).rejects.toThrow(/cannot disable/i)
})

async function resetDatabase(sid: string) {
  if (sid) {
    await prismaClient.familyFile.deleteMany({ where: { structureId: sid } })
    await prismaClient.user.deleteMany({ where: { structureId: sid } })
    await prismaClient.structure.delete({ where: { id: sid } })
  }
}

test('Structure - Disable - Administrator cannot deactivate an active structure without a code', async ({
  trpc
}) => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: { lastAccess: new Date() }
  })

  await expect(() =>
    trpc.administrator.admin.disableStructure({ id: structureId })
  ).rejects.toThrow(/cannot disable/i)
})

test('Structure - Disable - Administrator cannot deactivate an active structure with a wrong code', async ({
  trpc
}) => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: { lastAccess: new Date() }
  })
  await trpc.administrator.admin.authorizeDisableStructure({ id: structureId })

  await expect(() =>
    trpc.administrator.admin.disableStructure({
      id: structureId,
      code: '000000000000'
    })
  ).rejects.toThrow(/invalid code/i)

  const structure = await prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId }
  })
  expect(structure.disabled).toBe(false)
})

test('Structure - Disable - Administrator can deactivate an active structure with the emailed code', async ({
  trpc
}) => {
  await prismaClient.structure.update({
    where: { id: structureId },
    data: { lastAccess: new Date() }
  })

  await trpc.administrator.admin.authorizeDisableStructure({ id: structureId })

  const admin = await prismaClient.user.findUniqueOrThrow({
    where: { id: fixturesUsers[FixtureUserRole.Administrator].id },
    select: { authorizationCode: true, authorizationCodeValidity: true }
  })
  expect(admin.authorizationCode).toHaveLength(VALIDATION_CODE_LENGTH)
  expect(admin.authorizationCodeValidity).not.toBeNull()

  await trpc.administrator.admin.disableStructure({
    id: structureId,
    code: admin.authorizationCode!
  })

  const structure = await prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId }
  })
  expect(structure.disabled).toBe(true)

  // The code is single use
  const afterUse = await prismaClient.user.findUniqueOrThrow({
    where: { id: fixturesUsers[FixtureUserRole.Administrator].id },
    select: { authorizationCode: true }
  })
  expect(afterUse.authorizationCode).toBeNull()
})
