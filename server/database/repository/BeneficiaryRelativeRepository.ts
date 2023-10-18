import { Prisma } from '@prisma/client'
import { BeneficiaryRelativeConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.BeneficiaryRelativeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryRelativeFindManyArgs>
) {
  BeneficiaryRelativeConstraints.append(user, params)
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
