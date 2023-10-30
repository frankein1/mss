import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  UpdateNotificationInput,
  updateNotificationSchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { AllowSecurityCheck } from '~/server/security'
import { NotificationRepo } from '~/server/database'

const handler = async ({
  ctx: { user },
  input: { id, read }
}: {
  ctx: ProtectedAppContext
  input: UpdateNotificationInput
}) => {
  await NotificationRepo.prisma.updateMany({
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

export const updateNotificationMutation = createMutation({
  handler,
  inputValidation: updateNotificationSchema,
  securityCheck: AllowSecurityCheck
})
