import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  BeneficiaryPermissions,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { getStructureByUser } from '~/server/query'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    input.id
  )
  const structure = await getStructureByUser(user)
  const permissions = getBeneficiaryPermissions({ user, target, structure })
  return permissions.view.general
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx

  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    input.id
  )

  const permissions: BeneficiaryPermissions = getBeneficiaryPermissions({
    user,
    target,
    structure
  })
  const beneficiary = await BeneficiaryService.findBeneficiary({
    user,
    structure,
    id: input.id
  })

  return { beneficiary, permissions }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
