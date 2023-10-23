import type {
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
  SecurityTargetWithReferents,
  SecurityTargetWithCreator
} from './types'
import { isInSameStructureAs, isCreator, hasAllowedRole } from './helpers'
import { BeneficiaryRules } from '~/server/security'

export const canCreateFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRules.select.general(grantee, beneficiary)

export const canListBeneficiaryFollowups = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRules.select.general(grantee, beneficiary)

export const canViewFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => BeneficiaryRules.select.general(grantee, beneficiary)

export const canViewFollowupDetails = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, followup, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) ||
  (isInSameStructureAs(grantee, followup, ['ReceptionAgent']) &&
    isCreator(grantee, followup))

export const canViewAnyFollowupDetails = (
  grantee: SecurityRuleGrantee
): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

export const canViewFollowupPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, followup, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ]) && isCreator(grantee, followup)

export const canEditFollowupPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, followup, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
    'ReceptionAgent'
  ]) && isCreator(grantee, followup)

export const canEditFollowup = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, followup, ['StructureManager']) ||
  (isInSameStructureAs(grantee, followup, [
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ]) &&
    isCreator(grantee, followup))

export const canDeleteFollowup = (
  grantee: SecurityRuleGrantee,
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, followup, ['StructureManager']) ||
  (isInSameStructureAs(grantee, followup, [
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) &&
    isCreator(grantee, followup))
