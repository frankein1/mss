import { RelativeRelationship } from '@prisma/client'
import { LinkedTaxHousehold } from '~/types/relative'

function getOppositeRelativeRelationship(relationship: RelativeRelationship) {
  switch (relationship) {
    case RelativeRelationship.Conjoint:
    case RelativeRelationship.Sibling:
    case RelativeRelationship.Tiers:
    case RelativeRelationship.AutreMemberDeLaFamille:
      return relationship
    default:
      return undefined
  }
}

export function prepareOppositeRelative(
  { relationship, linkedBeneficiaryId }: LinkedTaxHousehold,
  createdBeneficiaryId: string
) {
  return {
    beneficiaryId: linkedBeneficiaryId,
    hosted: true,
    linkedBeneficiaryId: createdBeneficiaryId,
    relationship: relationship
      ? getOppositeRelativeRelationship(relationship)
      : undefined
  }
}
