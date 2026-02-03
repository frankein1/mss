import { createMutation } from '~/server/route'
import type { CreateMinisterInput } from '~/server/schema'
import { createMinisterSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { MinisterRepo } from '~/server/database'
import { UserActivityObject, UserActivityType } from '@prisma/client'

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
  adminHandler,
  auditLog: {
    key: 'admin.minister.create',
    target: UserActivityObject.Minister,
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
