import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export function getHelpRequestsecurityTarget(id: string) {
  return prismaClient.helpRequest.findUniqueOrThrow({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

export type HelpRequestSecurityTarget = Prisma.PromiseReturnType<
  typeof getHelpRequestsecurityTarget
>
