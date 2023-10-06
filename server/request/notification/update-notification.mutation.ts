import { UserActivityType } from '@prisma/client'
import { createMutation } from '../createRequest'
import {
  UpdateNotificationInput,
  updateNotificationSchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
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

export const updateNotificationMutation = createMutation({
  handler,
  inputValidation: updateNotificationSchema,
  securityCheck: AllowSecurityCheck
})
