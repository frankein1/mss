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

function findMany<T extends Prisma.FileInstructionFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  appendConstraints(user, params, FileInstructionConstraints.get)
  return prismaClient.fileInstruction.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.FileInstructionCountArgs
) {
  appendConstraints(user, params, FileInstructionConstraints.get)
  return prismaClient.fileInstruction.count(params)
}

export const FileInstructionRepo = {
  findUniqueOrThrow,
  findMany,
  count,
  prisma: {
    create: prismaClient.fileInstruction.create,
    update: prismaClient.fileInstruction.update,
    updateMany: prismaClient.fileInstruction.updateMany,
    groupBy: prismaClient.fileInstruction.groupBy
  }
}
