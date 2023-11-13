import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryOccupationIncome,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryOccupationInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(user, input.id)
  const structure = await getStructureByUser(user)
  const { set } = getBeneficiaryPermissions({
    user,
    target: beneficiary,
    structure
  })
  if (!set.ministereCategorie && input.ministereCategorie) {
    return false
  }
  if (
    !set.ministereDepartementServiceAc &&
    input.ministereDepartementServiceAc
  ) {
    return false
  }
  if (!set.ministereStructure && input.ministereStructure) {
    return false
  }
  return canEditBeneficiaryOccupationIncome(user, beneficiary)
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
