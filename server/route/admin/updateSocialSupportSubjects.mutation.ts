import { createMutation } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import {
  updateAdminStructureSubjectsSchema,
  UpdateAdminStructureSubjectsInput
} from '~/server/schema'
import { StructureRepo } from '~/server/database'
import { StructureService } from '~/server/services'

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
    select: {
      id: true,
      type: true
    }
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
  inputValidation: updateAdminStructureSubjectsSchema
})
