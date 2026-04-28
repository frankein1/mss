import type { Prisma } from '@prisma/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryDeviceNameWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('beneficiary-device-name-constraints: missing structure id')
  }

  Object.assign<
    Prisma.BeneficiaryDeviceNameWhereInput,
    Prisma.BeneficiaryDeviceNameWhereInput
  >(where, { structureId: user.structureId })
  return where
}

export const BeneficiaryDeviceNameConstraints = {
  get,
  create: get,
  update: get,
  delete: get
}
