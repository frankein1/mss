import { HelpRequestRepo } from '~/server/database'
import { QuickEditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'

export async function quickUpdate(
  ctx: SecurityRuleContext,
  input: QuickEditHelpRequestInput
) {
  const { user } = ctx
  const { financialSupport } = await HelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id: input.id
    },
    select: {
      financialSupport: true
    }
  })

  const data = prepareData(financialSupport, input)

  return await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    select: {
      allocatedAmount: true,
      paymentMethod: true,
      paymentDate: true,
      fileInstruction: {
        select: {
          socialSupport: {
            select: {
              status: true
            }
          }
        }
      }
    }
  })
}

function prepareData(
  isFinancial: boolean,
  { id: _id, ...data }: QuickEditHelpRequestInput
) {
  if (isFinancial && ('allocatedAmount' in data || 'paymentMethod' in data)) {
    return data
  }

  if ('paymentDate' in data) {
    return data
  }

  return {}
}
