import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canCreateHelpRequest,
  canDeleteBeneficiary,
  canViewBeneficiaryRelatives,
  canViewBeneficiaryExternalOrganisations,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canEditBeneficiaryReferents,
  canViewBeneficiaryGeneral
} from '../rules'

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
  const viewOrEditRelatives = canViewBeneficiaryRelatives(
    user,
    structure.type,
    target
  )
  const viewOrEditHealth = canViewBeneficiaryHealthInfo(
    user,
    structure.type,
    target
  )
  const viewOrEditOccupationIncome = canViewBeneficiaryOccupationIncome(
    user,
    structure.type,
    target
  )
  const viewOrEditExternalOrganisations =
    canViewBeneficiaryExternalOrganisations(user, target)
  const viewOrEditGeneral = canViewBeneficiaryGeneral(user, target)
  return {
    edit: {
      general: viewOrEditGeneral,
      relatives: viewOrEditRelatives,
      health: viewOrEditHealth,
      occupationIncome: viewOrEditOccupationIncome,
      externalOrganisations: viewOrEditExternalOrganisations
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
      referents: canEditBeneficiaryReferents(user, target),
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
      externalOrganisations: viewOrEditExternalOrganisations
    },
    create: {
      helpRequest: canCreateHelpRequest(user, target)
    },
    delete: {
      beneficiary: canDeleteBeneficiary(user, target)
    }
  }
}

function hasAccessNir(type: StructureType) {
  return type === StructureType.Ccas || type === StructureType.Cias
}
