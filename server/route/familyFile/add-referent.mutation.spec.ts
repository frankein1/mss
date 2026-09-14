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
const OTHER_STRUCTURE_ID = fixtureStructures[FixtureStructure.Autun].id
const OTHER_STRUCTURE_USER_ID =
  fixturesUsers[FixtureUserRole.StructureManagerNew].id

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
    data: new Array(2).fill(null).map(() => ({ structureId: STRUCTURE_ID }))
  })
  familyFileIds = familyFiles.map(f => f.id)

  await prismaClient.user.update({
    where: { id: JEANNE_REFERENTE_ID },
    data: { referentFor: { connect: familyFiles } }
  })
})

afterEach(async () => {
  await prismaClient.familyFile.deleteMany({
    where: { id: { in: familyFileIds } }
  })
  await prismaClient.user.delete({ where: { id: referentTestId } })
})

describe('Family File - Add Referent - Authorizations', () => {
  test('A reception agent cannot add a referent', async ({ trpc }) => {
    await expect(
      trpc.receptionAgent.file.addReferent({
        familyFileIds,
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A social worker can add a referent', async ({ trpc }) => {
    const result = await trpc.socialWorker.file.addReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('A structure manager can add a referent and the change is persisted', async ({
    trpc
  }) => {
    const [fileId] = familyFileIds
    if (!fileId) {
      throw new Error('setup: expected a family file')
    }

    const result = await trpc.structureManager.file.addReferent({
      familyFileIds: [fileId],
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)

    const file = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: fileId },
      select: { referents: { select: { id: true } } }
    })
    expect(file.referents.map(r => r.id)).toContain(referentTestId)
  })

  test('An assigned referent can add a referent', async ({ trpc }) => {
    const result = await trpc.referent.file.addReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('An instructor can add a referent', async ({ trpc }) => {
    const result = await trpc.instructor.file.addReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('A referent not assigned to the family file cannot add a referent', async ({
    trpc
  }) => {
    const unassignedFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structureId: STRUCTURE_ID }
    })
    familyFileIds.push(unassignedFile.id)

    await expect(
      trpc.referent.file.addReferent({
        familyFileIds: [unassignedFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot add a referent from another structure', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManager.file.addReferent({
        familyFileIds: familyFileIds.slice(0, 1),
        referentId: OTHER_STRUCTURE_USER_ID
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot add a referent to a family file from another structure', async ({
    trpc
  }) => {
    const foreignFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structureId: OTHER_STRUCTURE_ID }
    })
    familyFileIds.push(foreignFile.id)

    await expect(
      trpc.structureManager.file.addReferent({
        familyFileIds: [foreignFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot add a referent when one family file is from another structure', async ({
    trpc
  }) => {
    const [inStructureFileId] = familyFileIds
    if (!inStructureFileId) {
      throw new Error('setup: expected a family file')
    }

    const foreignFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structureId: OTHER_STRUCTURE_ID }
    })
    familyFileIds.push(foreignFile.id)

    await expect(
      trpc.structureManager.file.addReferent({
        familyFileIds: [inStructureFileId, foreignFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)

    // The in-structure file must be left untouched when the batch is rejected.
    const inStructureFile = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: inStructureFileId },
      select: { referents: { select: { id: true } } }
    })
    expect(inStructureFile.referents.map(r => r.id)).not.toContain(
      referentTestId
    )
  })
})

describe('Family File - Add Referent - Batch limits and scale', () => {
  test('A structure manager cannot add a referent to more than the maximum number of family files', async ({
    trpc
  }) => {
    const tooMany = Array.from({ length: MAX_BENEFICIARIES + 1 }, () =>
      crypto.randomUUID()
    )
    await expect(
      trpc.structureManager.file.addReferent({
        familyFileIds: tooMany,
        referentId: referentTestId
      })
    ).rejects.toThrow(
      new RegExp(`Pas plus de ${MAX_BENEFICIARIES} bénéficiaires`)
    )
  })

  test('A structure manager cannot add a referent to an empty list of family files', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManager.file.addReferent({
        familyFileIds: [],
        referentId: referentTestId
      })
    ).rejects.toThrow(/Veuillez sélectionner au moins 1 bénéficiaire/)
  })

  test('Duplicate family file ids are deduplicated into a single connection', async ({
    trpc
  }) => {
    const [fileId] = familyFileIds
    if (!fileId) {
      throw new Error('setup: expected a family file')
    }

    const result = await trpc.structureManager.file.addReferent({
      familyFileIds: [fileId, fileId],
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)

    const file = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: fileId },
      select: { referents: { select: { id: true } } }
    })
    const referentIds = file.referents.map(r => r.id)
    expect(referentIds.filter(id => id === referentTestId)).toHaveLength(1)
  })

  test(`A structure manager adds the referent to all ${MAX_BENEFICIARIES} family files while keeping existing referents`, async ({
    trpc
  }) => {
    const scaleFiles = await prismaClient.familyFile.createManyAndReturn({
      select: { id: true },
      data: new Array(MAX_BENEFICIARIES)
        .fill(null)
        .map(() => ({ structureId: STRUCTURE_ID }))
    })
    const scaleFileIds = scaleFiles.map(f => f.id)
    familyFileIds.push(...scaleFileIds)

    await Promise.all([
      prismaClient.user.update({
        where: { id: JEANNE_REFERENTE_ID },
        data: { referentFor: { connect: scaleFiles } }
      }),
      prismaClient.beneficiary.createMany({
        data: scaleFiles.map(({ id }) => ({
          structureId: STRUCTURE_ID,
          fileNumber: id,
          status: 'Active',
          familyFileId: id
        }))
      })
    ])

    const t0 = performance.now()
    await trpc.structureManager.file.addReferent({
      familyFileIds: scaleFileIds,
      referentId: referentTestId
    })
    const mutationDurationS = (performance.now() - t0) / 1000
    console.log(
      `[PERF] addReferent (${MAX_BENEFICIARIES} beneficiaries): ${mutationDurationS.toFixed(1)} s.`
    )

    const updatedFiles = await prismaClient.familyFile.findMany({
      where: { id: { in: scaleFileIds } },
      select: { referents: { select: { id: true } } }
    })
    expect(updatedFiles).toHaveLength(MAX_BENEFICIARIES)
    for (const file of updatedFiles) {
      const ids = file.referents.map(r => r.id)
      // connect is additive: the new referent is added, Jeanne is preserved.
      expect(ids).toContain(referentTestId)
      expect(ids).toContain(JEANNE_REFERENTE_ID)
    }
  })
})
