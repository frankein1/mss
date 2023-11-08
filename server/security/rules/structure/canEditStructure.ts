import { hasAllowedRole } from '../helpers'
import { SecurityRuleGrantee } from '../types'

export const canEditStructure = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
