import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<T extends Prisma.CommentFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.CommentFindUniqueOrThrowArgs>
) {
  return prismaClient.comment.findUniqueOrThrow(params)
}

export const CommentRepo = {
  prisma: {
    create: prismaClient.comment.create,
    update: prismaClient.comment.update,
    delete: prismaClient.comment.delete
  },
  findUniqueOrThrow
}
