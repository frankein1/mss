import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.BeneficiaryRelativeFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeFindManyArgs>
) {
  return prismaClient.beneficiaryRelative.findMany(params)
}

function update<T extends Prisma.BeneficiaryRelativeUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeUpdateArgs>
) {
  return prismaClient.beneficiaryRelative.update(params)
}

export const BeneficiaryRelativeRepo = {
  findMany,
  update
}
