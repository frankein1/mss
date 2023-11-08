import { SecurityRuleGrantee } from '~/server/security'
import { isCreator, isInSameStructureAs, isReferentFor } from '~/server/security/rules/helpers'
import {
  SecurityTargetWithCreator,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security/rules/types'

const canDelete = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, helpRequest, ['Instructor']) &&
    isCreator(grantee, helpRequest))

const canCreate = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const canEdit = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, ['StructureManager']) ||
  (isInSameStructureAs(grantee, helpRequest, [
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) &&
    isCreator(grantee, helpRequest))

const canEditPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  history: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, history, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
    'ReceptionAgent'
  ]) && isCreator(grantee, history)

export const helpRequestRule = {
  canEdit,
  canCreate,
  canDelete,
  canEditPrivateSynthesis
}
