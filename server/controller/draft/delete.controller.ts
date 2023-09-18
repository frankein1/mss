import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { canDeleteDraft } from '~/server/security/rules'

export const deleteDraftHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const draft = await prismaClient.draft.findUnique({
    where: {
      id: input.id
    }
  })

  if (!draft || !canDeleteDraft(user, draft)) {
    throw forbiddenError()
  }

  await prismaClient.draft.delete({
    where: { id: input.id }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Draft',
    objectId: draft.id
  })
}
