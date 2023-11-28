import { Prisma, RelativeRelationship } from '@prisma/client'
import {
  BeneficiaryRepo,
  DraftRepo,
  BeneficiaryRelativeRepo
} from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

type PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput =
  Prisma.BeneficiaryRelativeCreateManyBeneficiaryInput & {
    hosted: true
    linkedBeneficiaryId: string
  }

function filterLinkedTaxHouseholds(
  relative: Prisma.BeneficiaryRelativeCreateManyBeneficiaryInput
): relative is PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput {
  return !!(relative.hosted && relative.linkedBeneficiaryId)
}

function getLinkedTaxHouseHouseholds(
  params: Prisma.BeneficiaryCreateArgs
): PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput[] {
  const { relatives } = params.data

  if (!relatives?.createMany) {
    return []
  }

  const { data } = relatives.createMany

  if (!Array.isArray(data)) {
    return getLinkedTaxHouseHouseholds({
      ...params,
      data: {
        ...params.data,
        relatives: { createMany: { data: [data] } }
      }
    })
  }

  return data.filter(filterLinkedTaxHouseholds)
}

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

function prepareOppositeRelative(
  {
    relationship,
    linkedBeneficiaryId
  }: PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput,
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

export async function create({
  user,
  params,
  draftId
}: {
  user: SecurityRuleGrantee
  params: Prisma.BeneficiaryCreateArgs
  draftId?: string
}) {
  const createdBeneficiary = await BeneficiaryRepo.prisma.create(params)

  const linkedTaxHouseholds = getLinkedTaxHouseHouseholds(params)

  if (linkedTaxHouseholds.length) {
    const linkedTaxHouseholdDatas = linkedTaxHouseholds.map(l =>
      prepareOppositeRelative(l, createdBeneficiary.id)
    )

    if (linkedTaxHouseholdDatas.length) {
      await BeneficiaryRelativeRepo.prisma.createMany({
        data: linkedTaxHouseholdDatas
      })
    }
  }

  if (draftId) {
    await DraftRepo.delete(user, {
      where: {
        id: draftId
      }
    })
  }

  return createdBeneficiary
}
