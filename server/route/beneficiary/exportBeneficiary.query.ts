import { createQuery } from '~/server/route'
import {
  ExportBeneficiaryInput,
  exportBeneficiarySchema
} from '~/server/schema/beneficiary/exportbeneficiary.schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { BeneficiaryService } from '~/server/services'
import { ProtectedAppContext } from '~/server/trpc'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.beneficiaries

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const response = await BeneficiaryService.exportBeneficiary({
    ctx,
    input
  })

  return response
}

export const exportBeneficiaryQuery = createQuery({
  inputValidation: exportBeneficiarySchema,
  securityCheck,
  handler
})
