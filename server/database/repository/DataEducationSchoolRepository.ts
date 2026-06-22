import type { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

function findMany<T extends Prisma.DataEducationSchoolFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.DataEducationSchoolFindManyArgs>
) {
  return prismaClient.dataEducationSchool.findMany(params)
}

function count(params: Prisma.DataEducationSchoolCountArgs) {
  return prismaClient.dataEducationSchool.count(params)
}

export const DataEducationSchoolRepo = {
  findMany,
  count,
  prisma: {
    upsert: prismaClient.dataEducationSchool.upsert
  }
}
