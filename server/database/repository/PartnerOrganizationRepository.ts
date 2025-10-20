import type { Prisma } from '@prisma/client'
import { PartnerOrganizationConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.PartnerOrganizationFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationFindManyArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.get)
  return prismaClient.partnerOrganization.findMany(params)
}

function findOne<T extends Prisma.PartnerOrganizationFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationFindUniqueArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.get)
  return prismaClient.partnerOrganization.findUnique(params)
}

function findUniqueOrThrow<T extends Prisma.PartnerOrganizationFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationFindUniqueArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.get)
  return prismaClient.partnerOrganization.findUniqueOrThrow(params)
}

function update<T extends Prisma.PartnerOrganizationUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.PartnerOrganizationUpdateArgs>
) {
  appendConstraints(user, params, PartnerOrganizationConstraints.update)
  return prismaClient.partnerOrganization.update(params)
}

export const PartnerOrganizationRepo = {
  findMany,
  findOne,
  findUniqueOrThrow,
  update,
  prisma: {
    create: prismaClient.partnerOrganization.create
  }
}
