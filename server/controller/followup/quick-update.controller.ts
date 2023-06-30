import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import type { QuickEditFollowupInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { canEditFollowup } from '~/server/security/rules'
import { prepareGetFollowupsPageSelect } from '~/utils/followup'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const quickUpdateFollowupHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const target = await prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })

  if (!target || !canEditFollowup(user, target)) {
    throw forbiddenError()
  }

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
