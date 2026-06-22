import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { EditHelpRequestInput } from '~/server/schema'
import { editHelpRequestSchema } from '~/server/schema'
import {
  getAppContextPermissions,
  type SecurityRuleContext
} from '~/server/security'
import { HelpRequestService } from '~/server/services'
import {
  validateSocialSupportPartnerOrganisations,
  validateSupportProgramId
} from '../helpers'

const handler = ({
  input,
  ctx
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.update({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditHelpRequestInput
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
  // Non-creators receive privateSynthesis as null (redacted by getOne);
  // null/undefined are allowed through, the service layer will keep the DB value for non-creators.
  // This could be improved by using undefined instead of null in getOne
  const hasPrivateSynthesis = typeof input.privateSynthesis === 'string'
  if (hasPrivateSynthesis && !permissions.set.privateSynthesis) {
    return false
  }

  // check minister permissions
  if (
    (input.numeroPegase || input.ministerId) &&
    !appPermissions.module.ministere
  ) {
    return false
  }

  if (!(await validateSupportProgramId(ctx.user, input.supportProgramId))) {
    return false
  }

  return validateSocialSupportPartnerOrganisations(ctx.user, input)
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
