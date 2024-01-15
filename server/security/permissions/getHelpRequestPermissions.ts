import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext
} from '../rules'
import { isInSameStructureAs, isReferentFor, isCreator } from '../rules/helpers'

export type HelpRequestPermissions = {
  edit: boolean
  view: boolean
  get: {
    details: boolean
    privateSynthesis: boolean
  }
  set: {
    privateSynthesis: boolean
  }
  delete: boolean
}

export const getHelpRequestPermissions = ({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: HelpRequestPermissions
  if (!socialSupport) {
    permissions = getCreatePermissions()
  } else {
    permissions = getEditionPermission({ ctx, beneficiary, socialSupport })
  }

  return permissions
}

function getCreatePermissions(): HelpRequestPermissions {
  return {
    edit: true,
    view: true,
    get: {
      details: true,
      privateSynthesis: true
    },
    set: {
      privateSynthesis: true
    },
    delete: true
  }
}

function getEditionPermission({
  ctx,
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
}): HelpRequestPermissions {
  const { user } = ctx

  return {
    edit: isEditable(user, socialSupport),
    view: access(user, beneficiary),
    get: {
      details: accessDetails(user, beneficiary),
      privateSynthesis: accessPrivateSynthesis(user, socialSupport)
    },
    set: {
      privateSynthesis: isPrivateSynthesisEditable(user, socialSupport)
    },
    delete: isDeletable(user, socialSupport)
  }
}

const access = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

const accessDetails = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const accessPrivateSynthesis = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) && isCreator(grantee, socialSupport)

const isEditable = (
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

const isPrivateSynthesisEditable = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) && isCreator(grantee, socialSupport)

const isDeletable = (
  grantee: SecurityRuleGrantee,
  socialSupport: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, socialSupport, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, socialSupport, ['Instructor']) &&
    isCreator(grantee, socialSupport))
