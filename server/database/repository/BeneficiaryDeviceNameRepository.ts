import type { Prisma } from '@prisma/client'
import { BeneficiaryDeviceNameConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.BeneficiaryDeviceNameFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryDeviceNameFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryDeviceNameConstraints.get)
  return prismaClient.beneficiaryDeviceName.findMany(params)
}

export const BeneficiaryDeviceNameRepo = {
  findMany,
  prisma: prismaClient.beneficiaryDeviceName
}
