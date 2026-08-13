import type { Prisma } from '@prisma/client'
import { SocialSupportConstraints } from './SocialSupportConstraints'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.FileInstructionWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  // The user.structureId check is performed in SocialSupportConstraints
  Object.assign<
    Prisma.FileInstructionWhereInput,
    Prisma.FileInstructionWhereInput
  >(where, {
    socialSupport: SocialSupportConstraints.get(user)
  })

  return where
}

export const FileInstructionConstraints = {
  get
}
