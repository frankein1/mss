import { createMutation } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import {
  editStructureAdminInfoSchema,
  EditStructureAdminInfoInput
} from '~/server/schema'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  input,
  ctx: _ctx
}: {
  input: EditStructureAdminInfoInput
  ctx: AdminContext
}) => {
  const updatedStructure = await StructureRepo.prisma.update({
    where: { id: input.id },
    data: input,
    select: {
      id: true
    }
  })

  return updatedStructure
}

export const updateStructureInfo = createMutation({
  adminHandler,
  inputValidation: editStructureAdminInfoSchema
})
