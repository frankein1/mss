import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateHousingHelpRequestInput } from '~/server/schema'
import { createHousingHelpRequestSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { HousingHelpRequestService, FamilyFileService } from '~/server/services'
import { checkRedirectionPermissions } from '../socialSupport/utils'

const handler = ({
  input,
  ctx
}: {
  input: CreateHousingHelpRequestInput
  ctx: ProtectedAppContext
}) => {
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
