import { Prisma } from '@prisma/client'
import { DraftConstraints } from '../constraints/DraftConstraint'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, DraftConstraints.get)
  return prismaClient.draft.findUniqueOrThrow(params)
}

function deleteDraft<T extends Prisma.DraftDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftDeleteArgs>
) {
  appendConstraints(user, params, DraftConstraints.delete)
  return prismaClient.draft.delete(params)
}

export const DraftRepo = {
  findUniqueOrThrow,
  delete: deleteDraft,
  prisma: {
    create: prismaClient.draft.create,
    update: prismaClient.draft.update
  }
}
