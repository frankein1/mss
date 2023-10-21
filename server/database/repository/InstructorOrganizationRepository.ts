import { Prisma } from '@prisma/client'
import { InstructorOrganizationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.InstructorOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.InstructorOrganizationFindManyArgs>
) {
  appendConstraints(user, params, InstructorOrganizationConstraints)
  return prismaClient.instructorOrganization.findMany(params)
}

export const InstructorOrganizationRepo = {
  findMany
}
