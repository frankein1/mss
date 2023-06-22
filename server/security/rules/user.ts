import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee } from './types'
import { hasAllowedRole } from './helpers'

export const canCreateUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const canEditUser = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])

export const canEditUserRole = (
  grantee: SecurityRuleGrantee,
  update: { role: UserRole }
): boolean => canEditUser(grantee) && update.role !== UserRole.Administrator

export const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
