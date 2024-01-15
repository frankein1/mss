import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditFollowupInput,
  quickEditFollowupSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { FollowupService } from '~/server/services'
import { SocialSupportRepo } from '~/server/database'

const handler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditFollowupInput
  ctx: ProtectedAppContext
}) => {
  await SocialSupportRepo.prisma.update({
    where: { id },
    data: rest
  })
  return FollowupService.get({ user, id })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: QuickEditFollowupInput
) => {
  const permissions = await FollowupService.getEditionPermission(
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
