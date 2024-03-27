import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiaryWithTaxHousehold(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      relatives: {
        where: { hosted: true }
      }
    }
  })
}

type BeneficiaryTaxHouseholds = Array<
  Prisma.PromiseReturnType<
    typeof getBeneficiaryWithTaxHousehold
  >['relatives'][0]
>

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
      return {
        hosted: true,
        ...e
      }
    })

  return prepareRelationUpdates(newTaxHouseholds, previousTaxHouseholds)
}

export async function updateTaxHousehold(
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) {
  const { id: beneficiaryId, taxHouseholds, ...taxHouseholdDatas } = input

  const { relatives: previousTaxHouseholds } =
    await getBeneficiaryWithTaxHousehold(user, beneficiaryId)

  const data = {
    ...taxHouseholdDatas,
    relatives: prepareTaxHouseholdsUpdates(
      taxHouseholds || [],
      previousTaxHouseholds
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data
  })

  return updatedBeneficiary
}
