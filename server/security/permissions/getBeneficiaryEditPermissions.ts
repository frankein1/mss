import { StructureType } from '@prisma/client'
import {
  SecurityRuleGrantee,
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canEditBeneficiaryReferents,
  canEditBeneficiaryRelatives
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
  const isMinistryAgent = structure.type === StructureType.Ministere
  const permissions: BeneficiaryEditPermission = {
    edit: {
      relatives: target ? canEditBeneficiaryRelatives(user, target) : true,
      health: target ? canEditBeneficiaryHealthInfo(user, target) : true,
      occupationIncome: target
        ? canEditBeneficiaryOccupationIncome(user, target)
        : true,
      externalOrganisations: target
        ? canEditBeneficiaryExternalOrganisations(user, target)
        : true
    },
    set: {
      accomodationZone: isMinistryAgent,
      referents: target ? canEditBeneficiaryReferents(user, target) : true,
      nir: hasAccessBeneficiaryField(structure.type, 'nir'),
      numeroPegase: isMinistryAgent,
      ministereCategorie: isMinistryAgent,
      ministereDepartementServiceAc: isMinistryAgent,
      ministereStructure: isMinistryAgent
    }
  }
  return permissions
}
