import { createMutation } from '~/server/route'
import type { AdminContext } from '~/server/trpc'
import type { UpdateAdminStructureSubjectsInput } from '~/server/schema'
import { updateAdminStructureSubjectsSchema } from '~/server/schema'
import { StructureRepo } from '~/server/database'
import { StructureService } from '~/server/services'
import { UserActivityType } from '@prisma/client'
import { structureContextQuery } from '~/server/auth/auth-middleware'

const adminHandler = async ({
  input,
  ctx
}: {
  input: UpdateAdminStructureSubjectsInput
  ctx: AdminContext
}) => {
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id: input.structureId
    },
    select: structureContextQuery().select
  })
  return StructureService.updateSocialSupportSubjects({
    input,
    ctx: {
      user: ctx.user,
      structure
    }
  })
}

export const updateSocialSupportSubjects = createMutation({
  adminHandler,
  inputValidation: updateAdminStructureSubjectsSchema,
  auditLog: {
    key: 'admin.socialSupportSubjects.update',
    target: 'SocialSupportSubject',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.UPDATE
  }
})
