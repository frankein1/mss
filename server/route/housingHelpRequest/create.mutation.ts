import { UserActivityType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateHousingHelpRequestInput } from '~/server/schema'
import { createHousingHelpRequestSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { HousingHelpRequestService, FamilyFileService } from '~/server/services'
import {
  validateRichTextSchema,
  validateSocialSupportPartnerOrganisations,
  validateSupportProgramId
} from '../helpers'

const handler = ({
  input,
  ctx
}: {
  input: CreateHousingHelpRequestInput
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
  return HousingHelpRequestService.create({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateHousingHelpRequestInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  // Check permissions
  if (!permissions.create.helpRequest) {
    return false
  }

  if (!(await validateSupportProgramId(ctx.user, input.supportProgramId))) {
    return false
  }

  return validateSocialSupportPartnerOrganisations(ctx.user, input)
}

export const create = createMutation({
  handler,
  inputValidation: createHousingHelpRequestSchema,
  securityCheck,
  auditLog: {
    key: 'housingHelpRequest.create',
    target: 'HousingHelpRequest',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
