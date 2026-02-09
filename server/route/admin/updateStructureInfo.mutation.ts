import { createMutation } from '~/server/route'
import type { AdminContext } from '~/server/trpc'
import type { EditStructureAdminInfoInput } from '~/server/schema'
import { editStructureAdminInfoSchema } from '~/server/schema'
import { StructureRepo } from '~/server/database'
import { createOrUpdateStructure } from '~/server/integrations/brevo/service'
import { UserActivityType } from '~/prisma/generated/client'

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

  createOrUpdateStructure(updatedStructure.id).catch(error => {
    console.error(error)
  })

  return updatedStructure
}

export const updateStructureInfo = createMutation({
  adminHandler,
  inputValidation: editStructureAdminInfoSchema,
  auditLog: {
    key: 'admin.structure.update',
    target: 'Structure',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
