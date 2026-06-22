import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateHelpRequestInput } from '~/server/schema'
import { createHelpRequestSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { HelpRequestService, FamilyFileService } from '~/server/services'
import {
  validateSocialSupportPartnerOrganisations,
  validateSupportProgramId
} from '../helpers'

const handler = ({
  input,
  ctx
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.create({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateHelpRequestInput
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
  inputValidation: createHelpRequestSchema,
  securityCheck,
  auditLog: {
    key: 'helpRequest.create',
    target: 'HelpRequest',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
