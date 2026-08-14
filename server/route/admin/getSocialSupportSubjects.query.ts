import { StructureRepo } from '~~/server/database'
import { createQuery } from '~~/server/route'
import { idSchema } from '~~/server/schema'
import { StructureService } from '~~/server/services'
import { structureContextSelect } from '~~/server/utils/fetchUserContext'

export const getSocialSupportSubjects = createQuery({
  adminHandler: async ({ ctx, input }) => {
    const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
      where: {
        id: input.id
      },
      select: structureContextSelect
    })
    return await StructureService.getAdminSocialSupportSubjects({
      ctx: {
        user: ctx.user,
        structure
      }
    })
  },
  inputValidation: idSchema
})
