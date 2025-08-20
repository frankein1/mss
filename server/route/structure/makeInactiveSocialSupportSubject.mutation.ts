import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { SocialSupportSubjectService } from '~/server/services'

const handler = async ({
  input,
  ctx: _ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await SocialSupportSubjectService.makeInactive({ input })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const makeInactiveSocialSupportSubject = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck
})
