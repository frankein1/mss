import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator
} from '../rules'
import {
  isInSameStructureAs,
  isReferentFor,
  isCreator,
  hasAllowedRole
} from '../rules/helpers'

export type FollowupPermissions = {
  edit: boolean
  view: boolean
  get: {
    details: boolean
    dueDate: boolean
    privateSynthesis: boolean
  }
  set: {
    privateSynthesis: boolean
  }
  delete: boolean
}

export const getFollowupPermissions = ({
  user,
  beneficiary,
  socialSupport
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: FollowupPermissions
  if (!socialSupport) {
    permissions = getCreationPermissions()
  } else {
    permissions = getEditionPermission({ user, beneficiary, socialSupport })
  }

  return permissions
}

function getCreationPermissions(): FollowupPermissions {
  return {
    edit: false,
    view: false,
    set: {
      privateSynthesis: true
    },
    get: {
      details: true,
      dueDate: true,
      privateSynthesis: true
    },
    delete: false
  }
}

function getEditionPermission({
  user,
  beneficiary,
  socialSupport
}: {
  user: SecurityRuleGrantee
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): FollowupPermissions {
  return {
    view: canViewFollowup(user, beneficiary),
    edit: canEditFollowup(user, socialSupport),
    set: {
      privateSynthesis: accessPrivateSynthesis(user, socialSupport)
    },
    get: {
      details: accessDetails(user, socialSupport),
      dueDate: canViewAnyFollowupDetails(user),
      privateSynthesis: accessPrivateSynthesis(user, socialSupport)
    },
    delete: canDeleteFollowup(user, socialSupport)
  }
}

const accessPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent',
    'ReceptionAgent'
  ]) && isCreator(grantee, socialSupport)

const canEditFollowup = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, ['StructureManager']) ||
  (isInSameStructureAs(grantee, socialSupport, [
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent'
  ]) &&
    isCreator(grantee, socialSupport))

const canDeleteFollowup = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, ['StructureManager']) ||
  (isInSameStructureAs(grantee, socialSupport, [
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) &&
    isCreator(grantee, socialSupport))

const accessDetails = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) ||
  (isInSameStructureAs(grantee, socialSupport, ['ReceptionAgent']) &&
    isCreator(grantee, socialSupport))

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

const canViewAnyFollowupDetails = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])
