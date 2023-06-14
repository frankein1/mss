import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  AllowedRoles,
  SecurityTargetWithReferents
} from './types'
import { hasAllowedRole, isInSameStructureAs, isReferentFor } from './helpers'

export type { SecurityTargetWithStructure, SecurityTargetWithReferents }

export {
  canCreateUser,
  canEditUser,
  canEditUserRole,
  canListUsers
} from './user'

export { canEditItsOwnStructure } from './structure'

export {
  canListBeneficiaries,
  canOnlyListItsBeneficiaries,
  canCreateBeneficiary,
  canViewBeneficiary,
  canEditBeneficiaryGeneralInformation,
  canEditBeneficiaryRelatives,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryExternalOrganisations,
  canDeleteBeneficiary,
  canEditBeneficiaryReferents
} from './beneficiary'

export type SecurityTargetWithCreator = {
  createdById: string | null
}

// Grantee role utilities
export const isCreator = (
  grantee: SecurityRuleGrantee,
  target: { createdById?: string | null },
  allowedRoles: AllowedRoles
) => grantee.id === target.createdById && hasAllowedRole(grantee, allowedRoles)

export type SecurityRule<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = unknown,
  SecurityParameters = unknown
> = (
  grantee: Grantee,
  target: Target,
  securityParameters: SecurityParameters
) => boolean

// A rule is a synchronous function taking
// -- grantee (the authenticated user)
// -- target (aggregate info or scope of the action)
// -- params (specifics about the action)
export const canAddBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canEditBeneficiaryDocument = canAddBeneficiaryDocument

export const canViewBeneficiaryDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryFollowups = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) ||
  isCreator(grantee, followup, ['ReceptionAgent']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowupSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isCreator(grantee, followup, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryFollowupPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  _: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  isCreator(grantee, followup, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canEditBeneficiaryFollowupPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator
): boolean =>
  isCreator(grantee, followup, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canEditBeneficiaryHelpRequestPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isCreator(grantee, helpRequest, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canEditBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, followup, [
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canAddCommentToBeneficiaryFollowup = canListBeneficiaryFollowups
export const canListCommentsToBeneficiaryFollowup = canViewBeneficiaryFollowup

export const canDeleteBeneficiaryFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, followup, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canCreateBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canListBeneficiaryHelpRequests = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canAccessProtectedDataInHelpRequest = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canViewBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  followup: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isCreator(grantee, followup, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequestSynthesis = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isCreator(grantee, helpRequest, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHelpRequestPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  _: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  isCreator(grantee, helpRequest, [
    'Administrator',
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ])

export const canEditBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager']) ||
  isCreator(grantee, helpRequest, ['SocialWorker', 'Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canAddCommentToBeneficiaryHelpRequest =
  canListBeneficiaryHelpRequests
export const canListCommentsToBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) ||
  isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiaryHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents,
  helpRequest: SecurityTargetWithCreator
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  isCreator(grantee, helpRequest, ['Instructor']) ||
  isReferentFor(grantee, beneficiary)

export const canAccessSocialRightsSimulator = (): boolean => true

export const canAccessFollowupsPage = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canExportFollowupsData = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canAccessStatsPage = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canExportStats = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, target, ['StructureManager', 'SocialWorker'])

export const canCreatePrescribingOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canCreateInstructorOrganization = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])
