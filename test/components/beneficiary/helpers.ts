import { vi } from 'vitest'
import { UserStatus } from '@prisma/client'
import type { FamilyFilePermissions } from '~/server/security'
import type { BeneficiaryReferent } from '~/types/beneficiary'

export function createFakeTrpcClientBeneficiary() {
  return {
    beneficiary: {
      getSimilar: {
        query: vi.fn().mockResolvedValue(undefined)
      }
    }
  }
}

type FamilyFilePermissionsOverrides = {
  edit?: Partial<FamilyFilePermissions['edit']>
  view?: Partial<FamilyFilePermissions['view']>
  create?: Partial<FamilyFilePermissions['create']>
  delete?: boolean
  changeReferent?: boolean
}

export function createFakeFamilyFilePermissions(
  overrides?: FamilyFilePermissionsOverrides
): FamilyFilePermissions {
  return {
    edit: {
      general: true,
      relatives: true,
      health: true,
      occupationIncome: true,
      externalOrganisations: true,
      supportPrograms: true,
      ...overrides?.edit
    },
    view: {
      general: true,
      relatives: true,
      health: true,
      occupationIncome: true,
      externalOrganisations: true,
      supportPrograms: true,
      documents: true,
      history: true,
      ...overrides?.view
    },
    create: {
      helpRequest: true,
      document: true,
      followup: true,
      comment: true,
      ...overrides?.create
    },
    delete: overrides?.delete ?? true,
    changeReferent: overrides?.changeReferent ?? true
  }
}

export function createFakeAgent(
  overrides?: Partial<BeneficiaryReferent>
): BeneficiaryReferent {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Agent Test',
    status: UserStatus.Active,
    ...overrides
  }
}
