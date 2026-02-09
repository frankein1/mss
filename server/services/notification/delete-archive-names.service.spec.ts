import { describe, vi, beforeEach, afterEach, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { ArchivedBeneficiaryRepo } from '~/server/database'
import {
  FixtureStructure,
  fixtureStructures,
  fixturesUsers
} from '~/prisma/fixtures'
import { BeneficiaryTitle, StructureType } from '~/prisma/generated/client'
import { deleteArchivedNames } from './delete-archive-names.service'

let beneficiaryId: string | null = null

beforeEach(async () => {
  vi.useFakeTimers()
  const beneficiary = await createArchivedBeneficiary()
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await deleteArchiveBeneficiary()
  // restoring date after each test run
  vi.useRealTimers()
})

describe('Notification - Beneficiary Archive - Delete archived names if older than 1 year', () => {
  it("shouldn't have names or title", async () => {
    const future = dayjs().add(2, 'years').toDate()
    vi.setSystemTime(future)

    await deleteArchivedNames()

    const beneficiaries = await ArchivedBeneficiaryRepo.prisma.findMany({
      where: {
        updated: { lte: new Date() }
      }
    })
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId)
    expect(beneficiary?.title).toBeNull()
    expect(beneficiary?.usualName).toBeNull()
    expect(beneficiary?.birthName).toBeNull()
    expect(beneficiary?.firstName).toBeNull()
  })
})

const createArchivedBeneficiary = async () => {
  return await ArchivedBeneficiaryRepo.prisma.create({
    data: {
      oldBeneficiaryId: 'eb3ee2af-4949-43d0-b602-9741074dae68',
      fileCreationDate: new Date('2025-01-01T00:00:00.000Z'),
      socialSupportSubjects: [],
      followupCount: 0,
      filleInstructionCount: 0,
      structureType: StructureType.Ccas,
      archivedById: fixturesUsers[0].id,
      structureId: fixtureStructures[FixtureStructure.Test].id,
      clarification: 'Bénéficiaire inactif',
      reason: 'EndOfFollowup',
      eventDateReason: null,
      title: BeneficiaryTitle.Mister,
      usualName: 'Doe',
      birthName: null,
      firstName: 'John'
    }
  })
}

const deleteArchiveBeneficiary = async () => {
  if (beneficiaryId) {
    await ArchivedBeneficiaryRepo.prisma.delete({
      where: {
        id: beneficiaryId
      }
    })
  }
}
