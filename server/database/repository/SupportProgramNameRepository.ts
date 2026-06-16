import type { Prisma } from '@prisma/client'
import { SupportProgramNameConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.SupportProgramNameFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameFindManyArgs>
) {
  appendConstraints(user, params, SupportProgramNameConstraints.get)
  return prismaClient.supportProgramName.findMany(params)
}

export const SupportProgramNameRepo = {
  findMany,
  prisma: prismaClient.supportProgramName
}
