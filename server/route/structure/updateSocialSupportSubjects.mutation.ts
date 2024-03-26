import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  updateSocialSupportSubjectsSchema,
  UpdateSocialSupportSubjectsInput
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { StructureService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: UpdateSocialSupportSubjectsInput
  ctx: ProtectedAppContext
}) => {
  return StructureService.updateSocialSupportSubjects({ input, ctx })
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const updateSocialSupportSubjects = createMutation({
  handler,
  inputValidation: updateSocialSupportSubjectsSchema,
  securityCheck
})
