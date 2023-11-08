import { SecurityRuleGrantee } from '~/server/security'
import {
  hasAllowedRole,
  isInSameStructureAs,
  isReferentFor
} from '~/server/security/rules/helpers'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security/rules/types'


const canCreateHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const canListBeneficiaryHelpRequests = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

  export const canViewHelpRequestDetails = (
    grantee: SecurityRuleGrantee,
    beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  ): boolean =>
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor'
    ]) || isReferentFor(grantee, beneficiary)
  
  export const canViewAnyHelpRequestDetails = (
    grantee: SecurityRuleGrantee
  ): boolean =>
    hasAllowedRole(grantee, [
      'StructureManager',
      'SocialWorker',
      'Instructor',
      'Referent'
    ])

const canViewHelpRequest = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

export const beneficiaryRule = {
  // Help Request
  canCreateHelpRequest,
  canViewHelpRequest,
  canViewAnyHelpRequestDetails,
  canViewHelpRequestDetails,
  canListBeneficiaryHelpRequests,
}
