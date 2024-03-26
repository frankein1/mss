import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { notfoundError, AdminContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { UserRepo } from '~/server/database'

const adminHandler = async ({
  ctx,
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })
  if (user) {
    return user
  }
  throw notfoundError()
}

export type AdminUserOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getUser = createQuery({
  inputValidation: idSchema,
  adminHandler
})
