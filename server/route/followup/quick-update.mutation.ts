import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee, canEditFollowup } from '~/server/security/rules'
import { prepareGetFollowupsPageSelect } from '~/utils/followup'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

const handler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const select = prepareGetFollowupsPageSelect(user)

  const fu = await prismaClient.followup.update({
    where: { id },
    data: rest,
    select
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Followup',
    objectId: id
  })

  return fu
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: QuickEditFollowupInput
) => {
  const target = await prismaClient.followup.findUniqueOrThrow({
    where: { id: input.id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
  return canEditFollowup(user, target)
}

export const quickUpdateFollowupMutation = createMutation({
  handler,
  inputValidation: quickEditFollowupSchema,
  securityCheck
})
