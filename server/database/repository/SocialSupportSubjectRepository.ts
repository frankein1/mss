import { Prisma } from '@prisma/client'
import { SocialSupportSubjectConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.SocialSupportSubjectFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportSubjectFindManyArgs>
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.findMany(params)
}

function findManyWithNoInactiveCondition<
  T extends Prisma.SocialSupportSubjectFindManyArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportSubjectFindManyArgs>
) {
  appendConstraints(
    user,
    params,
    SocialSupportSubjectConstraints.getNoInactiveCondition
  )
  return prismaClient.socialSupportSubject.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SocialSupportSubjectCountArgs
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.count(params)
}

function findUniqueOrThrow<
  T extends Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<
    T,
    Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
  >
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.findUniqueOrThrow(params)
}

function findWithNoInactiveCondition<
  T extends Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<
    T,
    Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
  >
) {
  appendConstraints(
    user,
    params,
    SocialSupportSubjectConstraints.getNoInactiveCondition
  )
  return prismaClient.socialSupportSubject.findUniqueOrThrow(params)
}

export const SocialSupportSubjectRepo = {
  findMany,
  findWithNoInactiveCondition,
  findManyWithNoInactiveCondition,
  findUniqueOrThrow,
  count,
  prisma: {
    create: prismaClient.socialSupportSubject.create,
    createMany: prismaClient.socialSupportSubject.createMany,
    update: prismaClient.socialSupportSubject.update,
    updateMany: prismaClient.socialSupportSubject.updateMany,
    delete: prismaClient.socialSupportSubject.delete,
    deleteMany: prismaClient.socialSupportSubject.deleteMany,
    findMany: prismaClient.socialSupportSubject.findMany,
    groupBy: prismaClient.socialSupportSubject.groupBy
  }
}
