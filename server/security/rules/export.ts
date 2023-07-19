import type { SecurityRuleGrantee } from './types'
import { hasAllowedRole } from './helpers'

export const canExport = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'Referent',
    'Instructor',
    'SocialWorker'
  ])
