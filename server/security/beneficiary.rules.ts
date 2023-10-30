import { StructureType, UserRole } from '@prisma/client'
import { isInSameStructure, isReferentFor } from './helpers'
import {
  PermissionRule,
  PermissionRulesRole,
  SecurityRuleGrantee
} from './types'

const canReadWriteNIR = (type: StructureType | undefined): boolean =>
  type === StructureType.Ccas ||
  type === StructureType.Cias ||
  type === StructureType.Commune

export type BeneficiaryPermissionRules = {
  select: {
    general: PermissionRule
    detail: PermissionRule
    nir: typeof canReadWriteNIR
  }
  update: {
    general: PermissionRule
    detail: PermissionRule
    nir: typeof canReadWriteNIR
  }
  export: boolean
  delete: PermissionRule
}

const StructureManager: BeneficiaryPermissionRules = {
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  update: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  export: true,
  delete: isInSameStructure
}

const SocialWorker: BeneficiaryPermissionRules = {
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  update: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  export: false,
  delete: () => false
}

const Instructor: BeneficiaryPermissionRules = {
  select: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  update: {
    general: isInSameStructure,
    detail: isInSameStructure,
    nir: canReadWriteNIR
  },
  export: false,
  delete: () => false
}

const ReceptionAgent: BeneficiaryPermissionRules = {
  select: {
    general: isInSameStructure,
    detail: isReferentFor,
    nir: canReadWriteNIR
  },
  update: {
    general: isInSameStructure,
    detail: isReferentFor,
    nir: canReadWriteNIR
  },
  export: false,
  delete: () => false
}

const Referent: BeneficiaryPermissionRules = {
  select: {
    general: isReferentFor,
    detail: isReferentFor,
    nir: canReadWriteNIR
  },
  update: {
    general: isReferentFor,
    detail: isReferentFor,
    nir: canReadWriteNIR
  },
  export: false,
  delete: () => false
}

const permissionRules: {
  [key in PermissionRulesRole]: BeneficiaryPermissionRules
} = {
  [UserRole.StructureManager]: StructureManager,
  [UserRole.SocialWorker]: SocialWorker,
  [UserRole.Instructor]: Instructor,
  [UserRole.ReceptionAgent]: ReceptionAgent,
  [UserRole.Referent]: Referent
}

export const getBeneficiaryPermissionRules = (user: SecurityRuleGrantee) => {
  if (user.role === 'Administrator') {
    throw new Error('Administrator has no permission rules')
  }
  return permissionRules[user.role]
}
