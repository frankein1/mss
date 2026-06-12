import type { Prisma } from '@prisma/client'
import { RedirectionReasonConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.RedirectionReasonFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.RedirectionReasonFindManyArgs>
) {
  appendConstraints(user, params, RedirectionReasonConstraints.get)
  return prismaClient.redirectionReason.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.RedirectionReasonCountArgs
) {
  appendConstraints(user, params, RedirectionReasonConstraints.get)
  return prismaClient.redirectionReason.count(params)
}

function findUnique<T extends Prisma.RedirectionReasonFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.RedirectionReasonFindUniqueArgs>
) {
  appendConstraints(user, params, RedirectionReasonConstraints.get)
  return prismaClient.redirectionReason.findUnique(params)
}

function findUniqueOrThrow<
  T extends Prisma.RedirectionReasonFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.RedirectionReasonFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, RedirectionReasonConstraints.get)
  return prismaClient.redirectionReason.findUniqueOrThrow(params)
}

export const RedirectionReasonRepo = {
  findMany,
  count,
  findUnique,
  findUniqueOrThrow,
  prisma: {
    upsert: prismaClient.redirectionReason.upsert
  }
}
