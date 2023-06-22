import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import { hasAllowedRole, isStructureManager } from './helpers'

export const canCreateUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const canEditUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean => isStructureManager(grantee, target)

export const canEditUserRole = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  update: { role: UserRole }
): boolean =>
  isStructureManager(grantee, target) && update.role !== 'Administrator'

export const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
