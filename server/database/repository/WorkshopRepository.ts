import { Prisma } from '@prisma/client'
import { WorkshopConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.WorkshopFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopFindManyArgs>
) {
  appendConstraints(user, params, WorkshopConstraints.get)
  return prismaClient.workshop.findMany(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.WorkshopCountArgs) {
  appendConstraints(user, params, WorkshopConstraints.get)
  return prismaClient.workshop.count(params)
}

function findUniqueOrThrow<T extends Prisma.WorkshopFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, WorkshopConstraints.get)
  return prismaClient.workshop.findUniqueOrThrow(params)
}

function deleteWorkshop(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopDeleteArgs
) {
  appendConstraints(user, params, WorkshopConstraints.delete)
  return prismaClient.workshop.delete(params)
}

function update<T extends Prisma.WorkshopUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopUpdateArgs>
) {
  appendConstraints(user, params, WorkshopConstraints.update)
  return prismaClient.workshop.update(params)
}

export const WorkshopRepo = {
  findMany,
  count,
  findUniqueOrThrow,
  delete: deleteWorkshop,
  update,
  prisma: {
    groupBy: prismaClient.workshop.groupBy,
    findMany: prismaClient.workshop.findMany,
    updateMany: prismaClient.workshop.updateMany,
    create: prismaClient.workshop.create
  }
}
