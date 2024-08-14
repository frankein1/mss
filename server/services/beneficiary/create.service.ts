import { BudgetIncomeType, Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { CreateBeneficiaryInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateBeneficiaryInput
}

export async function create(params: CreateParams) {
  const { ctx, input } = params
  const { referents, ...restOfInput } = input

  const fileNumber = generateFileNumber()

  const data: Prisma.BeneficiaryCreateInput = {
    fileNumber,
    structure: {
      connect: { id: ctx.structure.id }
    },
    createdBy: {
      connect: { id: ctx.user.id }
    },
    ...restOfInput,
    familyFile: {
      create: {
        structure: {
          connect: { id: ctx.structure.id }
        },
        referents: {
          connect: referents.map(referent => ({ id: referent }))
        },
        budget: {
          create: {
            expenses: {
              create: {}
            },
            incomes: {
              create: {
                type: BudgetIncomeType.Beneficiary
              }
            }
          }
        }
      }
    }
  }

  const { id, familyFileId } = await BeneficiaryRepo.prisma.create({
    data
  })

  return { id, familyFileId }
}
