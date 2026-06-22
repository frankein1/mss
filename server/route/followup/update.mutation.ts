import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { EditFollowupInput } from '~/server/schema'
import { editFollowupSchema } from '~/server/schema'
import {
  getAppContextPermissions,
  type SecurityRuleContext
} from '~/server/security'

import { FollowupService } from '~/server/services'
import {
  validateRichTextSchema,
  validateSocialSupportPartnerOrganisations,
  validateSupportProgramId
} from '../helpers'
import { TRPCError } from '@trpc/server'

const handler = ({
  input,
  ctx
}: {
  input: EditFollowupInput
  ctx: ProtectedAppContext
}) => {
  if (
    input.synthesisRichText != null &&
    !validateRichTextSchema(input.synthesisRichText)
  ) {
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'Invalid JSON was received by the server'
    })
  }
  if (
    input.privateSynthesisRichText != null &&
    !validateRichTextSchema(input.privateSynthesisRichText)
  ) {
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'Invalid JSON was received by the server'
    })
  }
  return FollowupService.update({ input, ctx })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditFollowupInput
) => {
  const permissions = await FollowupService.getEditionPermissions(ctx, input.id)
  // CAN EDIT FU
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
