import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { EditHelpRequestServerInput } from '~/server/schema'
import { editHelpRequestSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { HelpRequestService } from '~/server/services'
import { checkRedirectionPermissions } from '../socialSupport/utils'

const handler = ({
  input,
  ctx
}: {
  input: EditHelpRequestServerInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.update({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditHelpRequestServerInput
) => {
  const permissions = await HelpRequestService.getEditionPermissions(
    ctx,
    input.id
  )
  // Check permissions
  if (!permissions.edit) {
    return false
  }
  const appPermissions = getAppContextPermissions(ctx)
  if (input.privateSynthesis && !permissions.set.privateSynthesis) {
    return false
  }

  // check minister permissions
  if (
    (input.numeroPegase || input.ministerId) &&
    !appPermissions.module.ministere
  ) {
    return false
  }

  // check if partnerOrganization and partnerOrganizationContact are part of the structure
  if (input.socialSupportRedirections?.length) {
    return await checkRedirectionPermissions(
      input.socialSupportRedirections,
      ctx
    )
  }

  return true
}

export const update = createMutation({
  securityCheck,
  inputValidation: editHelpRequestSchema,
  handler,
  auditLog: {
    key: 'helpRequest.update',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
