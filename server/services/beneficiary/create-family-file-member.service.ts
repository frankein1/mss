import type { Prisma } from '~/prisma/generated/client'
import { BeneficiaryStatus, BudgetIncomeType } from '~/prisma/generated/client'
import { BeneficiaryRepo, BudgetRepo } from '~/server/database'
import type { CreateFamilyFileMemberInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security/rules/types'
import { connect } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateFamilyFileMemberInput
}

async function getBudgetId(user: SecurityRuleGrantee, familyFileId: string) {
  return await BudgetRepo.findUniqueOrThrow(user, {
    where: { familyFileId },
    select: { id: true }
  })
}

export async function createFamilyFileMember(params: CreateParams) {
  const { ctx, input } = params

  const { familyFileId, ...restOfInput } = input
  const fileNumber = generateFileNumber()
  const { id: budgetId } = await getBudgetId(ctx.user, familyFileId)

  const data: Prisma.BeneficiaryCreateInput = {
    status: BeneficiaryStatus.Active,
    fileNumber,
    structure: connect(ctx.structure.id),
    createdBy: connect(ctx.user.id),
    lastActivity: new Date(),
    familyFile: {
      ...connect(familyFileId)
    },
    income: {
      create: {
        type: BudgetIncomeType.Beneficiary,
        budgetId
      }
    },
    ...restOfInput
  }

  const { id } = await BeneficiaryRepo.prisma.create({ data })

  return { id }
}
