import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { AdminGetUsersInput, UserAdminFilterInput } from '~/server/schema'

export const getUsersController = async ({
  input
}: {
  input: AdminGetUsersInput
}) => {
  let where = prepareUserFilters(input.filters)
  if (input.search) {
    where = {
      ...where,
      OR: [
        {
          lastName: {
            contains: input.search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: input.search,
            mode: 'insensitive'
          }
        }
      ]
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

function prepareUserFilters(filters: UserAdminFilterInput) {
  const formattedFilters: Prisma.UserWhereInput = {}

  if (filters.role) {
    formattedFilters.role = filters.role
  }

  return formattedFilters
}
