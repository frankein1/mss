import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canCreateHelpRequest
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
  }
  get: {
    accommodationZone: boolean
    nir: boolean
    numeroPegase: boolean
    ministereCategorie: boolean
    ministereDepartementServiceAc: boolean
    ministereStructure: boolean
  }
  set: {
    accommodationZone: boolean
    referents: boolean
    nir: boolean
    numeroPegase: boolean
    ministereCategorie: boolean
    ministereDepartementServiceAc: boolean
    ministereStructure: boolean
  }

  create: {
    helpRequest: boolean
  }
  delete: {
    beneficiary: boolean
  }
}

export const getBeneficiaryPermissions = ({
  user,
  target,
  structure
}: {
  user: SecurityRuleGrantee
  target?: SecurityTargetWithStructure & SecurityTargetWithReferents
  structure: { type: StructureType }
}) => {
  let permissions: BeneficiaryPermissions
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
}) {
  const isMinistryAgent = structure.type === StructureType.Ministere
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
      externalOrganisations: false
    },
    get: {
      accommodationZone: isMinistryAgent,
      nir: hasAccessNir(structure.type),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },
    set: {
      accommodationZone: isMinistryAgent,
      referents: true,
      nir: hasAccessNir(structure.type),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },

    create: {
      helpRequest: false
    },
    delete: {
      beneficiary: false
    }
  }
}

function getEditPermissions({
  user,
  target,
  structure
}: {
  user: SecurityRuleGrantee
  target: SecurityTargetWithStructure & SecurityTargetWithReferents
  structure: { type: StructureType }
}) {
  const isMinistryAgent = structure.type === StructureType.Ministere
  const viewOrEditRelatives = accessRelatives(user, structure.type, target)
  const viewOrEditHealth = accessHealth(user, structure.type, target)
  const viewOrEditOccupationIncome = accessOccupationIncome(
    user,
    structure.type,
    target
  )
  const viewOrEditExtOrganisations = accessExtOrganisations(user, target)
  const viewOrEditGeneral = accessGeneral(user, target)
  return {
    edit: {
      general: viewOrEditGeneral,
      relatives: viewOrEditRelatives,
      health: viewOrEditHealth,
      occupationIncome: viewOrEditOccupationIncome,
      externalOrganisations: viewOrEditExtOrganisations
    },
    get: {
      accommodationZone: isMinistryAgent,
      nir: hasAccessNir(structure.type),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },
    set: {
      accommodationZone: isMinistryAgent,
      referents: setReferents(user, target),
      nir: hasAccessNir(structure.type),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },
    view: {
      general: viewOrEditGeneral,
      relatives: viewOrEditRelatives,
      health: viewOrEditHealth,
      occupationIncome: viewOrEditOccupationIncome,
      externalOrganisations: viewOrEditExtOrganisations
    },
    create: {
      helpRequest: canCreateHelpRequest(user, target)
    },
    delete: {
      beneficiary: isDeletable(user, target)
    }
  }
}

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
