import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  updateSocialSupportSubjectSchema,
  UpdateSocialSupportSubjectNameInput
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { SocialSupportSubjectService } from '~/server/services'

const handler = async ({
  input,
  ctx,
}: {
  input: UpdateSocialSupportSubjectNameInput
  ctx: ProtectedAppContext
}) => {
  return await SocialSupportSubjectService.update({ input, ctx })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const update = createMutation({
  handler,
  inputValidation: updateSocialSupportSubjectSchema,
  securityCheck
})