import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditFollowupInput, editFollowupSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

import { isNewOption } from '~/utils/options'
import { FollowupService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: EditFollowupInput
  ctx: ProtectedAppContext
}) => {
  return FollowupService.update({ input, ctx })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditFollowupInput
) => {
  const permissions = await FollowupService.getEditionPermission(
    ctx.user,
    input.id
  )
  // CAN EDIT FU
  if (!permissions.edit) {
    return false
  }

  const appPermissions = getAppContextPermissions(ctx)
  if (
    isNewOption(input.prescribingOrganizationId) &&
    !appPermissions.create.prescribingOrganization
  ) {
    return false
  }

  // CAN EDIT PRIVATE SYNTHESIS
  if (input.privateSynthesis && !permissions.set.privateSynthesis) {
    return false
  }

  return true
}

export const update = createMutation({
  handler,
  inputValidation: editFollowupSchema,
  securityCheck,
  auditLog: {
    key: 'followup.update',
    target: 'Followup',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
