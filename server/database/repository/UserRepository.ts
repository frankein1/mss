import { Prisma } from '@prisma/client'
import { UserConstraints } from '../constraints/UserConstraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.UserFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
) {
  appendConstraints(user, params, UserConstraints)
  return prismaClient.user.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.UserFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, UserConstraints)
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
  appendConstraints(user, params, UserConstraints)
  return prismaClient.user.findUnique(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.UserCountArgs) {
  appendConstraints(user, params, UserConstraints)
  return prismaClient.user.count(params)
}

export const UserRepo = {
  prisma: {
    update: prismaClient.user.update,
    findUniqueOrThrow: prismaClient.user.findUniqueOrThrow,
    findFirst: prismaClient.user.findFirst,
    create: prismaClient.user.create,
    findMany: prismaClient.user.findMany
  },
  findMany,
  findUniqueOrThrow,
  findUnique,
  count
}
