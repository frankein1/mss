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
  editRelatives: boolean
  editHealth: boolean
  editOccupationIncome: boolean
  editExternalOrganisations: boolean
  setAccomodationZone: boolean
  setReferents: boolean
  setNir: boolean
  setNumeroPegase: boolean
  setMinistereCategorie: boolean
  setMinistereDepartementServiceAc: boolean
  setMinistereStructure: boolean
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
    editRelatives: target ? canEditBeneficiaryRelatives(user, target) : true,
    editHealth: target ? canEditBeneficiaryHealthInfo(user, target) : true,
    editOccupationIncome: target
      ? canEditBeneficiaryOccupationIncome(user, target)
      : true,
    editExternalOrganisations: target
      ? canEditBeneficiaryExternalOrganisations(user, target)
      : true,
    setAccomodationZone: isMinistryAgent,
    setReferents: target ? canEditBeneficiaryReferents(user, target) : true,
    setNir: hasAccessBeneficiaryField(structure.type, 'nir'),
    setNumeroPegase: isMinistryAgent,
    setMinistereCategorie: isMinistryAgent,
    setMinistereDepartementServiceAc: isMinistryAgent,
    setMinistereStructure: isMinistryAgent
  }
  return permissions
}
