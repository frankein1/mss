import type { SecurityRuleGrantee } from './types'
import { hasAllowedRole } from './helpers'

export const canViewStats = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canViewStatsByReferent = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['StructureManager'])
