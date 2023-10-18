import { Prisma } from '@prisma/client'
import { FollowupTypeConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.FollowupTypeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeFindManyArgs>
) {
  FollowupTypeConstraints.append(user, params)
  return prismaClient.followupType.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.FollowupTypeCountArgs
) {
  FollowupTypeConstraints.append(user, params)
  return prismaClient.followupType.count(params)
}

// CREATE / UPDATE / DELETE

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

export const FollowupTypeRepo = {
  findMany,
  findUniqueOrThrow,
  createMany,
  deleteMany,
  count,
  update
}
