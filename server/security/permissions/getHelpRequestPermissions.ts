import { StructureType } from '@prisma/client'
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

export type HelpRequestPermissions = {
  edit: boolean
  view: boolean
  get: {
    details: boolean
    numeroPegase: boolean
    ministre: boolean
    privateSynthesis: boolean
    anyDueDate: boolean
    anyAllocatedAmount: boolean
    anyPaymentMethod: boolean
    anyPaymentDate: boolean
    anyHandlingDate: boolean
    anyInstructorOrganization: boolean
    anyExaminationDate: boolean
    anyAskedAmount: boolean
  }
  set: {
    numeroPegase: boolean
    ministre: boolean
    privateSynthesis: boolean
  }
  delete: boolean
}

export const getHelpRequestPermissions = ({
  user,
  target,
  structure
}: {
  user: SecurityRuleGrantee
  target?: SecurityTargetWithCreator &
    SecurityTargetWithStructure & {
      beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
    }
  structure: { type: StructureType }
}) => {
  let permissions: HelpRequestPermissions
  if (!target) {
    permissions = getCreatePermissions({ structure })
  } else {
    permissions = getEditPermissions({ user, target, structure })
  }

  return permissions
}

function getCreatePermissions({
  structure
}: {
  structure: { type: StructureType }
}): HelpRequestPermissions {
  const isMinistryAgent = structure.type === StructureType.Ministere
  return {
    edit: true,
    view: true,
    get: {
      details: true,
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: true,
      anyDueDate: true,
      anyAllocatedAmount: true,
      anyPaymentMethod: true,
      anyPaymentDate: true,
      anyHandlingDate: true,
      anyInstructorOrganization: true,
      anyExaminationDate: true,
      anyAskedAmount: true
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
  user,
  target,
  structure
}: {
  user: SecurityRuleGrantee
  target: SecurityTargetWithCreator &
    SecurityTargetWithStructure & {
      beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
    }
  structure: { type: StructureType }
}): HelpRequestPermissions {
  const isMinistryAgent = structure.type === StructureType.Ministere
  const getAnyDataOfAny = accessAnyDataOfAny(user)
  return {
    edit: isEditable(user, target),
    view: access(user, target.beneficiary),
    get: {
      details: accessDetails(user, target.beneficiary),
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: accessPrivateSynthesis(user, target),
      anyDueDate: getAnyDataOfAny,
      anyAllocatedAmount: getAnyDataOfAny,
      anyPaymentMethod: getAnyDataOfAny,
      anyPaymentDate: getAnyDataOfAny,
      anyHandlingDate: getAnyDataOfAny,
      anyInstructorOrganization: getAnyDataOfAny,
      anyExaminationDate: getAnyDataOfAny,
      anyAskedAmount: getAnyDataOfAny
    },
    set: {
      numeroPegase: isMinistryAgent,
      ministre: isMinistryAgent,
      privateSynthesis: isPrivateSynthesisEditable(user, target)
    },
    delete: isDeletable(user, target)
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

const accessAnyDataOfAny = (grantee: SecurityRuleGrantee): boolean =>
  hasAllowedRole(grantee, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'Referent'
  ])

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
