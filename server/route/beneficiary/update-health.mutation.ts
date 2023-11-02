import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiary,
  canEditBeneficiaryHealthInfo,
  canSetBeneficiaryNir
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiarySecurityTarget } from '~/server/query'
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

  return (
    canEditBeneficiary(grantee, beneficiary) &&
    canEditBeneficiaryHealthInfo(grantee, beneficiary)
  )
}

const handler = async ({
  input,
  ctx: { structure }
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const { id, socialSecurityNumber, ...health } = input

  let data = {}
  data = { ...data, ...health }

  if (canSetBeneficiaryNir(structure.type)) {
    data = { ...data, socialSecurityNumber }
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}

export const updateHealthMutation = createMutation({
  inputValidation: updateBeneficiaryHealthSchema,
  securityCheck,
  handler,
  auditLog: {
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
