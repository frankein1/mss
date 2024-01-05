import { StructureType } from '@prisma/client'
import {
  SecurityRuleContext,
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canListDocuments
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
    document: boolean
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
    permissions = getCreatePermissions({ ctx })
  } else {
    permissions = getEditPermissions({ ctx, beneficiary })
  }

  return permissions
}

function getCreatePermissions({ ctx }: { ctx: SecurityRuleContext }) {
  const { structure } = ctx
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
      externalOrganisations: false,
      documents: false
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
      helpRequest: false,
      document: false
    },
    delete: {
      beneficiary: false
    }
  }
}

function getEditPermissions({
  ctx,
  beneficiary
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
}) {
  const { user, structure } = ctx
  const isMinistryAgent = structure.type === StructureType.Ministere
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
      accommodationZone: isMinistryAgent,
      nir: hasAccessNir(structure.type),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },
    set: {
      accommodationZone: isMinistryAgent,
      referents: setReferents(user, beneficiary),
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
      externalOrganisations: viewOrEditExtOrganisations,
      documents: canListDocuments(user, beneficiary)
    },
    create: {
      helpRequest: isHelpRequestCreatable(user, beneficiary),
      document: canAddDocument(user, beneficiary)
    },
    delete: {
      beneficiary: isDeletable(user, beneficiary)
    }
  }
}

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
