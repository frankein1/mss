import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { HelpRequestService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: QuickEditHelpRequestInput
) => {
  const permissions = await HelpRequestService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit
}

const handler = async ({
  input,
  ctx
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  return await HelpRequestService.quickUpdate(ctx, input)
}

export const quickUpdate = createMutation({
  securityCheck,
  inputValidation: quickEditHelpRequestSchema,
  handler,
  auditLog: {
    key: 'helpRequest.quickUpdate',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
