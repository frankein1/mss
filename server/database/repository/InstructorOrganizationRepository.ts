import { Prisma } from '@prisma/client'
import { getConstraintOnInstructorOrganization } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.InstructorOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.InstructorOrganizationFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(
    where || {},
    getConstraintOnInstructorOrganization(user)
  )
  return prismaClient.instructorOrganization.findMany(params)
}

export const InstructorOrganizationRepo = {
  findMany
}
