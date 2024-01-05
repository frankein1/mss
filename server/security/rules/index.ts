import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityRule,
  SecurityRuleContext,
  SecurityTargetWithCreator
} from './types'
import {
  hasAllowedRole,
  isReferent,
  isCreator,
  isInSameStructureAs
} from './helpers'
export { hasAllowedRole, isReferent, isCreator, isInSameStructureAs }

export * from './comment'

export type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityRuleContext,
  SecurityTargetWithReferents,
  SecurityRule,
  SecurityTargetWithCreator
}

export * from './health'

export {
  canCreateUser,
  canEditUser,
  canEditUserRole,
  canListUsers
} from './user'

export * from './structure'

export { canListDocuments } from './document'

export { canViewStats, canViewStatsByReferent } from './stats'

export {
  canExportBeneficiaries,
  canExportHistory,
  canExportStats
} from './export'

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)
export const canCreatePrescribingOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canCreateInstructorOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])
