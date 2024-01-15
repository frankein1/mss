import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  UserRole,
  UserStatus,
  BeneficiaryFamilySituation,
  RelativeRelationship
} from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import { BeneficiaryRepo } from '~/server/database'

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
    }
  }
})

describe('BeneficiaryService.updateTaxHousehold', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // FIXME: The update still occurs but maybe it should not ?..
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
        relatives: {
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
  })

  it('updates tax households', async () => {
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
        relatives: {
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
  })
})
