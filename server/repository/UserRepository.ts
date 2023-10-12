import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.UserFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
) {
  return prismaClient.user.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.UserFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  return prismaClient.user.findUniqueOrThrow(params)
}

function findUnique<T extends Prisma.UserFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  return prismaClient.user.findUnique(params)
}

function systemFindUniqueOrThrow<T extends Prisma.UserFindUniqueOrThrowArgs>(
  params: Prisma.SelectSubset<T, Prisma.UserFindUniqueOrThrowArgs>
) {
  return prismaClient.user.findUniqueOrThrow(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.UserCreateArgs) {
  return prismaClient.user.create(params)
}

function systemFindFirst<T extends Prisma.UserFindFirstArgs>(
  params: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>
) {
  return prismaClient.user.findFirst(params)
}

function update<T extends Prisma.UserUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
) {
  return prismaClient.user.update(params)
}

function systemUpdate<T extends Prisma.UserUpdateArgs>(
  params: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
) {
  return prismaClient.user.update(params)
}

function count(_user: SecurityRuleGrantee, params?: Prisma.UserCountArgs) {
  return prismaClient.user.count(params)
}

export const UserRepo = {
  findMany,
  findUniqueOrThrow,
  findUnique,
  create,
  count,
  update,
  systemUpdate,
  systemFindUniqueOrThrow,
  systemFindFirst
}
