import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryOccupationIncome
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryOccupationInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canEditBeneficiaryOccupationIncome(grantee, beneficiary)
}

const handler = async ({
  input
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const { id, ...occupation } = input

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: occupation
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
