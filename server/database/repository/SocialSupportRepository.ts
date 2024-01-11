import { Prisma } from '@prisma/client'
import { SocialSupportConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.SocialSupportFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportFindManyArgs>
) {
  appendConstraints(user, params, SocialSupportConstraints.get)
  return prismaClient.socialSupport.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SocialSupportCountArgs
) {
  appendConstraints(user, params, SocialSupportConstraints.get)
  return prismaClient.socialSupport.count(params)
}

function findUniqueOrThrow<T extends Prisma.SocialSupportFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, SocialSupportConstraints.get)
  return prismaClient.socialSupport.findUniqueOrThrow(params)
}

export const SocialSupportRepo = {
  findMany,
  count,
  findUniqueOrThrow,
  prisma: {
    groupBy: prismaClient.socialSupport.groupBy,
    findMany: prismaClient.socialSupport.findMany,
    update: prismaClient.socialSupport.update,
    create: prismaClient.socialSupport.create
  }
}
