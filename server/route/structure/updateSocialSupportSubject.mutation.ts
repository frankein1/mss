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
