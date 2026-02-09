import type { Prisma } from '~/prisma/generated/client'
import { UserConstraints } from '../constraints/UserConstraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.UserFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
) {
  appendConstraints(user, params, UserConstraints.get)
  return prismaClient.user.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.UserFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, UserConstraints.get)
  try {
    return prismaClient.user.findUniqueOrThrow(params)
  } catch (err) {
    // FIXME: Remove log once error is identified
    console.error('[UserRepository] User not found...', { params })
    throw err
  }
}

function findUnique<T extends Prisma.UserFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, UserConstraints.get)
  return prismaClient.user.findUnique(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.UserCountArgs) {
  appendConstraints(user, params, UserConstraints.get)
  return prismaClient.user.count(params)
}

function update<T extends Prisma.UserUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
) {
  appendConstraints(user, params, UserConstraints.update)
  return prismaClient.user.update(params)
}

function deleteUser<T extends Prisma.UserDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserDeleteArgs>
) {
  appendConstraints(user, params, UserConstraints.update)
  return prismaClient.user.delete(params)
}

export const UserRepo = {
  prisma: {
    count: prismaClient.user.count,
    update: prismaClient.user.update,
    updateMany: prismaClient.user.updateMany,
    findUnique: prismaClient.user.findUnique,
    findUniqueOrThrow: prismaClient.user.findUniqueOrThrow,
    findFirst: prismaClient.user.findFirst,
    create: prismaClient.user.create,
    findMany: prismaClient.user.findMany
  },
  findMany,
  findUniqueOrThrow,
  findUnique,
  count,
  update,
  delete: deleteUser
}
