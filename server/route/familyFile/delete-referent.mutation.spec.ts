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

  // Each family file keeps two referents so a single removal is always allowed.
  await prismaClient.user.update({
    where: { id: JEANNE_REFERENTE_ID },
    data: { referentFor: { connect: familyFiles } }
  })
  await prismaClient.user.update({
    where: { id: referentTestId },
    data: { referentFor: { connect: familyFiles } }
  })
})

afterEach(async () => {
  await prismaClient.familyFile.deleteMany({
    where: { id: { in: familyFileIds } }
  })
  await prismaClient.user.delete({ where: { id: referentTestId } })
})

describe('Family File - Delete Referent - Authorizations', () => {
  test('A reception agent cannot delete a referent', async ({ trpc }) => {
    await expect(
      trpc.receptionAgent.file.deleteReferent({
        familyFileIds,
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A social worker can delete a referent', async ({ trpc }) => {
    const result = await trpc.socialWorker.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('A structure manager can delete a referent and the change is persisted', async ({
    trpc
  }) => {
    const [fileId] = familyFileIds
    if (!fileId) {
      throw new Error('setup: expected a family file')
    }

    const result = await trpc.structureManager.file.deleteReferent({
      familyFileIds: [fileId],
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)

    const file = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: fileId },
      select: { referents: { select: { id: true } } }
    })
    const referentIds = file.referents.map(r => r.id)
    expect(referentIds).not.toContain(referentTestId)
    expect(referentIds).toContain(JEANNE_REFERENTE_ID)
  })

  test('An assigned referent can delete a referent', async ({ trpc }) => {
    const result = await trpc.referent.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('An instructor can delete a referent', async ({ trpc }) => {
    const result = await trpc.instructor.file.deleteReferent({
      familyFileIds: familyFileIds.slice(0, 1),
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)
  })

  test('A referent not assigned to the family file cannot delete a referent', async ({
    trpc
  }) => {
    const unassignedFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structureId: STRUCTURE_ID }
    })
    familyFileIds.push(unassignedFile.id)

    await expect(
      trpc.referent.file.deleteReferent({
        familyFileIds: [unassignedFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot delete a referent from another structure', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManager.file.deleteReferent({
        familyFileIds: familyFileIds.slice(0, 1),
        referentId: OTHER_STRUCTURE_USER_ID
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot delete a referent from a family file from another structure', async ({
    trpc
  }) => {
    const foreignFile = await prismaClient.familyFile.create({
      select: { id: true },
      data: { structureId: OTHER_STRUCTURE_ID }
    })
    familyFileIds.push(foreignFile.id)

    await expect(
      trpc.structureManager.file.deleteReferent({
        familyFileIds: [foreignFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A structure manager cannot delete a referent when one family file is from another structure', async ({
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
      trpc.structureManager.file.deleteReferent({
        familyFileIds: [inStructureFileId, foreignFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/not allowed to access route/i)

    // The in-structure file must keep its referent when the batch is rejected.
    const inStructureFile = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: inStructureFileId },
      select: { referents: { select: { id: true } } }
    })
    expect(inStructureFile.referents.map(r => r.id)).toContain(referentTestId)
  })
})

describe('Family File - Delete Referent - Batch limits and scale', () => {
  test('A structure manager cannot delete a referent from more than the maximum number of family files', async ({
    trpc
  }) => {
    const tooMany = Array.from({ length: MAX_BENEFICIARIES + 1 }, () =>
      crypto.randomUUID()
    )
    await expect(
      trpc.structureManager.file.deleteReferent({
        familyFileIds: tooMany,
        referentId: referentTestId
      })
    ).rejects.toThrow(
      new RegExp(`Pas plus de ${MAX_BENEFICIARIES} bénéficiaires`)
    )
  })

  test('A structure manager cannot delete a referent from an empty list of family files', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManager.file.deleteReferent({
        familyFileIds: [],
        referentId: referentTestId
      })
    ).rejects.toThrow(/Veuillez sélectionner au moins 1 bénéficiaire/)
  })

  test('A structure manager cannot delete a referent when a family file would be left with fewer than two referents', async ({
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

    await expect(
      trpc.structureManager.file.deleteReferent({
        familyFileIds: [soloFile.id],
        referentId: referentTestId
      })
    ).rejects.toThrow(/at least, 2 referent agents/i)
  })

  test('Duplicate family file ids are deduplicated into a single disconnection', async ({
    trpc
  }) => {
    const [fileId] = familyFileIds
    if (!fileId) {
      throw new Error('setup: expected a family file')
    }

    const result = await trpc.structureManager.file.deleteReferent({
      familyFileIds: [fileId, fileId],
      referentId: referentTestId
    })
    expect(result.id).toBe(referentTestId)

    const file = await prismaClient.familyFile.findUniqueOrThrow({
      where: { id: fileId },
      select: { referents: { select: { id: true } } }
    })
    const referentIds = file.referents.map(r => r.id)
    expect(referentIds).not.toContain(referentTestId)
    expect(referentIds).toContain(JEANNE_REFERENTE_ID)
  })

  test(`A structure manager removes the referent from all ${MAX_BENEFICIARIES} family files while keeping existing referents`, async ({
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

    // Two referents per file so every removal is allowed.
    await Promise.all([
      prismaClient.user.update({
        where: { id: JEANNE_REFERENTE_ID },
        data: { referentFor: { connect: scaleFiles } }
      }),
      prismaClient.user.update({
        where: { id: referentTestId },
        data: { referentFor: { connect: scaleFiles } }
      })
    ])

    const t0 = performance.now()
    await trpc.structureManager.file.deleteReferent({
      familyFileIds: scaleFileIds,
      referentId: referentTestId
    })
    const mutationDurationS = (performance.now() - t0) / 1000
    console.log(
      `[PERF] deleteReferent (${MAX_BENEFICIARIES} beneficiaries): ${mutationDurationS.toFixed(1)} s.`
    )

    const updatedFiles = await prismaClient.familyFile.findMany({
      where: { id: { in: scaleFileIds } },
      select: { referents: { select: { id: true } } }
    })
    expect(updatedFiles).toHaveLength(MAX_BENEFICIARIES)
    for (const file of updatedFiles) {
      const ids = file.referents.map(r => r.id)
      // disconnect removes only the target referent; Jeanne is preserved.
      expect(ids).not.toContain(referentTestId)
      expect(ids).toContain(JEANNE_REFERENTE_ID)
    }
  })
})
