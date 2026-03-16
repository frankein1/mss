import type { Prisma } from '@prisma/client'
import { DocumentConstraints } from '../constraints'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'

import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.DocumentFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  appendConstraints(user, params, DocumentConstraints.get)
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, DocumentConstraints.get)
  return prismaClient.document.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  appendConstraints(user, params, DocumentConstraints.get)
  return prismaClient.document.count(params)
}

function create<T extends Prisma.DocumentCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentCreateArgs>
) {
  appendCreateConstraints(user, params, DocumentConstraints.create)
  return prismaClient.document.create(params)
}

export const DocumentRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  create,
  prisma: {
    create: prismaClient.document.create, // FIXME: delete when document API endpoints have been updated
    delete: prismaClient.document.delete,
    deleteMany: prismaClient.document.deleteMany,
    update: prismaClient.document.update
  }
}
