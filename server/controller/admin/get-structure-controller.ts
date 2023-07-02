import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'

export const getStructureController = async ({
  input: { id }
}: {
  input: { id: string }
}) => {
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
        }
      }
    }
  })
  if (structure) {
    return structure
  }
  throw notfoundError()
}

export type AdminStructureOutput = Prisma.PromiseReturnType<
  typeof getStructureController
>
