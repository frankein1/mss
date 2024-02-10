import { Prisma } from '@prisma/client'
import { FileInstructionConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<
  T extends Prisma.FileInstructionFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FileInstructionFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, FileInstructionConstraints.get)
  return prismaClient.fileInstruction.findUniqueOrThrow(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.HousingHelpRequestCountArgs
) {
  appendConstraints(user, params, FileInstructionConstraints.get)
  return prismaClient.housingHelpRequest.count(params)
}

export const FileInstructionRepo = {
  findUniqueOrThrow,
  count,
  prisma: {
    create: prismaClient.fileInstruction.create,
    groupBy: prismaClient.fileInstruction.groupBy
  }
}
