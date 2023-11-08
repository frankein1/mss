import { SecurityRuleGrantee } from '~/server/security'
import {
  isCreator,
  isInSameStructureAs,
  isReferentFor
} from '~/server/security/rules/helpers'
import {
  SecurityTargetWithCreator,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security/rules/types'

const canCreate = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

const canEdit = (
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

const canDelete = (
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

export const followupRule = {
  canCreate,
  canEdit,
  canDelete,
  canEditPrivateSynthesis
}
