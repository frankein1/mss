import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.StructureFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindManyArgs>
) {
  return prismaClient.structure.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.StructureFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindUniqueOrThrowArgs>
) {
  return prismaClient.structure.findUniqueOrThrow(params)
}

function create(
  _user: SecurityRuleGrantee,
  params: Prisma.StructureCreateArgs
) {
  return prismaClient.structure.create(params)
}

function update<T extends Prisma.StructureUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureUpdateArgs>
) {
  return prismaClient.structure.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.StructureDeleteArgs
) {
  return prismaClient.structure.delete(params)
}
function count(_user: SecurityRuleGrantee, params?: Prisma.StructureCountArgs) {
  return prismaClient.structure.count(params)
}

export const StructureRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  count,
  update
}
