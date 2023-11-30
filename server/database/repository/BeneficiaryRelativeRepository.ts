import { Prisma } from '@prisma/client'
import { BeneficiaryRelativeConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.BeneficiaryRelativeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryRelativeConstraints)
  return prismaClient.beneficiaryRelative.findMany(params)
}

export const BeneficiaryRelativeRepo = {
  findMany,
  prisma: {
    createMany: prismaClient.beneficiaryRelative.createMany,
    update: prismaClient.beneficiaryRelative.update // FIXME: It should have constraints, isn't it ?
  }
}
