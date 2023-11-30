import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  UserRole,
  UserStatus,
  BeneficiaryFamilySituation,
  RelativeRelationship
} from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import { BeneficiaryRepo, BeneficiaryRelativeRepo } from '~/server/database'

vi.mock('~/server/database', () => {
  return {
    BeneficiaryRepo: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: 'beneficiary-1',
        structureId: 'structureId',
        firstName: 'Jean',
        usualName: 'Bénéficiaire 1',
        relatives: [
          {
            id: 'relative-1',
            caregiver: false,
            hosted: true,
            linkedBeneficiary: undefined,
            relationship: RelativeRelationship.Sibling
          },
          {
            id: 'relative-4',
            hosted: true,
            caregiver: true,
            linkedBeneficiary: {
              id: 'beneficiary-2'
            },
            relationship: RelativeRelationship.Conjoint
          }
        ]
      }),
      prisma: {
        update: vi.fn()
      }
    },
    BeneficiaryRelativeRepo: {
      prisma: {
        createMany: vi.fn(),
        update: vi.fn()
      }
    }
  }
})

describe('BeneficiaryService.updateTaxHousehold', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // The update still occurs but maybe it should not ?..
  it('does not update tax households if not needed', async () => {
    await BeneficiaryService.updateTaxHousehold(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        id: 'beneficiary-1',
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: [
          {
            id: 'relative-1',
            caregiver: false,
            relationship: RelativeRelationship.Sibling
          },
          {
            id: 'relative-4',
            caregiver: true,
            linkedBeneficiary: { id: 'beneficiary-2' },
            relationship: RelativeRelationship.Conjoint
          }
        ]
      }
    )

    expect(BeneficiaryRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'beneficiary-1' },
      data: {
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: {
          create: [],
          update: [
            {
              where: { id: 'relative-1' },
              data: {
                caregiver: false,
                relationship: RelativeRelationship.Sibling,
                hosted: true,
                linkedBeneficiaryId: null
              }
            },
            {
              where: { id: 'relative-4' },
              data: {
                caregiver: true,
                linkedBeneficiaryId: 'beneficiary-2',
                relationship: RelativeRelationship.Conjoint,
                hosted: true
              }
            }
          ],
          delete: []
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).not.toHaveBeenCalled()
  })

  it('updates tax households without linked beneficiaries', async () => {
    await BeneficiaryService.updateTaxHousehold(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        id: 'beneficiary-1',
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: [
          {
            id: 'relative-1',
            caregiver: false,
            relationship: RelativeRelationship.Sibling
          },
          {
            id: 'relative-4',
            caregiver: true,
            linkedBeneficiary: { id: 'beneficiary-2' },
            birthDate: new Date('1997-01-01'),
            relationship: RelativeRelationship.Conjoint
          }
        ]
      }
    )

    expect(BeneficiaryRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'beneficiary-1' },
      data: {
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: {
          create: [],
          update: [
            {
              where: { id: 'relative-1' },
              data: {
                caregiver: false,
                relationship: RelativeRelationship.Sibling,
                hosted: true,
                linkedBeneficiaryId: null
              }
            },
            {
              where: { id: 'relative-4' },
              data: {
                caregiver: true,
                linkedBeneficiaryId: 'beneficiary-2',
                relationship: RelativeRelationship.Conjoint,
                hosted: true,
                birthDate: new Date('1997-01-01')
              }
            }
          ],
          delete: []
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).not.toHaveBeenCalled()
  })

  it('updates tax households with new tax households linked to beneficiaries and creates new opposite tax households', async () => {
    await BeneficiaryService.updateTaxHousehold(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        id: 'beneficiary-1',
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: [
          {
            id: 'relative-1',
            caregiver: false,
            relationship: RelativeRelationship.Sibling
          },
          {
            id: 'relative-4',
            caregiver: true,
            linkedBeneficiary: { id: 'beneficiary-2' },
            birthDate: new Date('1997-01-01'),
            relationship: RelativeRelationship.Conjoint
          },
          {
            id: 'relative-5',
            caregiver: false,
            relationship: RelativeRelationship.Parent,
            linkedBeneficiary: { id: 'beneficiary-3' }
          }
        ]
      }
    )

    expect(BeneficiaryRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'beneficiary-1' },
      data: {
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: {
          create: [
            {
              id: 'relative-5',
              caregiver: false,
              relationship: RelativeRelationship.Parent,
              linkedBeneficiaryId: 'beneficiary-3',
              hosted: true
            }
          ],
          update: [
            {
              where: { id: 'relative-1' },
              data: {
                caregiver: false,
                relationship: RelativeRelationship.Sibling,
                hosted: true,
                linkedBeneficiaryId: null
              }
            },
            {
              where: { id: 'relative-4' },
              data: {
                caregiver: true,
                linkedBeneficiaryId: 'beneficiary-2',
                relationship: RelativeRelationship.Conjoint,
                hosted: true,
                birthDate: new Date('1997-01-01')
              }
            }
          ],
          delete: []
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).toHaveBeenCalledWith({
      data: [
        {
          beneficiaryId: 'beneficiary-3',
          hosted: true,
          relationship: undefined,
          linkedBeneficiaryId: 'beneficiary-1'
        }
      ]
    })
  })

  it('updates tax households with existing tax households with new link to beneficiaries and creates new opposite tax households', async () => {
    await BeneficiaryService.updateTaxHousehold(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        id: 'beneficiary-1',
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: [
          {
            id: 'relative-1',
            caregiver: false,
            relationship: RelativeRelationship.Sibling,
            linkedBeneficiary: { id: 'beneficiary-3' }
          },
          {
            id: 'relative-4',
            caregiver: true,
            linkedBeneficiary: { id: 'beneficiary-2' },
            birthDate: new Date('1997-01-01'),
            relationship: RelativeRelationship.Conjoint
          }
        ]
      }
    )

    expect(BeneficiaryRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'beneficiary-1' },
      data: {
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: {
          create: [],
          update: [
            {
              where: { id: 'relative-1' },
              data: {
                caregiver: false,
                relationship: RelativeRelationship.Sibling,
                hosted: true,
                linkedBeneficiaryId: 'beneficiary-3'
              }
            },
            {
              where: { id: 'relative-4' },
              data: {
                caregiver: true,
                linkedBeneficiaryId: 'beneficiary-2',
                relationship: RelativeRelationship.Conjoint,
                hosted: true,
                birthDate: new Date('1997-01-01')
              }
            }
          ],
          delete: []
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).toHaveBeenCalledWith({
      data: [
        {
          beneficiaryId: 'beneficiary-3',
          hosted: true,
          relationship: RelativeRelationship.Sibling,
          linkedBeneficiaryId: 'beneficiary-1'
        }
      ]
    })
  })

  it('updates tax households with existing tax households with updated link to beneficiaries, creates new opposite tax households and unlink existing opposite tax households', async () => {
    await BeneficiaryService.updateTaxHousehold(
      {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      {
        id: 'beneficiary-1',
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: [
          {
            id: 'relative-1',
            caregiver: false,
            relationship: RelativeRelationship.Sibling
          },
          {
            id: 'relative-4',
            caregiver: true,
            linkedBeneficiary: { id: 'beneficiary-3' },
            birthDate: new Date('1997-01-01'),
            relationship: RelativeRelationship.Conjoint
          }
        ]
      }
    )

    expect(BeneficiaryRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'beneficiary-1' },
      data: {
        caregiver: false,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: 2,
        minorChildren: 0,
        taxHouseholds: {
          create: [],
          update: [
            {
              where: { id: 'relative-1' },
              data: {
                caregiver: false,
                relationship: RelativeRelationship.Sibling,
                hosted: true,
                linkedBeneficiaryId: null
              }
            },
            {
              where: { id: 'relative-4' },
              data: {
                caregiver: true,
                linkedBeneficiaryId: 'beneficiary-3',
                relationship: RelativeRelationship.Conjoint,
                hosted: true,
                birthDate: new Date('1997-01-01')
              }
            }
          ],
          delete: []
        }
      }
    })
    expect(BeneficiaryRelativeRepo.prisma.createMany).toHaveBeenCalledWith({
      data: [
        {
          beneficiaryId: 'beneficiary-3',
          hosted: true,
          relationship: RelativeRelationship.Conjoint,
          linkedBeneficiaryId: 'beneficiary-1'
        }
      ]
    })
    expect(BeneficiaryRelativeRepo.prisma.update).toHaveBeenCalledWith({
      where: { id: 'relative-4' },
      data: {
        linkedBeneficiaryId: null,
        firstName: 'Jean',
        lastName: 'Bénéficiaire 1'
      }
    })
  })
})
