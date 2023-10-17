import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PrescribingOrganizationFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PrescribingOrganizationFindManyArgs>
) {
  return prismaClient.prescribingOrganization.findMany(params)
}

export const PrescribingOrganizationRepo = {
  findMany
}
