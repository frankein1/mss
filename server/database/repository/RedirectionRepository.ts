import type { Prisma } from '@prisma/client'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'
import { SocialSupportConstraints } from '../constraints'

type Constraint = (
  u: SecurityRuleGrantee
) => Prisma.SocialSupportRedirectionWhereInput

const constraint: Constraint = u => ({
  socialSupport: SocialSupportConstraints.get(u)
})

function findMany<T extends Prisma.SocialSupportRedirectionFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportRedirectionFindManyArgs>
) {
  appendConstraints(user, params, constraint)
  return prismaClient.socialSupportRedirection.findMany(params)
}

export const RedirectionRepo = {
  findMany
}
