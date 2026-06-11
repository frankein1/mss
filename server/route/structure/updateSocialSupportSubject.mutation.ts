import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateSocialSupportSubjectNameInput } from '~/server/schema'
import { updateSocialSupportSubjectSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { UserActivityObject, UserActivityType } from '@prisma/client'
import { SocialSupportSubjectRepo } from '~/server/database'

const handler = async ({
  input: { id, name },
  ctx
}: {
  input: UpdateSocialSupportSubjectNameInput
  ctx: ProtectedAppContext
}) =>
  SocialSupportSubjectRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id,
      ownedByStructureId: ctx.structure.id
    },
    data: { name }
  })

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).structure.edit

export const updateStructureSubject = createMutation({
  handler,
  inputValidation: updateSocialSupportSubjectSchema,
  securityCheck,
  auditLog: {
    key: 'structure.update-subject',
    target: UserActivityObject.SocialSupportSubject,
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
