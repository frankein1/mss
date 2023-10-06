import { Prisma } from '@prisma/client'
import { createQuery } from '../createRoute'
import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'

const adminHandler = async ({ input: { id } }: { input: { id: string } }) => {
  const structure = await prismaClient.structure.findUnique({
    where: { id },
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        }
      },
      users: {
        select: {
          id: true,
          lastName: true,
          firstName: true,
          email: true,
          role: true,
          aidantConnectAuthorisation: true,
          status: true
        },
        orderBy: {
          created: 'desc'
        }
      }
    }
  })
  if (structure) {
    return structure
  }
  throw notfoundError()
}

export type AdminStructureOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getAdminStructureQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
