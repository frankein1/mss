import { Prisma } from '@prisma/client'
import { BeneficiaryRepo, BeneficiaryRelativeRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import {
  filterLinkedTaxHouseholds,
  prepareOppositeRelative
} from '~/utils/relatives'

function getBeneficiaryWithTaxHousehold(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      relatives: {
        include: { linkedBeneficiary: true },
        where: { hosted: true }
      }
    }
  })
}

type BeneficiaryTaxHouseholds = Prisma.PromiseReturnType<
  typeof getBeneficiaryWithTaxHousehold
>['relatives']

function filterEmptyTaxHousehold(
  taxHousehold: Exclude<
    UpdateBeneficiaryTaxHouseholdInput['taxHouseholds'],
    undefined | null
  >[0]
) {
  return Object.entries(taxHousehold).some(
    ([key, value]) => key !== 'id' && !!value
  )
}

type UpdateBeneficiaryTaxHouseholdInputTaxHouseholds = Exclude<
  UpdateBeneficiaryTaxHouseholdInput['taxHouseholds'],
  undefined | null
>

function prepareTaxHouseholdsUpdates(
  taxHouseholds: UpdateBeneficiaryTaxHouseholdInputTaxHouseholds,
  previousTaxHouseholds: BeneficiaryTaxHouseholds
) {
  const newTaxHouseholds = taxHouseholds
    .filter(filterEmptyTaxHousehold)
    .map(e => {
      const { linkedBeneficiary, ...data } = e
      return {
        hosted: true,
        linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
        ...data
      }
    })

  return prepareRelationUpdates(newTaxHouseholds, previousTaxHouseholds)
}

type TaxHouseholdsUpdates = ReturnType<typeof prepareTaxHouseholdsUpdates>

async function createOppositeTaxHouseholds(
  {
    create: createdTaxHouseholds,
    update: updatedTaxHouseholds
  }: TaxHouseholdsUpdates,
  beneficiaryId: string
) {
  const createdLinkedTaxHouseholds = createdTaxHouseholds.filter(
    filterLinkedTaxHouseholds
  )

  const linkedTaxHouseholdDatas = createdLinkedTaxHouseholds.map(l =>
    prepareOppositeRelative(l, beneficiaryId)
  )

  await BeneficiaryRelativeRepo.prisma.createMany({
    data: linkedTaxHouseholdDatas
  })

  // TODO: Create opposite tax households for updatedTaxHouseholds that where not linked
}

export async function updateTaxHousehold(
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) {
  // TODO: Create opposite taxhouseholds or remove them
  const { id: beneficiaryId, taxHouseholds, ...taxHouseholdDatas } = input

  const beneficiary = await getBeneficiaryWithTaxHousehold(user, beneficiaryId)

  const data = {
    ...taxHouseholdDatas,
    taxHouseholds: prepareTaxHouseholdsUpdates(
      taxHouseholds || [],
      beneficiary.relatives
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data
  })

  await createOppositeTaxHouseholds(data.taxHouseholds, beneficiaryId)

  return updatedBeneficiary
}
