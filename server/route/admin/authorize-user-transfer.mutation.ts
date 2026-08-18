import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import { emptySchema } from '~~/server/schema'
import { UserService } from '~~/server/services'
import type { AdminContext } from '~~/server/trpc'

const adminHandler = async ({ ctx }: { ctx: AdminContext }) => {
  await UserService.sendAuthorizationCode(ctx, 'admin-user-transfer')
  return { sent: true }
}

export const authorizeUserTransfer = createMutation({
  inputValidation: emptySchema,
  adminHandler,
  auditLog: {
    key: 'admin.user.authorize-user-transfer',
    target: 'User',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.UPDATE
  }
})
