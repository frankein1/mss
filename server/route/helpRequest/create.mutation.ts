import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateHelpRequestServerInput } from '~/server/schema'
import { createHelpRequestSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { HelpRequestService, FamilyFileService } from '~/server/services'
import { checkRedirectionPermissions } from '../socialSupport/utils'

const handler = ({
  input,
  ctx
}: {
  input: CreateHelpRequestServerInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.create({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateHelpRequestServerInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )

  // Check permissions
  if (!permissions.create.helpRequest) {
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
