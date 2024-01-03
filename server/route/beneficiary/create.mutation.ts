import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  CreateBeneficiaryInput,
  createBeneficiarySchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
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
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.CREATE
  }
})
