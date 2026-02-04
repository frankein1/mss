import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateSocialSupportSubjectsInput } from '~/server/schema'
import { updateSocialSupportSubjectsSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { StructureService } from '~/server/services'
import { UserActivityObject, UserActivityType } from '@prisma/client'

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
  securityCheck,
  auditLog: {
    key: 'structure.update-subject',
    target: UserActivityObject.Structure,
    targetId: ({ ctx }) => {
      return ctx.structure.id
    },
    action: UserActivityType.UPDATE
  }
})
