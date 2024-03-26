import { createMutation } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import {
  adminEditStructureSchema,
  AdminEditStructureInput
} from '~/server/schema'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  input,
  ctx: _ctx
}: {
  input: AdminEditStructureInput
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
  inputValidation: adminEditStructureSchema
})
