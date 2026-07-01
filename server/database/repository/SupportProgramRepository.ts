import type { Prisma } from '@prisma/client'
import { SupportProgramConstraints } from '~/server/database/constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SupportProgramCountArgs
) {
  appendConstraints(user, params, SupportProgramConstraints.get)
  return prismaClient.supportProgram.count(params)
}

export const SupportProgramRepo = {
  count
}
