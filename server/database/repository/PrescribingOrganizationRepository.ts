import { Prisma } from '@prisma/client'
import { PrescribingOrganizationConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PrescribingOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PrescribingOrganizationFindManyArgs>
) {
  PrescribingOrganizationConstraints.append(user, params)
  return prismaClient.prescribingOrganization.findMany(params)
}

export const PrescribingOrganizationRepo = {
  findMany
}
