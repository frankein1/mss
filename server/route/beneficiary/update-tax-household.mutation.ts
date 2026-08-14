import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { SecurityRuleContext } from '~~/server/security'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { UpdateBeneficiaryTaxHouseholdInput } from '~~/server/schema'
import { updateBeneficiaryTaxHouseholdSchema } from '~~/server/schema'
import { BeneficiaryService } from '~~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryTaxHouseholdInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.general
}

const handler = ({
  input,
  ctx: _ctx
}: {
  input: UpdateBeneficiaryTaxHouseholdInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.updateTaxHousehold(input)

export const updateTaxHouseholdMutation = createMutation({
  inputValidation: updateBeneficiaryTaxHouseholdSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateTaxHousehold',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
