import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { CreateBeneficiaryInput } from '~/server/schema'
import { createBeneficiarySchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const securityCheck = AllowSecurityCheck

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
