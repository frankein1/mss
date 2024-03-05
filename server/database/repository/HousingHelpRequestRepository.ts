import { Prisma } from '@prisma/client'
import { HousingHelpRequestConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<
  T extends Prisma.HousingHelpRequestFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HousingHelpRequestFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, HousingHelpRequestConstraints.get)
  return prismaClient.housingHelpRequest.findUniqueOrThrow(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.HousingHelpRequestCountArgs
) {
  appendConstraints(user, params, HousingHelpRequestConstraints.get)
  return prismaClient.housingHelpRequest.count(params)
}

export const HousingHelpRequestRepo = {
  findUniqueOrThrow,
  count,
  prisma: {
    create: prismaClient.housingHelpRequest.create,
    update: prismaClient.housingHelpRequest.update,
    groupBy: prismaClient.housingHelpRequest.groupBy
  }
}
