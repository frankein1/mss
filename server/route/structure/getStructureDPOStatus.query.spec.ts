import { describe, expect, vi, afterEach, beforeAll, afterAll } from 'vitest'
import { fixtureStructure } from '~/prisma/fixtures'
import { StructureRepo } from '~/server/database'
import { test } from '~/test/server/test-utils'

let originalStructureCreationDate: Date
const structureId = fixtureStructure.id

beforeAll(async () => {
  // structure creation date set to before 24-05-30
  await setStructureCreationDate()
})

afterAll(async () => {
  await StructureRepo.prisma.update({
    where: { id: structureId },
    data: { created: originalStructureCreationDate }
  })
})

afterEach(() => {
  vi.useRealTimers()
})

async function setStructureCreationDate(date = new Date('2024-05-29')) {
  const structures = await StructureRepo.prisma.findMany({
    where: { id: structureId }
  })

  if (structures.length > 0) {
    originalStructureCreationDate = structures[0].created || new Date()

    await StructureRepo.prisma.update({
      where: { id: structureId },
      data: { created: date }
    })
  }
}

describe('Structure - DPO Status', () => {
  test('should optionally fill DPO as a Structure Manager when DPO has not been filled, structure creation is older than 24-05-30 and date is before 24-09-01', async ({
    trpc
  }) => {
    vi.setSystemTime(new Date('2024-08-31'))

    const status = await trpc.structureManager.structure.getStructureDPOStatus()

    expect(status.shouldFillDPO).toBe(true)
    expect(status.compulsory).toBe(false)
  })

  test('should be compelled to fill DPO as a Structure Manager when DPO has not been filled, structure creation is older than 24-05-30 and date is after 24-09-01', async ({
    trpc
  }) => {
    vi.setSystemTime(new Date('2024-09-01'))

    const status = await trpc.structureManager.structure.getStructureDPOStatus()

    expect(status.shouldFillDPO).toBe(true)
    expect(status.compulsory).toBe(true)
  })

  test('should not fill DPO as a Social Worker', async ({ trpc }) => {
    vi.setSystemTime(new Date(2024, 6, 1))

    const status = await trpc.socialWorker.structure.getStructureDPOStatus()

    expect(status.shouldFillDPO).toBe(false)
  })
})
