import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { CreateBeneficiaryInput } from '~/server/schema'
import { createBeneficiarySchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import {
  validateBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import { UserRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateBeneficiaryInput
) => {
  return validateBelongsToStructure(ctx.user, input.referents, UserRepo.count)
}

const handler = ({
  input,
  ctx
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.create({
    ctx,
    input
  })
}

export const createBeneficiaryMutation = createMutation({
  inputValidation: createBeneficiarySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.create',
    target: 'Beneficiary',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
