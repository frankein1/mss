import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  fixturesUsers,
  fixtureStructures,
  FixtureUserRole,
  FixtureStructure
} from '~/prisma/fixtures'
import {
  BeneficiaryRepo,
  FamilyFileRepo,
  NotificationRepo
} from '~/server/database'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import {
  DocumentType,
  NotificationType,
  type BeneficiaryStatus
} from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import * as documentNotifications from './create-document-notifications'

const ID_BENEFICIARY = faker.string.uuid()
const ID_SECOND_REFERENT = faker.string.uuid()
const ID_INACTIVE_SOCIAL_WORKER = faker.string.uuid()
const ID_DOCUMENT_TODAY = faker.string.uuid()
const ID_DOCUMENT_ONE_MONTH = faker.string.uuid()
const ID_DOCUMENT_CONFIDENTIAL_TODAY = faker.string.uuid()
const ID_DOCUMENT_CONFIDENTIAL_ONE_MONTH = faker.string.uuid()
const ID_BENEFICIARY_CONFIDENTIAL = faker.string.uuid()

const TODAY = dayjs().startOf('day').toDate()
const IN_A_MONTH = dayjs().add(1, 'month').startOf('day').toDate()

const beneficiary = {
  id: ID_BENEFICIARY,
  usualName: 'DUPONT',
  firstName: 'Marie',
  fileNumber: ID_BENEFICIARY,
  status: 'Active' as BeneficiaryStatus,
  structureId: fixtureStructures[0].id
}

beforeEach(async () => {
  await createBeneficiaryWithDocuments()
  await createConfidentialDocuments()
})
afterEach(async () => await deleteBeneficiary())

describe('Notification - Document expiration today (referent filtering)', () => {
  it('should notify creator and non-excluded referents (SocialWorker, StructureManager, Referent)', async () => {
    await documentNotifications.default.createDueTodayDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationToday,
        beneficiaryId: ID_BENEFICIARY
      }
    })

    // Creator (Referent role) + SocialWorker + StructureManager + Second Referent
    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.SocialWorker].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n =>
          n.recipientId === fixturesUsers[FixtureUserRole.StructureManager].id
      )
    ).toBe(true)
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should not notify ReceptionAgent nor Instructor', async () => {
    await documentNotifications.default.createDueTodayDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationToday,
        beneficiaryId: ID_BENEFICIARY
      }
    })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.ReceptionAgent].id
      )
    ).toBe(false)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Instructor].id
      )
    ).toBe(false)
  })
})

describe('Notification - Document expiration in one month (referent filtering)', () => {
  it('should notify creator and non-excluded referents (SocialWorker, StructureManager, Referent)', async () => {
    await documentNotifications.default.createDueInAMonthDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationOneMonth,
        beneficiaryId: ID_BENEFICIARY
      }
    })

    // Creator (Referent role) + SocialWorker + StructureManager + Second Referent
    expect(notifs.length).toBe(4)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Referent].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.SocialWorker].id
      )
    ).toBe(true)
    expect(
      notifs.some(
        n =>
          n.recipientId === fixturesUsers[FixtureUserRole.StructureManager].id
      )
    ).toBe(true)
    expect(notifs.some(n => n.recipientId === ID_SECOND_REFERENT)).toBe(true)
  })

  it('should not notify ReceptionAgent nor Instructor', async () => {
    await documentNotifications.default.createDueInAMonthDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationOneMonth,
        beneficiaryId: ID_BENEFICIARY
      }
    })

    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.ReceptionAgent].id
      )
    ).toBe(false)
    expect(
      notifs.some(
        n => n.recipientId === fixturesUsers[FixtureUserRole.Instructor].id
      )
    ).toBe(false)
  })
})

describe('Notification - Confidential document expiration today', () => {
  it('should only notify the creator, not other referents', async () => {
    await documentNotifications.default.createDueTodayDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationToday,
        beneficiaryId: ID_BENEFICIARY_CONFIDENTIAL
      }
    })

    expect(notifs.length).toBe(1)
    expect(notifs[0]?.recipientId).toBe(
      fixturesUsers[FixtureUserRole.Referent].id
    )
  })
})

describe('Notification - Confidential document expiration in one month', () => {
  it('should only notify the creator, not other referents', async () => {
    await documentNotifications.default.createDueInAMonthDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationOneMonth,
        beneficiaryId: ID_BENEFICIARY_CONFIDENTIAL
      }
    })

    expect(notifs.length).toBe(1)
    expect(notifs[0]?.recipientId).toBe(
      fixturesUsers[FixtureUserRole.Referent].id
    )
  })
})

