import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  getBeneficiaryPermissions
} from '~/server/security'
import {
  UpdateBeneficiaryHealthInput,
  updateBeneficiaryHealthSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryHealthInput
) => {
  const permissions = await BeneficiaryService.getEditionPermission(
    ctx,
    input.id
  )
  return permissions.edit.health
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBeneficiaryHealthInput
  ctx: ProtectedAppContext
}) => {
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )
  const permissions = getBeneficiaryPermissions({
    ctx,
    beneficiary: target
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
