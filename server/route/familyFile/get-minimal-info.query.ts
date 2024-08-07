import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { FamilyFileService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view.general
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return await FamilyFileService.getMinimalInfo({ ctx, input })
}

export const getFamilyFileMinimalInfoQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
