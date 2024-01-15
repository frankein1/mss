import { StructureType } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '../rules'
import { isInSameStructureAs, isReferentFor } from '../rules/helpers'

export type BeneficiaryPermissions = {
  edit: {
    general: boolean
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
  }
  view: {
    general: boolean
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
    documents: boolean
    history: boolean
  }
  get: {
    nir: boolean
  }
  set: {
    referents: boolean
    nir: boolean
  }

  create: {
    helpRequest: boolean
    document: boolean
    followup: boolean
    comment: boolean
  }
  delete: {
    beneficiary: boolean
  }
}

export const getBeneficiaryPermissions = ({
  ctx,
  beneficiary
}: {
  ctx: SecurityRuleContext
  beneficiary?: SecurityTargetWithStructure & SecurityTargetWithReferents
}) => {
  let permissions: BeneficiaryPermissions
  if (!beneficiary) {
    permissions = getCreationPermissions({ ctx })
  } else {
    permissions = getEditionPermissions({ ctx, beneficiary })
  }

  return permissions
}

function getCreationPermissions({ ctx }: { ctx: SecurityRuleContext }) {
  const { structure } = ctx
  const isEFS = structure.type === StructureType.EFS
  return {
    edit: {
      general: true,
      relatives: !isEFS,
      health: !isEFS,
      occupationIncome: !isEFS,
      externalOrganisations: true
    },
    view: {
      general: false,
      relatives: false,
      health: false,
      occupationIncome: false,
      externalOrganisations: false,
      documents: false,
      history: false
    },
    get: {
      nir: hasAccessNir(structure.type)
    },
    set: {
      referents: true,
      nir: hasAccessNir(structure.type)
    },

    create: {
      helpRequest: false,
      document: false,
      followup: false,
      comment: false
    },
    delete: {
      beneficiary: false
    }
  }
}

function getEditionPermissions({
  ctx,
  beneficiary
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
}) {
  const { user, structure } = ctx
  const viewOrEditRelatives = accessRelatives(user, structure.type, beneficiary)
  const viewOrEditHealth = accessHealth(user, structure.type, beneficiary)
  const viewOrEditOccupationIncome = accessOccupationIncome(
    user,
    structure.type,
    beneficiary
  )
  const viewOrEditExtOrganisations = accessExtOrganisations(user, beneficiary)
  const viewOrEditGeneral = accessGeneral(user, beneficiary)
  return {
    edit: {
      general: viewOrEditGeneral,
      relatives: viewOrEditRelatives,
      health: viewOrEditHealth,
      occupationIncome: viewOrEditOccupationIncome,
      externalOrganisations: viewOrEditExtOrganisations
    },
    get: {
      nir: hasAccessNir(structure.type)
    },
    set: {
      referents: setReferents(user, beneficiary),
      nir: hasAccessNir(structure.type)
    },
    view: {
      general: viewOrEditGeneral,
      relatives: viewOrEditRelatives,
      health: viewOrEditHealth,
      occupationIncome: viewOrEditOccupationIncome,
      externalOrganisations: viewOrEditExtOrganisations,
      documents: canListDocuments(user, beneficiary),
      history: accessHistory(user, beneficiary)
    },
    create: {
      helpRequest: isHelpRequestCreatable(user, beneficiary),
      document: canAddDocument(user, beneficiary),
      followup: canCreateFollowup(user, beneficiary),
      comment: canAddComment(user, beneficiary)
    },
    delete: {
      beneficiary: isDeletable(user, beneficiary)
    }
  }
}

const canAddComment = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

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

const canAddDocument = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

function hasAccessNir(type: StructureType) {
  return type === StructureType.Ccas || type === StructureType.Cias
}

function accessGeneral(
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
) {
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor',
      'ReceptionAgent'
    ]) || isReferentFor(grantee, beneficiary)
  )
}

function accessOccupationIncome(
  grantee: SecurityRuleGrantee,
  structureType: StructureType,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean {
  if (structureType === StructureType.EFS) {
    return false
  }
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor'
    ]) || isReferentFor(grantee, beneficiary)
  )
}

function accessHealth(
  grantee: SecurityRuleGrantee,
  structureType: StructureType,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean {
  if (structureType === StructureType.EFS) {
    return false
  }
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor'
    ]) || isReferentFor(grantee, beneficiary)
  )
}

const accessRelatives = (
  grantee: SecurityRuleGrantee,
  structureType: StructureType,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean => {
  if (structureType === StructureType.EFS) {
    return false
  }
  return (
    isInSameStructureAs(grantee, beneficiary, [
      'StructureManager',
      'SocialWorker',
      'Instructor'
    ]) || isReferentFor(grantee, beneficiary)
  )
}

const accessExtOrganisations = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const setReferents = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const isDeletable = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker'
  ]) || isReferentFor(grantee, beneficiary)

const isHelpRequestCreatable = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor'
  ]) || isReferentFor(grantee, beneficiary)

const canListDocuments = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)

const accessHistory = (
  grantee: SecurityRuleGrantee,
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
): boolean =>
  isInSameStructureAs(grantee, beneficiary, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent'
  ]) || isReferentFor(grantee, beneficiary)
