import { SecurityRuleGrantee } from '~/server/security'
import { isCreator, isInSameStructureAs } from '~/server/security/rules/helpers'
import {
  SecurityTargetWithCreator,
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

export const canViewPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) && isCreator(grantee, helpRequest)

export const helpRequestRule = {
  canEdit,
  canDelete,
  canEditPrivateSynthesis,
  canViewPrivateSynthesis
}
