import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { SocialSupportSubjectRepo } from '~/server/database'
import { UserActivityObject, UserActivityType } from '~/prisma/generated/client'

const handler = async ({
  input: { id },
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) =>
  SocialSupportSubjectRepo.update(ctx.user, {
    select: { id: true },
    where: { id, ownedByStructureId: ctx.structure.id },
    data: { inactive: true }
  })

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const makeInactiveSocialSupportSubject = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck,
  auditLog: {
    key: 'structure.make-inactive-social-support-subject',
    target: UserActivityObject.Structure,
    targetId: ({ input }) => input.id,
    action: UserActivityType.UPDATE
  }
})
