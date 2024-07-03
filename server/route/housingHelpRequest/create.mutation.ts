import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHousingHelpRequestInput,
  createHousingHelpRequestSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { HousingHelpRequestService, FamilyFileService } from '~/server/services'

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
  return permissions.create.helpRequest
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
