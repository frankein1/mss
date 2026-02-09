import { createMutation } from '~/server/route'
import type { AdminContext } from '~/server/trpc'
import type { UpdateSocialSupportSubjectNameInput } from '~/server/schema'
import { updateSocialSupportSubjectSchema } from '~/server/schema'
import { SocialSupportSubjectRepo } from '~/server/database'
import { UserActivityType } from '~/prisma/generated/client'

const adminHandler = async ({
  input: { id, name },
  ctx
}: {
  input: UpdateSocialSupportSubjectNameInput
  ctx: AdminContext
}) =>
  SocialSupportSubjectRepo.update(ctx.user, {
    select: { id: true },
    where: { id },
    data: { name }
  })

export const updateStructureSubject = createMutation({
  adminHandler,
  inputValidation: updateSocialSupportSubjectSchema,
  auditLog: {
    key: 'admin.socialSupportSubject.update',
    target: 'SocialSupportSubject',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
