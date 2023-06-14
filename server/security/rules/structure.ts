import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import { isAdministrator, isStructureManager } from './helpers'

export const canEditStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)
