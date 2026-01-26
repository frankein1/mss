import { MinisterRepo } from '~/server/database'
import { createMutation } from '~/server/route'
import { updateMinisterSchema, type UpdateMinisterInput } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'

export const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: UpdateMinisterInput
}) => {
  return await MinisterRepo.update(ctx.user, {
    where: { id: input.id },
    data: input,
    select: { id: true }
  })
}

export const updateMinister = createMutation({
  adminHandler,
  inputValidation: updateMinisterSchema
})
