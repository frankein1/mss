import { prepareHelpRequestCreateData } from './helper'
import { BeneficiaryRepo, HelpRequestRepo } from '~/server/database'
import { CreateHelpRequestInput } from '~/server/schema'
import { markFollowupTypeAsUsed } from '~/server/query'
import { SecurityRuleContext } from '~/server/security/rules/types'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateHelpRequestInput
  target?: undefined
}

export async function create({ input, ctx }: CreateParams) {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: { id: true, referents: true }
  })

  const data = prepareHelpRequestCreateData(input, ctx, beneficiary)

  const helpRequest = await HelpRequestRepo.prisma.create({
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
}
