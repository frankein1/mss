import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { SocialSupportSubjectService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await SocialSupportSubjectService.makeInactive({ input, ctx })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const makeInactive = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck
})
