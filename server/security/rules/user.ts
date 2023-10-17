import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import {
  hasAllowedRole,
  isInSameStructure,
  isStructureManager
} from './helpers'

export const canCreateUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const canEditUser = (
  grantee: SecurityRuleGrantee,
  user: SecurityTargetWithStructure
): boolean => isStructureManager(grantee) && isInSameStructure(grantee, user)

export const canEditUserRole = (
  grantee: SecurityRuleGrantee,
  user: SecurityTargetWithStructure,
  update: { role: UserRole }
): boolean =>
  isStructureManager(grantee) &&
  isInSameStructure(grantee, user) &&
  update.role !== 'Administrator'

export const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
