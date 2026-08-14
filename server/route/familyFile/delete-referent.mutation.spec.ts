import { beforeEach, afterEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER as MAX_BENEFICIARIES } from '~/utils/constants'

const JEANNE_REFERENTE_ID = fixturesUsers[FixtureUserRole.Referent].id
const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id
const CREATED_FILES_NUMBER = 800

let referentTestId: string
let familyFileIds: string[]

beforeEach(async () => {
  const referentTest = await prismaClient.user.create({
    select: { id: true },
    data: {
      firstName: 'Référent',
      lastName: 'Test',
      email: `referent-test-${Date.now()}@yopmail.com`,
      role: 'Referent',
      status: 'Active',
      structureId: STRUCTURE_ID
    }
  })
  referentTestId = referentTest.id

  const familyFiles = await prismaClient.familyFile.createManyAndReturn({
    select: { id: true },
    data: new Array(CREATED_FILES_NUMBER)
      .fill(null)
      .map(() => ({ structureId: STRUCTURE_ID }))
  })
  familyFileIds = familyFiles.map(f => f.id)

  await prismaClient.user.update({
    where: { id: JEANNE_REFERENTE_ID },
    data: { referentFor: { connect: familyFiles } }
  })
  await prismaClient.user.update({
    where: { id: referentTestId },
    data: { referentFor: { connect: familyFiles } }
  })

  await prismaClient.beneficiary.createManyAndReturn({
    select: { id: true, familyFileId: true },
    data: familyFiles.map(({ id }) => ({
      structureId: STRUCTURE_ID,
      fileNumber: id,
      status: 'Active',
      familyFileId: id
    }))
  })
})

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({
    where: { familyFileId: { in: familyFileIds } }
  })
  await prismaClient.familyFile.deleteMany({
    where: { id: { in: familyFileIds } }
  })
  await prismaClient.user.delete({ where: { id: referentTestId } })
})

describe('Authorizations', () => {
  test("refuse l'accès à un agent d'accueil", async ({ trpc }) => {
    await expect(
      trpc.receptionAgent.file.deleteReferent({
        familyFileIds: familyFileIds.slice(0, 1),
        referentId: referentTestId
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('autorise un travailleur social', async ({ trpc }) => {
    const result = await trpc.socialWorker.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('autorise un gestionnaire de structure', async ({ trpc }) => {
    const result = await trpc.structureManager.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('autorise un référent affecté aux dossiers', async ({ trpc }) => {
    const result = await trpc.referent.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })
})

test("deleteReferentFromBeneficiaries - refuse si un bénéficiaire n'a qu'un seul référent", async ({
  trpc
}) => {
  const soloFile = await prismaClient.familyFile.create({
    select: { id: true },
    data: {
      structureId: STRUCTURE_ID,
      referents: { connect: [{ id: referentTestId }] }
    }
  })
  familyFileIds.push(soloFile.id)

  await prismaClient.beneficiary.create({
    select: { id: true },
    data: {
      structureId: STRUCTURE_ID,
      fileNumber: soloFile.id,
      status: 'Active',
      familyFileId: soloFile.id
    }
  })

  await expect(
    trpc.structureManager.file.deleteReferent({
      familyFileIds: [soloFile.id],
      referentId: referentTestId
    })
  ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
})

test(`deleteReferentFromBeneficiaries - supprime le référent des ${MAX_BENEFICIARIES} premiers bénéficiaires uniquement`, async ({
  trpc
}) => {
  const firstFamilyfileIds = familyFileIds.slice(0, MAX_BENEFICIARIES)

  const t0 = performance.now()
  await trpc.structureManager.file.deleteReferent({
    familyFileIds: firstFamilyfileIds,
    referentId: referentTestId
  })
  const mutationDurationS = (performance.now() - t0) / 1000
  console.log(
    `[PERF] deleteReferent (${MAX_BENEFICIARIES} bénéficiaires): ${mutationDurationS.toFixed(1)} s.`
  )

  const updatedFiles = await prismaClient.familyFile.findMany({
    where: { id: { in: firstFamilyfileIds } },
    select: { referents: { select: { id: true } } }
  })
  for (const file of updatedFiles) {
    const ids = file.referents.map(r => r.id)
    expect(ids).not.toContain(referentTestId)
    expect(ids).toContain(JEANNE_REFERENTE_ID)
  }

  const lastFamilyFileIds = familyFileIds.slice(MAX_BENEFICIARIES)
  const untouchedFiles = await prismaClient.familyFile.findMany({
    where: { id: { in: lastFamilyFileIds } },
    select: { referents: { select: { id: true } } }
  })
  for (const file of untouchedFiles) {
    const ids = file.referents.map(r => r.id)
    expect(ids).toContain(referentTestId)
    expect(ids).toContain(JEANNE_REFERENTE_ID)
  }
})
