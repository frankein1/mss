import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleGrantee } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { FollowupService } from '~/server/services'

const handler = async ({
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await FollowupService.remove(id)
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const permissions = await FollowupService.getUpdatePermission(user, input.id)
  return permissions.delete
}

export const remove = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'followup.delete',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
