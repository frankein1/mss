import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.FollowupTypeFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeFindManyArgs>
) {
  return prismaClient.followupType.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.FollowupTypeFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeFindUniqueOrThrowArgs>
) {
  return prismaClient.followupType.findUniqueOrThrow(params)
}

function createMany(
  _user: SecurityRuleGrantee,
  params: Prisma.FollowupTypeCreateManyArgs
) {
  return prismaClient.followupType.createMany(params)
}

function update<T extends Prisma.FollowupTypeUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeUpdateArgs>
) {
  return prismaClient.followupType.update(params)
}

function deleteMany(
  _user: SecurityRuleGrantee,
  params: Prisma.FollowupTypeDeleteManyArgs
) {
  return prismaClient.followupType.deleteMany(params)
}
function count(
  _user: SecurityRuleGrantee,
  params: Prisma.FollowupTypeCountArgs
) {
  return prismaClient.followupType.count(params)
}

export const FollowupTypeRepo = {
  findMany,
  findUniqueOrThrow,
  createMany,
  deleteMany,
  count,
  update
}
