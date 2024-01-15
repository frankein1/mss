import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryTaxHouseholdInput,
  updateBeneficiaryTaxHouseholdSchema
} from '~/server/schema'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryTaxHouseholdInput
) => {
  const permissions = await BeneficiaryService.getEditionPermission(
    ctx,
    input.id
  )
  return permissions.edit.relatives
}

const handler = ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryTaxHouseholdInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.updateTaxHousehold(user, input)

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
