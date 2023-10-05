import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export function getHelpRequestWithRelations(id: string) {
  return prismaClient.helpRequest.findUniqueOrThrow({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      prescribingOrganization: true,
      instructorOrganization: true,
      type: true,
      createdBy: true
    }
  })
}

export type HelpRequestWithRelations = Prisma.PromiseReturnType<
  typeof getHelpRequestWithRelations
>
