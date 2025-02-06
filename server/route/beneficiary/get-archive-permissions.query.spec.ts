import { describe, expect, afterAll, beforeAll } from 'vitest'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import dayjs from 'dayjs'
import { BeneficiaryStatus } from '@prisma/client'
import { v4 } from 'uuid'

const inputCoursor = {
  id: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
}

const createBeneficiaries = async () => {
  const familyfile = await prismaClient.familyFile.create({
    data: {
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.StructureManager].id },
          { id: fixturesUsers[FixtureUserRole.Referent].id }
        ]
      },
      budget: undefined
    }
  })
  familyfileId = familyfile.id
  const beneficiaries = await prismaClient.beneficiary.createManyAndReturn({
    data: [
      {
        // Dernière mise à jour - 2 ans
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Mister',
        firstName: 'Paul',
        created: dayjs(new Date()).subtract(1, 'day').toDate(),
        updated: dayjs(new Date()).subtract(1, 'day').toDate()
      },
      {
        // Dernière mise à jour + 2 ans
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Mister',
        firstName: 'Leto',
        created: dayjs(new Date()).subtract(3, 'year').toDate(),
        updated: dayjs(new Date()).subtract(3, 'year').toDate()
      },
      {
        // Date d'archivage non passée.
        // Dernière mise à jour - 2 ans
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Mister',
        firstName: 'Vorian',
        archiveDueDate: dayjs(new Date()).add(1, 'month').toDate(),
        created: dayjs(new Date()).subtract(1, 'day').toDate(),
        updated: dayjs(new Date()).subtract(1, 'day').toDate()
      },
      {
        // Date d'archivage non passée.
        // Dernière mise à jour + 2 ans
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Miss',
        firstName: 'Jessica',
        archiveDueDate: dayjs(new Date()).add(1, 'month').toDate(),
        created: dayjs(new Date()).subtract(3, 'year').toDate(),
        updated: dayjs(new Date()).subtract(3, 'year').toDate()
      },
      {
        // Date d'archivage passée
        // Dernière mise à jour faite depuis le repport
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Miss',
        firstName: 'Alia',
        archiveDueDate: dayjs(new Date()).subtract(1, 'month').toDate(),
        created: dayjs(new Date()).subtract(2, 'year').toDate(),
        updated: dayjs(new Date()).subtract(2, 'month').toDate()
      },
      {
        // Date d'archivage passée
        // Pas de mise à jour faite depuis le report
        ...beneficiaryBaseObject,
        familyFileId: familyfile.id,
        fileNumber: v4(),
        title: 'Miss',
        firstName: 'Ghanima',
        archiveDueDate: dayjs(new Date()).subtract(1, 'month').toDate(),
        created: dayjs(new Date()).subtract(2, 'year').toDate(),
        updated: dayjs(new Date()).subtract(2, 'year').toDate()
      }
    ]
  })

  return beneficiaries
}

let familyfileId = ''
let beneficiaries: Awaited<ReturnType<typeof createBeneficiaries>> = []
async function resetDatabaseAfterTest() {
  await prismaClient.beneficiary.deleteMany({
    where: { usualName: ATREIDES }
  })
  await prismaClient.familyFile.deleteMany({
    where: { id: familyfileId }
  })
}

beforeAll(async () => {
  beneficiaries = await createBeneficiaries()
})

afterAll(async () => {
  await resetDatabaseAfterTest()
})

describe('Beneficiary - Test Archive permissions', async () => {
  test('Structure Manager should return true', async ({ trpc }) => {
    const archivePermissionManager =
      await trpc.structureManager.beneficiary.getBeneficiaryArchivePermission(
        inputCoursor
      )
    expect(archivePermissionManager.archive).toBe(true)
  })

  test('Reception Agent should return false', async ({ trpc }) => {
    const archivePermissionReceptionAgent =
      await trpc.receptionAgent.beneficiary.getBeneficiaryArchivePermission(
        inputCoursor
      )
    expect(archivePermissionReceptionAgent.archive).toBe(false)
  })

  test('referent, beneficiary updated recently. should return false', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[0].id
      })
    expect(archiveParmissionReferent.archive).toBe(false)
  })

  test('referent, beneficiary not updated recently. should return true', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[1].id
      })
    expect(archiveParmissionReferent.archive).toBe(true)
  })

  test('referent, archiveDueDate unpassed, beneficiary updated recently. should return false ', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[2].id
      })
    expect(archiveParmissionReferent.archive).toBe(false)
  })

  test('referent, archiveDueDate unpassed, beneficiary not updated recently. should return true ', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[3].id
      })
    expect(archiveParmissionReferent.archive).toBe(true)
  })

  test('referent, archiveDueDate passed, beneficiary updated recently. should return false ', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[4].id
      })
    expect(archiveParmissionReferent.archive).toBe(false)
  })

  test('referent, archiveDueDate passed, beneficiary not updated recently. should return true ', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: beneficiaries[5].id
      })
    expect(archiveParmissionReferent.archive).toBe(true)
  })
})

const ATREIDES = 'ATREIDES'
const beneficiaryBaseObject = {
  structureId: fixtureStructures[0].id,
  status: BeneficiaryStatus.Active,
  usualName: ATREIDES,
  createdById: fixturesUsers[FixtureUserRole.Referent].id
}
