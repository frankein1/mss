import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canCreateHelpRequest,
  canDeleteBeneficiary,
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryReferents,
  canEditBeneficiaryRelatives,
  canListBeneficiaryRelatives,
  canViewBeneficiaryExternalOrganisations,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome
} from '../rules'

export type BeneficiaryPermissions = {
  edit: {
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
  }
  view: {
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
  return {
    edit: {
      relatives: true,
      health: true,
      occupationIncome: true,
      externalOrganisations: true
    },
    view: {
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
  return {
    edit: {
      relatives: canEditBeneficiaryRelatives(user, target),
      health: canEditBeneficiaryHealthInfo(user, target),
      occupationIncome: canEditBeneficiaryOccupationIncome(user, target),
      externalOrganisations: canEditBeneficiaryExternalOrganisations(
        user,
        target
      )
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
      relatives: canListBeneficiaryRelatives(user, target),
      health: canViewBeneficiaryHealthInfo(user, target),
      occupationIncome: canViewBeneficiaryOccupationIncome(user, target),
      externalOrganisations: canViewBeneficiaryExternalOrganisations(
        user,
        target
      )
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
