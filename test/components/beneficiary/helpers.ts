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

export function createFakeFamilyFilePermissions(
  overrides?: Partial<FamilyFilePermissions>
): FamilyFilePermissions {
  return {
    edit: {
      general: true,
      relatives: true,
      health: true,
      occupationIncome: true,
      externalOrganisations: true
    },
    view: {
      general: true,
      relatives: true,
      health: true,
      occupationIncome: true,
      externalOrganisations: true,
      documents: true,
      history: true
    },
    create: {
      helpRequest: true,
      document: true,
      followup: true,
      comment: true
    },
    delete: true,
    changeReferent: true,
    ...overrides
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
