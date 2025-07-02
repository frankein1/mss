import { Prisma } from '@prisma/client'
import { WorkshopNameConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.WorkshopNameFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopNameFindManyArgs>
) {
  appendConstraints(user, params, WorkshopNameConstraints.get)
  return prismaClient.workshopName.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopNameCountArgs
) {
  appendConstraints(user, params, WorkshopNameConstraints.get)
  return prismaClient.workshopName.count(params)
}

function findUniqueOrThrow<T extends Prisma.WorkshopNameFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopNameFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, WorkshopNameConstraints.get)
  return prismaClient.workshopName.findUniqueOrThrow(params)
}

function deleteWorkshopName(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopNameDeleteArgs
) {
  appendConstraints(user, params, WorkshopNameConstraints.delete)
  return prismaClient.workshopName.delete(params)
}

function update<T extends Prisma.WorkshopNameUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopNameUpdateArgs>
) {
  appendConstraints(user, params, WorkshopNameConstraints.update)
  return prismaClient.workshopName.update(params)
}

export const WorkshopNameRepo = {
  findMany,
  count,
  findUniqueOrThrow,
  delete: deleteWorkshopName,
  update,
  prisma: {
    groupBy: prismaClient.workshop.groupBy,
    findMany: prismaClient.workshop.findMany,
    findUniqueOrThrow: prismaClient.workshop.findUniqueOrThrow,
    updateMany: prismaClient.workshop.updateMany,
    create: prismaClient.workshop.create
  }
}
