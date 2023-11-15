import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  BeneficiaryPermissions,
  SecurityRuleGrantee,
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
import { ProtectedAppContext } from '~/server/trpc'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryHealthInput
) => {
  const target = await getBeneficiarySecurityTarget(user, input.id)
  const structure = await getStructureByUser(user)
  const permissions = getBeneficiaryPermissions({
    user,
    structure,
    target
  })
  return permissions.edit.health
}

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const target = await getBeneficiarySecurityTarget(user, input.id)
  const permissions = getBeneficiaryPermissions({
    user,
    target,
    structure
  })

  const data = filterInput({ input, permissions })

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
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

function filterInput({
  input,
  permissions
}: {
  input: UpdateBeneficiaryHealthInput
  permissions: BeneficiaryPermissions
}) {
  const { set } = permissions
  const { id: _id, ...health } = input
  if (!set.nir) {
    delete health.socialSecurityNumber
  }
  return health
}
