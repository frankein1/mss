import { prepareHelpRequestUpdateData } from './helper'
import { HelpRequestRepo } from '~/server/database'
import { markFollowupTypeAsUsed } from '~/server/query'
import { getHelpRequestWithRelations } from '~/server/query/helpRequests'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHelpRequestInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await getHelpRequestWithRelations(ctx.user, input.id)

  const data = prepareHelpRequestUpdateData(input, ctx, target)

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id: input.id },
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
