import { beforeEach, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

let familyFileId: string
let beneficiaryId: string
let notificationIds: string[]

beforeEach(async () => {
  const file = await createFamilyFile()
  familyFileId = file.id

  const ben = await createBeneficiary(familyFileId)
  beneficiaryId = ben.id
  notificationIds = ben.notifications.map(n => n.id)
})

afterEach(async () => await resetDatabase(familyFileId, beneficiaryId))

test('Beneficiary - Archive - Agent can delete all beneficiary data after downloading her file', async ({
  trpc
}) => {
  await trpc.structureManager.beneficiary.archiveBeneficiary({
    beneficiaryId,
    keepName: false
  })

  const ben = await prismaClient.beneficiary.findUnique({
    where: { id: beneficiaryId }
  })
  expect(ben).toBeNull()

  const ff = await prismaClient.familyFile.findUnique({
    where: { id: familyFileId }
  })
  expect(ff).toBeNull()

  const notifs = await prismaClient.notification.findMany({
    where: { id: { in: notificationIds } }
  })
  expect(notifs).toHaveLength(0)

  const archived = await prismaClient.archivedBeneficiary.findFirst({
    where: { oldBeneficiaryId: beneficiaryId }
  })
  expect(archived).not.toBeNull()
  expect(archived?.archivedById).toBe(
    fixturesUsers[FixtureUserRole.StructureManager].id
  )
})

async function createFamilyFile() {
  return await prismaClient.familyFile.create({
    data: {
      structure: {
        connect: { id: fixtureStructures[FixtureStructure.Test].id }
      },
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id }
        ]
      }
    }
  })
}

async function createBeneficiary(familyFileId: string) {
  const now = new Date()
  return await prismaClient.beneficiary.create({
    select: {
      id: true,
      notifications: {
        select: { id: true }
      }
    },
    data: {
      familyFile: {
        connect: { id: familyFileId }
      },
      structure: {
        connect: { id: fixtureStructures[FixtureStructure.Test].id }
      },
      createdBy: {
        connect: { id: fixturesUsers[FixtureUserRole.Referent].id }
      },
      fileNumber: 'ABCDEF1234',
      status: 'Active',
      notifications: {
        createMany: {
          data: [
            {
              type: 'ArchiveDueToday',
              archiveDate: now,
              recipientId: fixturesUsers[FixtureUserRole.Referent].id
            },
            {
              type: 'ArchiveDueToday',
              archiveDate: now,
              recipientId: fixturesUsers[FixtureUserRole.StructureManager].id
            }
          ]
        }
      }
    }
  })
}

async function resetDatabase(fid: string, bid: string) {
  if (bid) {
    await prismaClient.beneficiary.deleteMany({ where: { id: bid } })
  }
  if (fid) {
    await prismaClient.familyFile.deleteMany({ where: { id: fid } })
  }
}
