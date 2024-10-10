import { FamilyFileService } from '~/server/services'
import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetHistoryInput
) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  return permissions.view.history
}

const handler = async ({
  input,
  ctx
}: {
  input: GetHistoryInput
  ctx: ProtectedAppContext
}) => {
  return await FamilyFileService.getSocialSupportsSummary({ ctx, input })
}

export const getSocialSupportsSummary = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
