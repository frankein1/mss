import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents
} from './types'
import {
  isAdministrator,
  isInSameStructureAs,
  isReferentFor,
  isActiveWithAllowedRole
} from './helpers'

export const canListBeneficiaries = (grantee: SecurityRuleGrantee): boolean =>
  isAdministrator(grantee) ||
  isActiveWithAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canOnlyListItsBeneficiaries = (
  grantee: SecurityRuleGrantee
): boolean => isActiveWithAllowedRole(grantee, ['Referent'])

export const canCreateBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ])

export const canEditBeneficiaryGeneralInformation = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])

export const canEditBeneficiaryRelatives = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])

export const canEditBeneficiaryHealthInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])

export const canEditBeneficiaryOccupationIncome = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])

export const canEditBeneficiaryExternalOrganisations = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])

export const canEditBeneficiaryReferents = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isAdministrator(grantee) ||
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
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ])
