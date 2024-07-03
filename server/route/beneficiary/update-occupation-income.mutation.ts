import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  AppContextPermissions,
  SecurityRuleContext,
  getAppContextPermissions
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
  const permissions = await BeneficiaryService.getEditionPermissions(
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
  const appPermissions = getAppContextPermissions(ctx)
  const data = filterInput({ input, appPermissions })
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
  appPermissions
}: {
  input: UpdateBeneficiaryOccupationInput
  appPermissions: AppContextPermissions
}) {
  const { module } = appPermissions
  const { id: _id, ...data } = input
  if (!module.ministere) {
    delete data.ministereCategorie
    delete data.ministereDepartementServiceAc
    delete data.ministereStructure
  }
  return data
}
