import { Prisma } from '@prisma/client'
import { getConstraintOnPrescribingOrganization } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PrescribingOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PrescribingOrganizationFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(
    where || {},
    getConstraintOnPrescribingOrganization(user)
  )
  return prismaClient.prescribingOrganization.findMany(params)
}

export const PrescribingOrganizationRepo = {
  findMany
}
