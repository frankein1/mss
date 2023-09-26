import { UserActivityType } from '@prisma/client'
import { UpdateNotificationInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const updateNotificationHandler = async ({
  ctx: { user },
  input: { id, read }
}: {
  ctx: ProtectedAppContext
  input: UpdateNotificationInput
}) => {
  await prismaClient.notification.updateMany({
    where: { id, recipientId: user.id },
    data: { read }
  })
  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Notification',
    objectId: id
  })
}
