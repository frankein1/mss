import { UserActivityType } from '@prisma/client'
import { createMutation as createMutationFn } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { AddFollowupInput } from '~/server/schema'
import { addFollowupSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'

import { FamilyFileService, FollowupService } from '~/server/services'
import { TRPCError } from '@trpc/server'
import {
  validateRichTextSchema,
  validateSocialSupportPartnerOrganisations,
  validateSupportProgramId
} from '../helpers'

const handler = ({
  input,
  ctx
}: {
  input: AddFollowupInput
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
  return FollowupService.create({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: AddFollowupInput
) => {
  // Check permissions
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  if (!permissions.create.followup) {
    return false
  }

  if (!(await validateSupportProgramId(ctx.user, input.supportProgramId))) {
    return false
  }

  return validateSocialSupportPartnerOrganisations(ctx.user, input)
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
