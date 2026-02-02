import { createMutation } from '~/server/route'
import type { CreateMinisterInput } from '~/server/schema'
import { createMinisterSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { MinisterRepo } from '~/server/database'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: CreateMinisterInput
}) => {
  return await MinisterRepo.prisma.create({
    data: input,
    select: {
      id: true
    }
  })
}

export const createMinister = createMutation({
  inputValidation: createMinisterSchema,
  adminHandler
})
