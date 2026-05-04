import { beforeEach, afterEach, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER as MAX_BENEFICIARIES } from '~/utils/constants'

const JEANNE_REFERENTE_ID = fixturesUsers[FixtureUserRole.Referent].id
const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id
const CREATED_FILES_NUMBER = 800

let referentTestId: string
let familyFileIds: string[]
let beneficiaries: { beneficiaryId: string; familyFileId: string }[]

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

  const created = await prismaClient.beneficiary.createManyAndReturn({
    select: { id: true, familyFileId: true },
    data: familyFiles.map(({ id }) => ({
      structureId: STRUCTURE_ID,
      fileNumber: id,
      status: 'Active',
      familyFileId: id
    }))
  })
  beneficiaries = created.map(b => ({
    beneficiaryId: b.id,
    familyFileId: b.familyFileId!
  }))
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

test("addReferentToBeneficiaries - refuse l'accès à un agent d'accueil", async ({
  trpc
}) => {
  await expect(
    trpc.receptionAgent.file.addReferent({
      beneficiaries: beneficiaries.slice(0, 1),
      referentId: referentTestId
    })
  ).rejects.toMatchObject({ code: 'FORBIDDEN' })
})

test(`addReferentToBeneficiaries - ajoute le référent aux ${MAX_BENEFICIARIES} premiers bénéficiaires uniquement`, async ({
  trpc
}) => {
  const firstBeneficiaries = beneficiaries.slice(0, MAX_BENEFICIARIES)

  const t0 = performance.now()
  await trpc.structureManager.file.addReferent({
    beneficiaries: firstBeneficiaries,
    referentId: referentTestId
  })
  const mutationDurationS = (performance.now() - t0) / 1000
  console.log(
    `[PERF] addReferent (${MAX_BENEFICIARIES} beneficiaries): ${mutationDurationS.toFixed(1)} s.`
  )

  const updatedCount = await prismaClient.familyFile.count({
    where: {
      id: { in: firstBeneficiaries.map(b => b.familyFileId) },
      referents: { some: { id: referentTestId } }
    }
  })
  expect(updatedCount).toBe(MAX_BENEFICIARIES)

  const updatedFiles = await prismaClient.familyFile.findMany({
    where: { id: { in: firstBeneficiaries.map(b => b.familyFileId) } },
    select: { referents: { select: { id: true } } }
  })
  for (const file of updatedFiles) {
    const ids = file.referents.map(r => r.id)
    expect(ids).toContain(referentTestId)
    expect(ids).toContain(JEANNE_REFERENTE_ID)
  }

  const lastFamilyFileIds = beneficiaries
    .slice(MAX_BENEFICIARIES)
    .map(b => b.familyFileId)
  const untouchedCount = await prismaClient.familyFile.count({
    where: {
      id: { in: lastFamilyFileIds },
      referents: { some: { id: referentTestId } }
    }
  })
  expect(untouchedCount).toBe(0)

  const untouchedFiles = await prismaClient.familyFile.findMany({
    where: { id: { in: lastFamilyFileIds } },
    select: { referents: { select: { id: true } } }
  })
  for (const file of untouchedFiles) {
    const ids = file.referents.map(r => r.id)
    expect(ids).not.toContain(referentTestId)
    expect(ids).toContain(JEANNE_REFERENTE_ID)
  }
})
