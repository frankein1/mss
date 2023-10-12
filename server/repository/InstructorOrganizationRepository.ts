import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.InstructorOrganizationFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.InstructorOrganizationFindManyArgs>
) {
  return prismaClient.instructorOrganization.findMany(params)
}

export const InstructorOrganizationRepo = {
  findMany
}
