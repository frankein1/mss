import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { getStructureByUser } from '~/server/query'
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
  user: SecurityRuleGrantee,
  input: CreateHelpRequestInput
) => {
  const [target, structure] = await Promise.all([
    BeneficiaryService.getBeneficiarySecurityTarget(user, input.beneficiaryId),
    getStructureByUser(user)
  ])
  const permissions = getBeneficiaryPermissions({ user, structure, target })
  return permissions.create.helpRequest
}

export const createHelpRequestMutation = createMutation({
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
