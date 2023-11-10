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
import { hasAccessBeneficiaryField } from '~/security/permission'

export type BeneficiaryEditPermission = {
  edit: {
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
  }
  set: {
    accomodationZone: boolean
    referents: boolean
    nir: boolean
    numeroPegase: boolean
    ministereCategorie: boolean
    ministereDepartementServiceAc: boolean
    ministereStructure: boolean
  }
  view: {
    relatives: boolean
    health: boolean
    occupationIncome: boolean
    externalOrganisations: boolean
    nir: boolean
  }
  create: {
    helpRequest: boolean
  }
  delete: {
    beneficiary: boolean
  }
}

export const getBeneficiaryEditPermissions = ({
  user,
  target,
  structure
}: {
  user: SecurityRuleGrantee
  target?: SecurityTargetWithStructure & SecurityTargetWithReferents
  structure: { type: StructureType }
}) => {
  let permissions: BeneficiaryEditPermission
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
    set: {
      accomodationZone: isMinistryAgent,
      referents: true,
      nir: hasAccessBeneficiaryField(structure.type, 'nir'),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    },
    view: {
      relatives: false,
      health: false,
      occupationIncome: false,
      externalOrganisations: false,
      nir: false
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
    set: {
      accomodationZone: isMinistryAgent,
      referents: canEditBeneficiaryReferents(user, target),
      nir: hasAccessBeneficiaryField(structure.type, 'nir'),
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
      ),
      nir: hasAccessBeneficiaryField(structure.type, 'nir')
    },
    create: {
      helpRequest: canCreateHelpRequest(user, target)
    },
    delete: {
      beneficiary: canDeleteBeneficiary(user, target)
    }
  }
}
