import { Prisma } from '@prisma/client'
import { HelpRequestConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.HelpRequestFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  appendConstraints(user, params, HelpRequestConstraints)
  return prismaClient.helpRequest.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.HelpRequestFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, HelpRequestConstraints)
  return prismaClient.helpRequest.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.HelpRequestCountArgs) {
  appendConstraints(user, params, HelpRequestConstraints)
  return prismaClient.helpRequest.count(params)
}

function aggregate<T extends Prisma.HelpRequestAggregateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.Subset<T, Prisma.HelpRequestAggregateArgs>
) {
  appendConstraints(user, params, HelpRequestConstraints)
  return prismaClient.helpRequest.aggregate(params)
}

export const HelpRequestRepo = {
  aggregate,
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    groupBy: prismaClient.helpRequest.groupBy,
    findMany: prismaClient.helpRequest.findMany,
    create: prismaClient.helpRequest.create,
    update: prismaClient.helpRequest.update,
    delete: prismaClient.helpRequest.delete
  }
}
