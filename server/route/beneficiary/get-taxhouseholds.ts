import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view.relatives
}

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const {
    beneficiary: { taxHouseholds }
  } = await BeneficiaryService.get({ ctx, id })

  return taxHouseholds
}

export const getBeneficiaryTaxHouseholdsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
