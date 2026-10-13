import type { Prisma } from '@prisma/client'
import { SupportProgramExitReasonConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

// READ

function findMany<T extends Prisma.SupportProgramExitReasonFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramExitReasonFindManyArgs>
) {
  appendConstraints(user, params, SupportProgramExitReasonConstraints.get)
  return prismaClient.supportProgramExitReason.findMany(params)
}

// DELETE

function deleteMany(
  user: SecurityRuleGrantee,
  params: Prisma.SupportProgramExitReasonDeleteManyArgs
) {
  appendConstraints(user, params, SupportProgramExitReasonConstraints.delete)
  return prismaClient.supportProgramExitReason.deleteMany(params)
}

export const SupportProgramExitReasonRepo = {
  findMany,
  deleteMany,
  prisma: {
    upsert: prismaClient.supportProgramExitReason.upsert
  }
}
