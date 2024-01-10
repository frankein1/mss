import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { FollowupService } from '~/server/services'
import { FollowupRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  const { id, status } = input
  await FollowupRepo.prisma.update({
    where: { id },
    data: {
      socialSupport: {
        update: {
          status
        }
      }
    }
  })
  return FollowupService.get({ user, id })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: QuickEditFollowupInput
) => {
  const permissions = await FollowupService.getUpdatePermission(
    ctx.user,
    input.id
  )
  return permissions.edit
}

export const quickUpdate = createMutation({
  handler,
  inputValidation: quickEditFollowupSchema,
  securityCheck,
  auditLog: {
    key: 'followup.quickUpdate',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
