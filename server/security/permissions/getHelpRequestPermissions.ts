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
  helpRequest
}: {
  ctx: SecurityRuleContext
  beneficiary?: SecurityTargetWithStructure & SecurityTargetWithReferents
  helpRequest?: SecurityTargetWithCreator & SecurityTargetWithStructure
}) => {
  let permissions: HelpRequestPermissions
  if (!helpRequest && !beneficiary) {
    permissions = getCreatePermissions({ ctx })
  }
  if (!helpRequest || !beneficiary) {
    throw new Error('help and beneficiary required')
  } else {
    permissions = getEditPermissions({ ctx, beneficiary, helpRequest })
  }

  return permissions
}

function getCreatePermissions({
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

function getEditPermissions({
  ctx,
  beneficiary,
  helpRequest
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
}): HelpRequestPermissions {
  const { user, structure } = ctx
  const isMinistryAgent = structure.type === StructureType.Ministere

  return {
    edit: isEditable(user, helpRequest),
    view: access(user, beneficiary),
    get: {
      details: accessDetails(user, beneficiary),
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: accessPrivateSynthesis(user, helpRequest)
    },
    set: {
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: isPrivateSynthesisEditable(user, helpRequest)
    },
    delete: isDeletable(user, helpRequest)
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
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) && isCreator(grantee, helpRequest)

const isEditable = (
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

const isPrivateSynthesisEditable = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ]) && isCreator(grantee, helpRequest)

const isDeletable = (
  grantee: SecurityRuleGrantee,
  helpRequest: SecurityTargetWithCreator & SecurityTargetWithStructure
): boolean =>
  isInSameStructureAs(grantee, helpRequest, [
    'StructureManager',
    'SocialWorker'
  ]) ||
  (isInSameStructureAs(grantee, helpRequest, ['Instructor']) &&
    isCreator(grantee, helpRequest))
