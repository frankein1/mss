import { Prisma } from '@prisma/client'
import { BeneficiaryRelativeConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.BeneficiaryRelativeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryRelativeConstraints.get)
  return prismaClient.beneficiaryRelative.findMany(params)
}

function update<T extends Prisma.BeneficiaryRelativeUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeUpdateArgs>
) {
  appendConstraints(user, params, BeneficiaryRelativeConstraints.update)
  return prismaClient.beneficiaryRelative.update(params)
}

export const BeneficiaryRelativeRepo = {
  findMany,
  update,
  prisma: {
    createMany: prismaClient.beneficiaryRelative.createMany
  }
}
