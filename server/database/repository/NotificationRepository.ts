import type { Prisma } from '@prisma/client'
import { NotificationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

// VIEW

function findMany<T extends Prisma.NotificationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationFindManyArgs>
) {
  appendConstraints(user, params, NotificationConstraints.get)
  return prismaClient.notification.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.NotificationCountArgs
) {
  appendConstraints(user, params, NotificationConstraints.get)
  return prismaClient.notification.count(params)
}

export const NotificationRepo = {
  findMany,
  count,
  prisma: {
    create: prismaClient.notification.create,
    deleteMany: prismaClient.notification.deleteMany,
    createMany: prismaClient.notification.createMany,
    updateMany: prismaClient.notification.updateMany,
    /** Unwrapped findMany should only be used in operations initiated by the server
    and NOT by a user as no constraints on recipient
    For user-initiated actions, use NotificationRepo.findMany. */
    findMany: prismaClient.notification.findMany
  }
}
