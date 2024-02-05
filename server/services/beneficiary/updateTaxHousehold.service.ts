import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates, prepareDateFields } from '~/utils/prisma'

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

type BeneficiaryTaxHouseholds = Array<
  Omit<
    Prisma.PromiseReturnType<
      typeof getBeneficiaryWithTaxHousehold
    >['relatives'][0],
    'linkedBeneficiary'
  > & { linkedBeneficiaryId: string | null }
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
      const { linkedBeneficiary, ...data } = e
      return {
        hosted: true,
        ...data,
        linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
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

  const flattenPreviousTaxHouseholds = previousTaxHouseholds.map(p => {
    const { linkedBeneficiary, ...data } = p
    return {
      ...data,
      linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
    }
  })

  const data = {
    ...taxHouseholdDatas,
    relatives: prepareTaxHouseholdsUpdates(
      taxHouseholds || [],
      flattenPreviousTaxHouseholds
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data
  })

  return updatedBeneficiary
}
