import { UserActivityType } from '@prisma/client'
import { prepareGetFollowupsPageSelect } from './helper/prepareGetFollowupsPageSelect'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canEditFollowup } from '~/server/security/rules'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { FollowupRepo } from '~/server/database'

const handler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const select = prepareGetFollowupsPageSelect(user)

  const fu = await FollowupRepo.prisma.update({
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
  const target = await FollowupRepo.findUniqueOrThrow(user, {
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
