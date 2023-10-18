import { Prisma } from '@prisma/client'
import { NotificationConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// SYSTEM

function systemCreate(params: Prisma.NotificationCreateArgs) {
  return prismaClient.notification.create(params)
}

function systemCreateMany<T extends Prisma.NotificationCreateManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.NotificationCreateManyArgs>
) {
  return prismaClient.notification.createMany(params)
}

// VIEW

function findMany<T extends Prisma.NotificationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.NotificationFindManyArgs>
) {
  NotificationConstraints.append(user, params)
  return prismaClient.notification.findMany(params)
}

// CREATE / UPDATE / DELETE

function createMany<T extends Prisma.NotificationCreateManyArgs>(
  _user: SecurityRuleGrantee,
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
