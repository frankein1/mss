import { Prisma } from '@prisma/client'
import { PrescribingOrganizationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PrescribingOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PrescribingOrganizationFindManyArgs>
) {
  appendConstraints(user, params, PrescribingOrganizationConstraints)
  return prismaClient.prescribingOrganization.findMany(params)
}

export const PrescribingOrganizationRepo = {
  findMany
}
