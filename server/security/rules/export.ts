import type { SecurityRuleGrantee } from './types'
import { hasAllowedRole } from './helpers'

export const canExportHistory = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'Referent',
    'Instructor',
    'SocialWorker'
  ])
