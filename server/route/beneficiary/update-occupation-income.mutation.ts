import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryOccupationInput
) => {
  const permissions = await BeneficiaryService.getUpdatePermission(
    ctx,
    input.id
  )
  return permissions.edit.occupationIncome
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )
  const permissions = getBeneficiaryPermissions({ ctx, beneficiary: target })
  const data = filterInput({ input, permissions })
  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data
  })

  return updatedBeneficiary
}

export const updateOccupationIncomeMutation = createMutation({
  inputValidation: updateBeneficiaryOccupationSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateOccupationIncome',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})

function filterInput({
  input,
  permissions
}: {
  input: UpdateBeneficiaryOccupationInput
  permissions: BeneficiaryPermissions
}) {
  const { set } = permissions
  const { id: _id, ...data } = input
  if (!set.ministereCategorie) {
    delete data.ministereCategorie
  }
  if (!set.ministereDepartementServiceAc) {
    delete data.ministereDepartementServiceAc
  }
  if (!set.ministereStructure) {
    delete data.ministereStructure
  }
  return data
}
