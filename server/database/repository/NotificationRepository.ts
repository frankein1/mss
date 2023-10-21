import { Prisma } from '@prisma/client'
import { NotificationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.NotificationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationFindManyArgs>
) {
  appendConstraints(user, params, NotificationConstraints)
  return prismaClient.notification.findMany(params)
}

export const NotificationRepo = {
  findMany,
  prisma: {
    create: prismaClient.notification.create,
    createMany: prismaClient.notification.createMany,
    updateMany: prismaClient.notification.updateMany
  }
}
