import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.NotificationFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationFindManyArgs>
) {
  return prismaClient.notification.findMany(params)
}

function systemCreate(params: Prisma.NotificationCreateArgs) {
  return prismaClient.notification.create(params)
}

function createMany<T extends Prisma.NotificationCreateManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationCreateManyArgs>
) {
  return prismaClient.notification.createMany(params)
}

function systemCreateMany<T extends Prisma.NotificationCreateManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.NotificationCreateManyArgs>
) {
  return prismaClient.notification.createMany(params)
}

function updateMany<T extends Prisma.NotificationUpdateManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationUpdateManyArgs>
) {
  return prismaClient.notification.updateMany(params)
}

export const NotificationRepo = {
  findMany,
  systemCreate,
  createMany,
  systemCreateMany,
  updateMany
}
