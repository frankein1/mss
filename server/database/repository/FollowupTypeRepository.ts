import { Prisma } from '@prisma/client'
import { FollowupTypeConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.FollowupTypeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeFindManyArgs>
) {
  appendConstraints(user, params, FollowupTypeConstraints)
  return prismaClient.followupType.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.FollowupTypeCountArgs
) {
  appendConstraints(user, params, FollowupTypeConstraints)
  return prismaClient.followupType.count(params)
}

function findUniqueOrThrow<T extends Prisma.FollowupTypeFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupTypeFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, FollowupTypeConstraints)
  return prismaClient.followupType.findUniqueOrThrow(params)
}

export const FollowupTypeRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    create: prismaClient.followupType.create,
    createMany: prismaClient.followupType.createMany,
    update: prismaClient.followupType.update,
    updateMany: prismaClient.followupType.updateMany,
    delete: prismaClient.followupType.delete,
    deleteMany: prismaClient.followupType.deleteMany,
    findMany: prismaClient.followupType.findMany
  }
}
