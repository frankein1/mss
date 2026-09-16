import { UserRole } from '@prisma/client'
import { createQuery } from '~~/server/route'
import type { AdminContext } from '~~/server/trpc'
import { idSchema } from '~~/server/schema'
import { UserRepo } from '~~/server/database'

const adminHandler = async ({
  ctx,
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      structureId: true,
      structure: { select: { name: true } },
      role: true,
      status: true,
      aidantConnectAuthorisation: true
    },
    where: { id, role: { not: UserRole.Administrator } }
  })
  return user
}

export const getUser = createQuery({
  inputValidation: idSchema,
  adminHandler
})
