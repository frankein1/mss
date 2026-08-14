import { createMutation } from '~~/server/route'
import type { AdminContext } from '~~/server/trpc'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { SocialSupportSubjectRepo } from '~~/server/database'
import { UserActivityType } from '@prisma/client'

const adminHandler = async ({
  input: { id },
  ctx
}: {
  input: IdInput
  ctx: AdminContext
}) =>
  SocialSupportSubjectRepo.update(ctx.user, {
    select: { id: true },
    where: { id },
    data: { inactive: true }
  })

export const makeInactiveSocialSupportSubject = createMutation({
  adminHandler,
  inputValidation: idSchema,
  auditLog: {
    key: 'admin.socialSupportSubject.disable',
    target: 'SocialSupportSubject',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.ARCHIVE
  }
})
