import { UserActivityType } from '@prisma/client'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserService } from '~/server/services'
import { createMutation } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'

const securityCheck = AllowSecurityCheck

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return UserService.sendAuthorizationCode(ctx)
}

export const authorizeExportMutation = createMutation({
  inputValidation: emptySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'user.authorize-export',
    target: 'User',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.UPDATE
  }
})
