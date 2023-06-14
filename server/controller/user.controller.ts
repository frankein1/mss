import { TRPCError } from '@trpc/server'
import { UserStatus } from '@prisma/client'
import { AppContext, forbiddenError, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type { UserEditionInput, UserCreationInput } from '~/server/schema'
import {
  canEditUser,
  canEditUserRole,
  canCreateUser,
  canListUsers
} from '~/server/security/rules'

export const updateUserHandler = async ({
  ctx: { user },
  input: { id, ...rest }
}: {
  ctx: AppContext
  input: UserEditionInput
}) => {
  const target = await prismaClient.user.findUnique({ where: { id } })

  if (!target) {
    throw invalidError('User not found')
  }

  if (
    !canEditUser(user, target) ||
    ('role' in rest && !canEditUserRole(user, target, rest))
  ) {
    throw forbiddenError()
  }

  if ('status' in rest) {
    return await prismaClient.user.update({
      where: { id },
      data: { status: rest.status ? UserStatus.Active : UserStatus.Disabled }
    })
  }
  return await prismaClient.user.update({ where: { id }, data: rest })
}

export const addUserHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: UserCreationInput
}) => {
  if (!canCreateUser(user)) {
    throw forbiddenError()
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A user with this email already exists'
    })
  }

  const createdUser = await prismaClient.user.create({
    data: {
      structureId: user.structureId,
      ...input
    }
  })

  // [NUXT/PRISMA]: Send email

  return createdUser
}

export const getUsersHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  if (!canListUsers(user)) {
    throw forbiddenError()
  }

  return await prismaClient.user.findMany({
    where: { structureId: user.structureId },
    orderBy: { role: 'asc' }
  })
}
