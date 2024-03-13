import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data: {
      draft: false
    }
  })
}

export const validateBeneficiaryMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.validate',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.UPDATE
  }
})
