import { Prisma } from '@prisma/client'
import { getConstraintOnStructure } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.StructureFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnStructure(user))
  return prismaClient.structure.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.StructureFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnStructure(user))
  return prismaClient.structure.findUniqueOrThrow(params)
}

function count(_user: SecurityRuleGrantee, params?: Prisma.StructureCountArgs) {
  return prismaClient.structure.count(params)
}

// CREATE / UPDATE / DELETE

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

export const StructureRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  count,
  update
}
