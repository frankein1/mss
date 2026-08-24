import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { idSchema, type IdInput } from '~~/server/schema'
import { SupportProgramService } from '~~/server/services'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput
}) => {
  return SupportProgramService.countSupportProgramNameUsage({
    ctx,
    supportProgramNameId: input.id
  })
}

export const countNameUsageQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
