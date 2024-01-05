import { UserRole } from '@prisma/client'
import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import { isInSameStructure, isStructureManager } from './helpers'

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
