import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { GetDocumentsInput, getDocumentsSchema } from '~/server/schema'
import { FamilyFileService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetDocumentsInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
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
  return FamilyFileService.getPageDocuments({ ctx, input })
}

export const getDocumentsQuery = createQuery({
  inputValidation: getDocumentsSchema,
  securityCheck,
  handler
})
