import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type {
  AppContextPermissions,
  SecurityRuleContext
} from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryOccupationInput } from '~/server/schema'
import { updateBeneficiaryOccupationSchema } from '~/server/schema'
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
    select: { id: true },
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
  const { structure } = appPermissions
  const { id: _id, ...data } = input
  if (!structure.ministryFields) {
    delete data.ministereCategorie
    delete data.ministereDepartementServiceAc
    delete data.ministereStructure
  }
  return data
}
