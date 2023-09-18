import { StructureType } from '@prisma/client'
import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator
} from './types'
import {
  isInSameStructureAs,
  isReferentFor,
  hasAllowedRole,
  isCreator
} from './helpers'

export const canOnlyListItsBeneficiaries = (
  grantee: SecurityRuleGrantee
): boolean => hasAllowedRole(grantee, ['Referent'])

export const canViewBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryHealthInfo = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryOccupationIncome = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryExternalOrganisations = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canViewBeneficiaryNir = (
  type: StructureType | undefined
): boolean =>
  type === StructureType.Ccas ||
  type === StructureType.Cias ||
  type === StructureType.Commune

export const canEditBeneficiary = canViewBeneficiary
export const canEditBeneficiaryHealthInfo = canViewBeneficiaryHealthInfo
export const canEditBeneficiaryOccupationIncome =
  canViewBeneficiaryOccupationIncome
export const canEditBeneficiaryExternalOrganisations =
  canViewBeneficiaryExternalOrganisations
export const canSetBeneficiaryNir = canViewBeneficiaryNir

export const canSaveBeneficiaryWithCompleteInfo = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canEditBeneficiaryReferents = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

export const canDeleteBeneficiary = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure
): boolean => isInSameStructureAs(grantee, beneficiary, ['StructureManager'])

export const canSaveToBeneficiaryBeneficiaryDraft = (
  grantee: SecurityRuleGrantee,
  beneficiaryDraft: SecurityTargetWithCreator
): boolean => isCreator(grantee, beneficiaryDraft)
