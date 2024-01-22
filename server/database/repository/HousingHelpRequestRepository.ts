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

export const HousingHelpRequestRepo = {
  findUniqueOrThrow,
  prisma: {
    create: prismaClient.housingHelpRequest.create
  }
}
