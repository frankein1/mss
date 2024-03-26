import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  AdminGetUsersInput,
  UserAdminFilterInput,
  adminGetUsersSchema
} from '~/server/schema'
import { UserRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
  input: AdminGetUsersInput
}) => {
  let where = input.filters ? prepareUserFilters(input.filters) : {}
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
  const users = await UserRepo.findMany(user, {
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
    },
    orderBy: input.orderBy
  })

  return { users }
}

export type AdminUsersOutput = Prisma.PromiseReturnType<typeof adminHandler>

function prepareUserFilters(filters: UserAdminFilterInput) {
  const formattedFilters: Prisma.UserWhereInput = {}

  if (filters.role) {
    formattedFilters.role = filters.role
  }

  return formattedFilters
}

export const getAdminUsersQuery = createQuery({
  inputValidation: adminGetUsersSchema,
  adminHandler
})
