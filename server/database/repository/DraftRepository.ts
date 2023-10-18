import { Prisma } from '@prisma/client'
import { DraftConstraints } from '../constraints/DraftConstraint'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, DraftConstraints)
  return prismaClient.draft.findUniqueOrThrow(params)
}

export const DraftRepo = {
  findUniqueOrThrow,
  prisma: {
    create: prismaClient.draft.create,
    delete: prismaClient.draft.delete,
    update: prismaClient.draft.update
  }
}