describe('Notification - should not notify inactive referents', () => {
  it('should not notify an inactive SocialWorker referent', async () => {
    await documentNotifications.default.createDueTodayDocumentNotifications()

    const notifs = await NotificationRepo.prisma.findMany({
      where: {
        type: NotificationType.DocumentExpirationToday,
        beneficiaryId: ID_BENEFICIARY
      }
    })

    expect(notifs.some(n => n.recipientId === ID_INACTIVE_SOCIAL_WORKER)).toBe(
      false
    )
  })
})

const createBeneficiaryWithDocuments = async () => {
  await prismaClient.user.createMany({
    data: [
      {
        id: ID_SECOND_REFERENT,
        firstName: 'Second',
        lastName: 'Référent',
        email: 'second.referent.doc.test@yopmail.com',
        role: 'Referent',
        status: 'Active',
        structureId: fixtureStructures[FixtureStructure.Test].id
      },
      {
        id: ID_INACTIVE_SOCIAL_WORKER,
        firstName: 'Inactive',
        lastName: 'SocialWorker',
        email: 'inactive.socialworker.doc.test@yopmail.com',
        role: 'SocialWorker',
        status: 'Disabled',
        structureId: fixtureStructures[FixtureStructure.Test].id
      }
    ]
  })

  const ff = await FamilyFileRepo.prisma.create({
    data: {
      id: ID_BENEFICIARY,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
          { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id },
          { id: fixturesUsers[FixtureUserRole.Instructor].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id },
          { id: ID_SECOND_REFERENT },
          { id: ID_INACTIVE_SOCIAL_WORKER }
        ]
      }
    }
  })

  await BeneficiaryRepo.prisma.create({
    data: {
      ...beneficiary,
      familyFileId: ff.id
    }
  })

  await Promise.all([
    prismaClient.document.create({
      data: {
        key: ID_DOCUMENT_TODAY,
        mimeType: 'application/pdf',
        name: "Document expirant aujourd'hui",
        filenameDisk: `${ID_DOCUMENT_TODAY}.pdf`,
        type: DocumentType.Justificatifs,
        confidential: false,
        familyFileId: ff.id,
        beneficiaryId: ID_BENEFICIARY,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        expirationDate: TODAY
      }
    }),
    prismaClient.document.create({
      data: {
        key: ID_DOCUMENT_ONE_MONTH,
        mimeType: 'application/pdf',
        name: 'Document expirant dans un mois',
        filenameDisk: `${ID_DOCUMENT_ONE_MONTH}.pdf`,
        type: DocumentType.Justificatifs,
        confidential: false,
        familyFileId: ff.id,
        beneficiaryId: ID_BENEFICIARY,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        expirationDate: IN_A_MONTH
      }
    })
  ])
}

const createConfidentialDocuments = async () => {
  const ff = await FamilyFileRepo.prisma.create({
    data: {
      id: ID_BENEFICIARY_CONFIDENTIAL,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.SocialWorker].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id }
        ]
      }
    }
  })

  await BeneficiaryRepo.prisma.create({
    data: {
      id: ID_BENEFICIARY_CONFIDENTIAL,
      usualName: 'CONFIDENTIEL',
      firstName: 'Doc',
      fileNumber: ID_BENEFICIARY_CONFIDENTIAL,
      status: 'Active' as BeneficiaryStatus,
      structureId: fixtureStructures[0].id,
      familyFileId: ff.id
    }
  })

  await Promise.all([
    prismaClient.document.create({
      data: {
        key: ID_DOCUMENT_CONFIDENTIAL_TODAY,
        mimeType: 'application/pdf',
        name: "Document confidentiel expirant aujourd'hui",
        filenameDisk: `${ID_DOCUMENT_CONFIDENTIAL_TODAY}.pdf`,
        type: DocumentType.Justificatifs,
        confidential: true,
        familyFileId: ff.id,
        beneficiaryId: ID_BENEFICIARY_CONFIDENTIAL,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        expirationDate: TODAY
      }
    }),
    prismaClient.document.create({
      data: {
        key: ID_DOCUMENT_CONFIDENTIAL_ONE_MONTH,
        mimeType: 'application/pdf',
        name: 'Document confidentiel expirant dans un mois',
        filenameDisk: `${ID_DOCUMENT_CONFIDENTIAL_ONE_MONTH}.pdf`,
        type: DocumentType.Justificatifs,
        confidential: true,
        familyFileId: ff.id,
        beneficiaryId: ID_BENEFICIARY_CONFIDENTIAL,
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        expirationDate: IN_A_MONTH
      }
    })
  ])
}

const deleteBeneficiary = async () => {
  await FamilyFileRepo.prisma.deleteMany({
    where: {
      id: { in: [ID_BENEFICIARY, ID_BENEFICIARY_CONFIDENTIAL] }
    }
  })
  await prismaClient.user.deleteMany({
    where: { id: { in: [ID_SECOND_REFERENT, ID_INACTIVE_SOCIAL_WORKER] } }
  })
}
