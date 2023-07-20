import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export function getHelpRequestWithRelations(id: string) {
  return prismaClient.helpRequest.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true
    }
  })
}

export type HelpRequestWithRelations = Prisma.PromiseReturnType<
  typeof getHelpRequestWithRelations
>
