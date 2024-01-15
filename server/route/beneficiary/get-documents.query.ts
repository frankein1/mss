import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { GetDocumentsInput, getDocumentsSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetDocumentsInput
) => {
  const permissions = await BeneficiaryService.getEditionPermission(
    ctx,
    input.beneficiaryId
  )
  return permissions.view.documents
}

const handler = ({
  ctx,
  input
}: {
  input: GetDocumentsInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.getPageDocuments({ ctx, input })
}

export const getBeneficiaryDocumentsQuery = createQuery({
  inputValidation: getDocumentsSchema,
  securityCheck,
  handler
})
