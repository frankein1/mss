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

function deleteDraft<T extends Prisma.DraftDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftDeleteArgs>
) {
  params.where = params.where || {}
  Object.assign(params.where, DraftConstraints.delete(user))
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
