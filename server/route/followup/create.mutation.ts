import { UserActivityType } from '@prisma/client'
import { createMutation as createMutationFn } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AddFollowupInput, addFollowupSchema } from '~/server/schema'
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
  input: AddFollowupInput
  ctx: ProtectedAppContext
}) => {
  return FollowupService.create({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddFollowupInput
) => {
  const permissions = await FollowupService.getCreatePermission(
    ctx.user,
    input.beneficiaryId
  )

  if (!permissions.create) {
    return false
  }
  const appPermissions = getAppContextPermissions(ctx)
  if (
    isNewOption(input.prescribingOrganizationId) &&
    !appPermissions.create.prescribingOrganization
  ) {
    return false
  }
  return true
}

export const create = createMutationFn({
  inputValidation: addFollowupSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'followup.create',
    target: 'Followup',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
