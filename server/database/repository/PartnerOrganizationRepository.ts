import { Prisma } from '@prisma/client'
import { PartnerOrganizationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PartnerOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationFindManyArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.get)
  return prismaClient.partnerOrganization.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.PartnerOrganizationFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationFindUniqueArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.get)
  return prismaClient.partnerOrganization.findUniqueOrThrow(params)
}

export const PartnerOrganizationRepo = {
  findMany,
  findUniqueOrThrow,
  prisma: {
    update: prismaClient.partnerOrganization.update,
    create: prismaClient.partnerOrganization.create
  }
}
