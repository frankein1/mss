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
import { BeneficiaryRepo } from '~/server/database/repository'

const handler = async ({
  input,
  ctx
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: { id: true, referents: true }
  })

  return HelpRequestService.set({ ctx, input, beneficiary })
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
