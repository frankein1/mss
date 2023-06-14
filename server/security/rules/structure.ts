import type { SecurityRuleGrantee, SecurityTargetWithStructure } from './types'
import {
  isAdministrator,
  isStructureManager,
  isInSameStructureAs
} from './helpers'

export const canViewStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canEditStructure = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean => isAdministrator(grantee) || isStructureManager(grantee, target)
