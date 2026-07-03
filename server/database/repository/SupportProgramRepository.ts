import type { Prisma } from '@prisma/client'
import { SupportProgramConstraints } from '~/server/database/constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.SupportProgramFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramFindManyArgs>
) {
  appendConstraints(user, params, SupportProgramConstraints.get)
  return prismaClient.supportProgram.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SupportProgramCountArgs
) {
  appendConstraints(user, params, SupportProgramConstraints.get)
  return prismaClient.supportProgram.count(params)
}

export const SupportProgramRepo = {
  findMany,
  count
}
