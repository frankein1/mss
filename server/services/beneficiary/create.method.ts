import { Prisma } from '@prisma/client'
import {
  BeneficiaryRepo,
  DraftRepo,
  BeneficiaryRelativeRepo
} from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import {
  filterLinkedTaxHouseholds,
  prepareOppositeRelative
} from '~/utils/relatives'

type PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput =
  Prisma.BeneficiaryRelativeCreateManyBeneficiaryInput & {
    hosted: true
    linkedBeneficiaryId: string
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

async function createOppositeTaxHouseholds(
  linkedTaxHouseholds: PrismaLinkedTaxHouseholdCreateManyBeneficiaryInput[],
  createdBeneficiaryId: string
) {
  const linkedTaxHouseholdDatas = linkedTaxHouseholds.map(l =>
    prepareOppositeRelative(l, createdBeneficiaryId)
  )

  await BeneficiaryRelativeRepo.prisma.createMany({
    data: linkedTaxHouseholdDatas
  })
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
    await createOppositeTaxHouseholds(
      linkedTaxHouseholds,
      createdBeneficiary.id
    )
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
