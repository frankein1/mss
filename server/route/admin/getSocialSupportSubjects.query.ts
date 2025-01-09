import { StructureRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { idSchema } from '~/server/schema'
import { StructureService } from '~/server/services'
import { structureContextQuery } from '~/server/trpc/createContext'

export const getSocialSupportSubjects = createQuery({
  adminHandler: async ({ ctx, input }) => {
    const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
      where: {
        id: input.id
      },
      select: structureContextQuery().select
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
