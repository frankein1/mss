import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  canEditBeneficiaryHealthInfo
} from '~/server/security'
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
  return canEditBeneficiaryHealthInfo(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx: _ctx
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const { id, ...health } = input

  let data = {}
  data = { ...data, ...health }

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
    key: 'beneficiary.updateHealth',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
