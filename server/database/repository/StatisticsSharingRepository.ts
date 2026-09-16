import type { Prisma } from '@prisma/client'
import { StatisticsSharingConstraints } from '../constraints'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

function findMany<T extends Prisma.StatisticsSharingFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StatisticsSharingFindManyArgs>
) {
  appendConstraints(user, params, StatisticsSharingConstraints.get)
  return prismaClient.statisticsSharing.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.StatisticsSharingFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StatisticsSharingFindUniqueArgs>
) {
  appendConstraints(user, params, StatisticsSharingConstraints.get)
  return prismaClient.statisticsSharing.findUniqueOrThrow(params)
}

function create<T extends Prisma.StatisticsSharingCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StatisticsSharingCreateArgs>
) {
  appendCreateConstraints(user, params, StatisticsSharingConstraints.create)
  return prismaClient.statisticsSharing.create(params)
}

function update<T extends Prisma.StatisticsSharingUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StatisticsSharingUpdateArgs>
) {
  appendConstraints(user, params, StatisticsSharingConstraints.update)
  return prismaClient.statisticsSharing.update(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.StatisticsSharingCountArgs
) {
  appendConstraints(user, params, StatisticsSharingConstraints.get)
  return prismaClient.statisticsSharing.count(params)
}

export const StatisticsSharingRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  update,
  count,
  prisma: prismaClient.statisticsSharing
}
