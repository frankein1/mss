import { BudgetIncomeType, Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import { isSeparate, isMarried } from '~/utils/beneficiary'

function getBeneficiaryWithTaxHousehold(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      familyFile: {
        select: {
          budget: { select: { id: true } }
        }
      },
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

function filterOutEmptyTaxHousehold(
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
  previousTaxHouseholds: BeneficiaryTaxHouseholds,
  budgetId: string
) {
  const nonEmptyTaxHouseholds = taxHouseholds.filter(filterOutEmptyTaxHousehold)

  const relations = prepareRelationUpdates(
    nonEmptyTaxHouseholds,
    previousTaxHouseholds
  )

  // incomes are added only for created household members
  const create = relations.create.map(relation => ({
    hosted: true,
    income: {
      create: {
        budgetId,
        type: BudgetIncomeType.HouseholdMember
      }
    },
    ...relation
  }))

  return {
    ...relations,
    create
  }
}

export async function updateTaxHousehold(
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) {
  const {
    id: beneficiaryId,
    taxHouseholds,
    ...taxHouseholdDatas
  } = cleanInput(input)

  const {
    relatives: previousTaxHouseholds,
    familyFile: { budget }
  } = await getBeneficiaryWithTaxHousehold(user, beneficiaryId)

  const budgetId = budget?.id || ''

  const data = {
    ...taxHouseholdDatas,
    relatives: prepareTaxHouseholdsUpdates(
      taxHouseholds || [],
      previousTaxHouseholds,
      budgetId
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data
  })

  return updatedBeneficiary
}

function cleanInput(input: UpdateBeneficiaryTaxHouseholdInput) {
  if (!isSeparate(input.familySituation)) {
    input.divorceDate = null
  }
  if (!isMarried(input.familySituation)) {
    input.weddingDate = null
  }
  return input
}
