import { describe, it, expect, vi, afterEach } from 'vitest'
import { BeneficiaryStatus, UserRole, UserStatus } from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'

vi.mock('~/server/database', () => {
  return {
    BeneficiaryRepo: {
      prisma: {
        create: vi.fn()
      }
    },
    DraftRepo: {
      delete: vi.fn()
    }
  }
})

describe('BeneficiaryService.create', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates a beneficiary', async () => {
    await BeneficiaryService.create({
      user: {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      params: {
        data: {
          fileNumber: '123456',
          status: BeneficiaryStatus.Active,
          structureId: 'structure-1'
        }
      }
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        fileNumber: '123456',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1'
      }
    })
    expect(DraftRepo.delete).not.toHaveBeenCalled()
  })

  it('creates a beneficiary and deletes the associated draft', async () => {
    await BeneficiaryService.create({
      user: {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      params: {
        data: {
          fileNumber: '123456',
          status: BeneficiaryStatus.Active,
          structureId: 'structure-1'
        }
      },
      draftId: 'draft-1'
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        fileNumber: '123456',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1'
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
