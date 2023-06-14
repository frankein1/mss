import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import { isAdministrator, isStructureManager } from './helpers'

export const canCreateUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canEditUser = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)

export const canEditUserRole = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
  update: { role: UserRole }
): boolean =>
  isAdministrator(grantee) ||
  (isStructureManager(grantee, target) &&
    update.role !== UserRole.Administrator)

export const canListUsers = (grantee: SecurityRuleGrantee): boolean =>
  isAdministrator(grantee) || isStructureManager(grantee)
