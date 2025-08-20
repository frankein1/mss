import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateSocialSupportSubjectNameInput } from '~/server/schema'
import { updateSocialSupportSubjectSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { SocialSupportSubjectService } from '~/server/services'

const handler = async ({
  input,
  ctx: _ctx
}: {
  input: UpdateSocialSupportSubjectNameInput
  ctx: ProtectedAppContext
}) => {
  return await SocialSupportSubjectService.update({ input })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const updateStructureSubject = createMutation({
  handler,
  inputValidation: updateSocialSupportSubjectSchema,
  securityCheck
})
