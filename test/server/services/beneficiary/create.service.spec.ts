import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  BeneficiaryStatus,
  UserRole,
  UserStatus,
  StructureType
} from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'

vi.mock('~/server/database', () => {
  return {
    BeneficiaryRepo: {
      prisma: {
        create: vi.fn(() => ({
          id: 'beneficiary-1'
        }))
      }
    },
    DraftRepo: {
      findUniqueOrThrow: vi.fn(() => ({
        content: {
          general: {
            status: BeneficiaryStatus.Active,
            referents: ['agent-1'],
            firstName: 'Jean'
          }
        }
      })),
      delete: vi.fn()
    }
  }
})

vi.mock('~/utils/generateFileNumber', () => {
  return {
    generateFileNumber: vi.fn(() => 'file-number-1')
  }
})

describe('BeneficiaryService.create', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates a beneficiary', async () => {
    await BeneficiaryService.create({
      ctx: {
        user: {
          id: 'user-1',
          role: UserRole.StructureManager,
          status: UserStatus.Active,
          structureId: 'structure-1'
        },
        structure: {
          id: 'structure-1',
          type: StructureType.Ccas
        }
      },
      input: {
        referents: ['agent-1'],
        status: BeneficiaryStatus.Active
      }
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        createdById: 'user-1',
        fileNumber: 'file-number-1',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1',
        referents: { connect: [{ id: 'agent-1' }] }
      }
    })
    expect(DraftRepo.delete).not.toHaveBeenCalled()
  })

  it('creates a beneficiary from a draft and deletes the associated draft', async () => {
    await BeneficiaryService.create({
      ctx: {
        user: {
          id: 'user-1',
          role: UserRole.StructureManager,
          status: UserStatus.Active,
          structureId: 'structure-1'
        },
        structure: {
          id: 'structure-1',
          type: StructureType.Ccas
        }
      },
      input: {
        id: 'draft-1'
      },
      draftId: 'draft-1'
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        createdById: 'user-1',
        fileNumber: 'file-number-1',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1',
        firstName: 'Jean',
        phone1: undefined,
        phone2: undefined,
        referents: { connect: [{ id: 'agent-1' }] }
      }
    })
    expect(DraftRepo.delete).toHaveBeenCalledWith(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        where: {
          id: 'draft-1'
        }
      }
    )
  })
})
