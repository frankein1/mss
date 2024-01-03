import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator
} from '../rules'
import { isInSameStructureAs, isReferentFor, isCreator } from '../rules/helpers'

export type FollowupPermissions = {
  edit: boolean
  select: boolean
  create: boolean
  set: {
    privateSynthesis: boolean
  }
  get: {
    details: boolean
  }
  delete: boolean
}

export const getFollowupPermissions = ({
  user,
  beneficiary,
  followup
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  followup?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FollowupPermissions
  if (!followup) {
    permissions = getCreatePermissions({ user, beneficiary })
  } else {
    permissions = getEditPermissions({ user, beneficiary, followup })
  }

  return permissions
}

function getCreatePermissions({
  user,
  beneficiary
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
}): FollowupPermissions {
  return {
    create: canCreateFollowup(user, beneficiary),
    edit: false,
    select: false,
    set: {
      privateSynthesis: true
    },
    get: {
      details: true
    },
    delete: false
  }
}

function getEditPermissions({
  user,
  beneficiary,
  followup
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  followup: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FollowupPermissions {
  return {
    create: false,
    select: canViewFollowup(user, beneficiary),
    edit: canEditFollowup(user, followup),
    set: {
      privateSynthesis: accessPrivateSynthesis(user, followup)
    },
    get: {
      details: accessDetails(user, followup)
    },
    delete: canDeleteFollowup(user, followup)
  }
}

const canCreateFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

const accessPrivateSynthesis = (
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

const canEditFollowup = (
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

const canDeleteFollowup = (
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

const accessDetails = (
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

const canViewFollowup = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)
