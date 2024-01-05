import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  getBeneficiaryPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )
  const permissions = getBeneficiaryPermissions({ ctx, beneficiary })
  return permissions.view.general
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx

  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    user,
    input.id
  )

  const permissions: BeneficiaryPermissions = getBeneficiaryPermissions({
    ctx,
    beneficiary: target
  })
  const beneficiary = await BeneficiaryService.findBeneficiary({
    ctx,
    id: input.id
  })

  return { beneficiary, permissions }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
