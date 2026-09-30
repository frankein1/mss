import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { UpdateNotificationInput } from '~~/server/schema'
import { updateNotificationSchema } from '~~/server/schema'
import type { ProtectedAppContext } from '~~/server/trpc'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { NotificationRepo } from '~~/server/database'

const handler = async ({
  ctx: { user },
  input: { id, read }
}: {
  ctx: ProtectedAppContext
  input: UpdateNotificationInput
}) => {
  await NotificationRepo.prisma.updateMany({
    where: { id, recipientId: user.id },
    data: { read, readAt: read ? new Date() : null }
  })
}

export const updateNotificationMutation = createMutation({
  handler,
  inputValidation: updateNotificationSchema,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    key: 'notification.update',
    target: 'Notification',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
