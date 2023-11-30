import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  BeneficiaryStatus,
  RelativeRelationship,
  UserRole,
  UserStatus
} from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import {
  BeneficiaryRepo,
  DraftRepo,
  BeneficiaryRelativeRepo
} from '~/server/database'

vi.mock('~/server/database', () => {
  return {
    BeneficiaryRepo: {
      prisma: {
        create: vi.fn()
      }
    },
    DraftRepo: {
      delete: vi.fn()
    },
    BeneficiaryRelativeRepo: {
      prisma: {
        createMany: vi.fn()
      }
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
    expect(BeneficiaryRelativeRepo.prisma.createMany).not.toHaveBeenCalled()
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
    expect(BeneficiaryRelativeRepo.prisma.createMany).not.toHaveBeenCalled()
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

  it('creates a beneficiary and opposite linked beneficiary relatives', async () => {
    vi.mocked(BeneficiaryRepo.prisma.create).mockResolvedValueOnce({
      id: 'beneficiary-1'
    } as any)

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
          structureId: 'structure-1',
          relatives: {
            createMany: {
              data: [
                {
                  id: 'new-relative-1',
                  hosted: true
                },
                { id: 'new-relative-2' },
                {
                  id: 'new-relative-3',
                  hosted: true,
                  linkedBeneficiaryId: 'beneficiary-2'
                },
                {
                  id: 'new-relative-4',
                  hosted: true,
                  linkedBeneficiaryId: 'beneficiary-3',
                  relationship: RelativeRelationship.Sibling
                },
                {
                  id: 'new-relative-5',
                  hosted: true,
                  linkedBeneficiaryId: 'beneficiary-4',
                  relationship: RelativeRelationship.Ami
                }
              ]
            }
          }
        }
      }
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        fileNumber: '123456',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1',
        relatives: {
          createMany: {
            data: [
              {
                id: 'new-relative-1',
                hosted: true
              },
              { id: 'new-relative-2' },
              {
                id: 'new-relative-3',
                hosted: true,
                linkedBeneficiaryId: 'beneficiary-2'
              },
              {
                id: 'new-relative-4',
                hosted: true,
                linkedBeneficiaryId: 'beneficiary-3',
                relationship: RelativeRelationship.Sibling
              },
              {
                id: 'new-relative-5',
                hosted: true,
                linkedBeneficiaryId: 'beneficiary-4',
                relationship: RelativeRelationship.Ami
              }
            ]
          }
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).toHaveBeenCalledWith({
      data: [
        {
          beneficiaryId: 'beneficiary-2',
          hosted: true,
          linkedBeneficiaryId: 'beneficiary-1',
          relationship: undefined
        },
        {
          beneficiaryId: 'beneficiary-3',
          hosted: true,
          linkedBeneficiaryId: 'beneficiary-1',
          relationship: RelativeRelationship.Sibling
        },
        {
          beneficiaryId: 'beneficiary-4',
          hosted: true,
          linkedBeneficiaryId: 'beneficiary-1',
          relationship: undefined
        }
      ]
    })
    expect(DraftRepo.delete).not.toHaveBeenCalled()
  })

  it('creates a beneficiary and no opposite linked beneficiary relatives if none', async () => {
    vi.mocked(BeneficiaryRepo.prisma.create).mockResolvedValueOnce({
      id: 'beneficiary-1'
    } as any)

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
          structureId: 'structure-1',
          relatives: {
            createMany: {
              data: [
                {
                  id: 'new-relative-1',
                  hosted: true
                },
                { id: 'new-relative-2' }
              ]
            }
          }
        }
      }
    })

    expect(BeneficiaryRepo.prisma.create).toHaveBeenCalledWith({
      data: {
        fileNumber: '123456',
        status: BeneficiaryStatus.Active,
        structureId: 'structure-1',
        relatives: {
          createMany: {
            data: [
              {
                id: 'new-relative-1',
                hosted: true
              },
              { id: 'new-relative-2' }
            ]
          }
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).not.toHaveBeenCalled()
    expect(DraftRepo.delete).not.toHaveBeenCalled()
  })
})
