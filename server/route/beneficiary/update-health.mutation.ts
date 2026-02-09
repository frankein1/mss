import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { UpdateBeneficiaryHealthInput } from '~/server/schema'
import { updateBeneficiaryHealthSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import type { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryHealthInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  const appPermission = getAppContextPermissions(ctx)

  if (input.socialSecurityNumber && !appPermission.edit.health.nir) {
    return false
  }
  return appPermission.module.health && permissions.edit.health
}

const handler = async ({
  input,
  ctx: _ctx
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    select: { id: true },
    where: { id: input.id },
    data: input
  })

  return updatedBeneficiary
}

export const updateHealthMutation = createMutation({
  inputValidation: updateBeneficiaryHealthSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateHealth',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
