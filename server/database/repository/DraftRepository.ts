import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  return prismaClient.draft.findUniqueOrThrow(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.DraftCreateArgs) {
  return prismaClient.draft.create(params)
}

function update<T extends Prisma.DraftUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftUpdateArgs>
) {
  return prismaClient.draft.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.DraftDeleteArgs
) {
  return prismaClient.draft.delete(params)
}

export const DraftRepo = {
  findUniqueOrThrow,
  create,
  deleteEntity,
  update
}
