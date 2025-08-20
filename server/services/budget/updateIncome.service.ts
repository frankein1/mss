import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'
import { BudgetIncomeRepo } from '~/server/database/repository'
import type { UpdateBudgetIncomeInput } from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'

export async function updateIncome({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: UpdateBudgetIncomeInput
}) {
  const { customs, ...data } = input

  const { customs: previousCustomIncomeIds } = await getIncomeWithCustomIncome(
    ctx.user,
    input.id
  )

  return await BudgetIncomeRepo.update(ctx.user, {
    where: { id: input.id },
    data: {
      ...data,
      customs: prepareRelationUpdates(
        customs.filter(filterOutEmptyElements),
        previousCustomIncomeIds
      )
    },
    select: { id: true }
  })
}

function filterOutEmptyElements(
  element: UpdateBudgetIncomeInput['customs'][0]
) {
  return Object.entries(element).some(([key, value]) => key !== 'id' && !!value)
}

async function getIncomeWithCustomIncome(
  user: SecurityRuleGrantee,
  id: string
) {
  return await BudgetIncomeRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      customs: { select: { id: true } }
    }
  })
}
