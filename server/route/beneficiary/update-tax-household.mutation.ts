import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryTaxHouseholdInput,
  updateBeneficiaryTaxHouseholdSchema
} from '~/server/schema'
import { getStructureByUser } from '~/server/query'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) => {
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    grantee,
    input.id
  )
  const structure = await getStructureByUser(grantee)
  const permissions = getBeneficiaryPermissions({
    user: grantee,
    structure,
    target
  })
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
