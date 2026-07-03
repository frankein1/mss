import type { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.SupportProgramWhereInput = {}

  if (isAdmin(user)) {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'support-program-constraints: not implemented for admin'
    })
  }

  if (!user.structureId) {
    throw new Error('support-program-constraints: missing structure id')
  }

  Object.assign<
    Prisma.SupportProgramWhereInput,
    Prisma.SupportProgramWhereInput
  >(where, {
    supportProgramName: { structureId: user.structureId }
  })

  // Referent role can see all programs linked to a workshop
  // but only programs linked to families of which he/she is a referent
  if (isReferent(user)) {
    Object.assign<
      Prisma.SupportProgramWhereInput,
      Prisma.SupportProgramWhereInput
    >(where, {
      OR: [
        { workshopId: { not: null } },
        {
          beneficiary: {
            familyFile: { referents: { some: { id: user.id } } }
          }
        }
      ]
    })
  }
  return where
}

export const SupportProgramConstraints = {
  get
}
