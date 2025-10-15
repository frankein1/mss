import type { Prisma } from '@prisma/client'
import { FileInstructionConstraints } from './FileInstructionConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.HousingHelpRequestWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  // The user.structureId check is performed in FileInstructionConstraints
  Object.assign<
    Prisma.HousingHelpRequestWhereInput,
    Prisma.HousingHelpRequestWhereInput
  >(where, {
    fileInstruction: FileInstructionConstraints.get(user)
  })

  return where
}

export const HousingHelpRequestConstraints = {
  get
}
