import { UserActivityType } from '@prisma/client'
import { prepareHelpRequestCreateData } from './helper'
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
import { markFollowupTypeAsUsed, getStructureByUser } from '~/server/query'
import { BeneficiaryRepo, HelpRequestRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx

  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: input.beneficiaryId },
    select: { id: true, referents: true }
  })

  // FIXME: La création bug ou alors la page de modification ne charge pas bien

  const data = prepareHelpRequestCreateData(input, ctx, beneficiary)

  const helpRequest = await HelpRequestRepo.prisma.create({
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
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
