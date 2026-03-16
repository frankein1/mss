import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { EditFollowupInput } from '~/server/schema'
import { editFollowupSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'

import { FollowupService } from '~/server/services'
import { validateRichTextSchema } from '../helpers'
import { TRPCError } from '@trpc/server'
import { checkRedirectionPermissions } from '../socialSupport/utils'

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

  // CAN EDIT PRIVATE SYNTHESIS
  if (input.privateSynthesis && !permissions.set.privateSynthesis) {
    return false
  }

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
