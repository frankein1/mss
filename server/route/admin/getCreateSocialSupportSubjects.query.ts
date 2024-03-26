import { StructureRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { idSchema } from '~/server/schema'
import { StructureService } from '~/server/services'

export const getCreateSocialSupportSubjects = createQuery({
  adminHandler: async ({ ctx, input }) => {
    const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
      where: {
        id: input.id
      },
      select: {
        id: true,
        type: true
      }
    })
    return await StructureService.getCreateSocialSupportSubjects({
      ctx: {
        user: ctx.user,
        structure
      }
    })
  },
  inputValidation: idSchema
})
