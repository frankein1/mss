import { StructureType } from '@prisma/client'
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
    numeroPegase: boolean
    ministre: boolean
    privateSynthesis: boolean
  }
  set: {
    numeroPegase: boolean
    ministre: boolean
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
    permissions = getCreationPermissions({ ctx })
  } else {
    permissions = getEditionPermission({ ctx, beneficiary, socialSupport })
  }

  return permissions
}

function getCreationPermissions({
  ctx
}: {
  ctx: SecurityRuleContext
}): HelpRequestPermissions {
  const { structure } = ctx
  const isMinistryAgent = structure.type === StructureType.Ministere
  return {
    edit: true,
    view: true,
    get: {
      details: true,
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: true
    },
    set: {
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
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
  const { user, structure } = ctx
  const isMinistryAgent = structure.type === StructureType.Ministere

  return {
    edit: isEditable(user, socialSupport),
    view: access(user, beneficiary),
    get: {
      details: accessDetails(user, beneficiary),
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: accessPrivateSynthesis(user, socialSupport)
    },
    set: {
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
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
