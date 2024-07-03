import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import {
  UpdateBeneficiaryHealthInput,
  updateBeneficiaryHealthSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { ProtectedAppContext } from '~/server/trpc'
import { FamilyFileService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryHealthInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  const appPermission = getAppContextPermissions(ctx)
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
