import { Prisma } from '@prisma/client'
import { FollowupConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.FollowupFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindManyArgs>
) {
  appendConstraints(user, params, FollowupConstraints)
  return prismaClient.followup.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.FollowupFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, FollowupConstraints)
  return prismaClient.followup.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.FollowupCountArgs) {
  appendConstraints(user, params, FollowupConstraints)
  return prismaClient.followup.count(params)
}

export const FollowupRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    groupBy: prismaClient.followup.groupBy,
    findMany: prismaClient.followup.findMany,
    create: prismaClient.followup.create,
    update: prismaClient.followup.update,
    delete: prismaClient.followup.delete
  }
}
