import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryHealthInfo,
  getBeneficiaryPermissions
} from '~/server/security'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import {
  UpdateBeneficiaryHealthInput,
  updateBeneficiaryHealthSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryHealthInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)
  const structure = await getStructureByUser(grantee)
  const { set } = getBeneficiaryPermissions({
    user: grantee,
    target: beneficiary,
    structure
  })

  if (!set.nir && input.socialSecurityNumber) {
    return false
  }

  return canEditBeneficiaryHealthInfo(grantee, beneficiary)
}

const handler = async ({ input }: { input: UpdateBeneficiaryHealthInput }) => {
  const { id, ...health } = input

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: health
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
