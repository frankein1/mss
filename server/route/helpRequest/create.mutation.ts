import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { HelpRequestService, BeneficiaryService } from '~/server/services'

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
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.beneficiaryId
  )
  return permissions.create.helpRequest
}

export const create = createMutation({
  handler,
  inputValidation: createHelpRequestSchema,
  securityCheck,
  auditLog: {
    key: 'helpRequest.create',
    target: 'HelpRequest',
    targetId: ({ routeResult }) => {
      return routeResult.helpRequest.id
    },
    action: UserActivityType.CREATE
  }
})
