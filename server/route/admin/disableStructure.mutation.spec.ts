import { expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  createStructure,
  createUsers,
  createFamilyFile,
  createBeneficiary,
  createSocialSupports,
  TestFixtureUsers,
  TestFixturePartnerOrganizations
} from '~/test/server/fixtures'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { generateFileNumber } from '~/utils/generateFileNumber'

// Mock email sending context
mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return {
      public: {
        email: { from: 'mss@example.com' }
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

beforeEach(async () => {
  const date = new Date()
  const structure = await createStructure(date)
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
  await createSocialSupports(
    date,
    familyFile.id,
    beneficiary.id,
    structure.id,
    users[TestFixtureUsers.Referent].id,
    users[TestFixtureUsers.StructureManager].id,
    users[TestFixtureUsers.Referent].createdPartnerOrganizations[
      TestFixturePartnerOrganizations.FranceTravail
    ].id,
    users[TestFixtureUsers.Referent].createdPartnerOrganizations[
      TestFixturePartnerOrganizations.FranceTravail
    ].contacts[TestFixturePartnerOrganizations.FranceTravail].id
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
})

afterEach(async () => await resetDatabase(structureId))

test('Structure - Disable - Administrator should be able to deactivate structure and remove all personal data associated to it', async ({
  trpc
}) => {
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
    include: {
      followup: true,
      appointment: true,
      fileInstruction: {
        include: {
          helpRequest: true,
          housingHelpRequest: true
        }
      }
    }
  })
  expect(socialSupports).toHaveLength(2)
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
  expect(fileInstructions).toHaveLength(1)
  fileInstructions.map(fi => {
    expect(fi?.externalStructure).toBe(false)
    expect(fi?.refusalReason).toBe(null)
    expect(fi?.type).toBeOneOf(['Financial'])
    expect(fi?.updated).not.toBeNull()
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
  })

  // TODO add tests for housing help requests, social support subjects, partner organizatiosn and documents linked to social supports

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
    expect(u.accessToken).toBeNull()
    expect(u.firstAccess).not.toBeNull()
    expect(u.lastAccess).not.toBeNull()
  })
})

async function resetDatabase(sid: string) {
  if (sid) {
    await prismaClient.familyFile.deleteMany({ where: { structureId: sid } })
    await prismaClient.user.deleteMany({ where: { structureId: sid } })
    await prismaClient.structure.delete({ where: { id: sid } })
  }
}
