import { prepareHelpRequestUpdateData } from './helper'
import { HelpRequestRepo } from '~/server/database'
import { markFollowupTypeAsUsed } from '~/server/query'
import { EditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

type UpdateParams = {
  ctx: SecurityRuleContext
  input: EditHelpRequestInput
}

export async function update({ input, ctx }: UpdateParams) {
  const target = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      instructorOrganizationId: true,
      subject: true,
      documents: true
    }
  })

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
