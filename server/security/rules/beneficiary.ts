import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import {
  isInSameStructureAs,
  isReferentFor,
  hasAllowedRole,
  hasNotDisallowedRole
} from './helpers'

export const canOnlyListItsBeneficiaries = (
  grantee: SecurityRuleGrantee
): boolean => hasAllowedRole(grantee, ['Referent'])

export const canCreateBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canViewBeneficiary = (
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

export const canViewBeneficiaryRelatives = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canViewBeneficiary(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canViewBeneficiaryHealthInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canViewBeneficiary(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canViewBeneficiaryOccupationIncome = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canViewBeneficiary(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canViewBeneficiaryExternalOrganisations = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  canViewBeneficiary(grantee, beneficiary) &&
  hasNotDisallowedRole(grantee, ['ReceptionAgent'])

export const canEditBeneficiary = canViewBeneficiary
export const canEditBeneficiaryRelatives = canViewBeneficiaryRelatives
export const canEditBeneficiaryHealthInfo = canViewBeneficiaryHealthInfo
export const canEditBeneficiaryOccupationIncome =
  canViewBeneficiaryOccupationIncome
export const canEditBeneficiaryExternalOrganisations =
  canViewBeneficiaryExternalOrganisations

export const canEditBeneficiaryReferents = (
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

export const canDeleteBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  hasAllowedRole(grantee, ['Administrator']) ||
  isInSameStructureAs(grantee, beneficiary, ['StructureManager'])
