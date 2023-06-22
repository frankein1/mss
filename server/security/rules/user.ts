import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import { hasAllowedRole, isStructureManager } from './helpers'

export const canCreateUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const canEditUser = (
  grantee: SecurityRuleGrantee,
  user: SecurityTargetWithStructure
): boolean => isStructureManager(grantee, user)

export const canEditUserRole = (
  grantee: SecurityRuleGrantee,
  user: SecurityTargetWithStructure,
  update: { role: UserRole }
): boolean =>
  isStructureManager(grantee, user) && update.role !== 'Administrator'

export const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
