import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  UpdateNotificationInput,
  updateNotificationSchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
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
}

export const updateNotificationMutation = createMutation({
  handler,
  inputValidation: updateNotificationSchema,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    target: 'Notification',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
