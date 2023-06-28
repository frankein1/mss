import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { AdminGetUsersInput } from '~/server/schema'

export const getUsersController = async ({
  input
}: {
  input: AdminGetUsersInput
}) => {
  let where = {}
  if (input.search) {
    where = {
      lastName: {
        contains: input.search,
        mode: 'insensitive'
      }
    }
  }
  const users = await prismaClient.user.findMany({
    where,
    select: {
      id: true,
      lastName: true,
      firstName: true,
      lastAccess: true,
      email: true,
      role: true,
      status: true,
      structure: true
    }
  })

  return { users }
}

export type AdminUsersOutput = Prisma.PromiseReturnType<
  typeof getUsersController
>
