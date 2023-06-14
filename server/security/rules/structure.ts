import type { SecurityRuleGrantee } from './types'
import { hasAllowedRole } from './helpers'

export const canEditItsOwnStructure = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
