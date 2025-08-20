import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryEntourageInput } from '~/server/schema'
import { updateBeneficiaryEntourageSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryEntourageInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.relatives
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryEntourageInput
  ctx: ProtectedAppContext
}) => {
  return await BeneficiaryService.updateEntourage({ user, input })
}

export const updateEntourageMutation = createMutation({
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateEntourage',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
