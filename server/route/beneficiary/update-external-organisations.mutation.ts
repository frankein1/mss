import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import {
  UpdateBeneficiaryExternalOrganisationsInput,
  updateBeneficiaryExternalOrganisationsSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const target = await getBeneficiarySecurityTarget(grantee, input.id)
  const structure = await getStructureByUser(grantee)
  const permissions = getBeneficiaryPermissions({
    user: grantee,
    structure,
    target
  })
  return permissions.edit.externalOrganisations
}

const handler = async ({
  input
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const { id, ...externalOrganisations } = input

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data: externalOrganisations
  })

  return updatedBeneficiary
}

export const updateExternalOrganisationsMutation = createMutation({
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateExternalOrganisations',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
