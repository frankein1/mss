import type { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export function getFollowupWithRelations(id: string) {
  return prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      types: true,
      prescribingOrganization: true,
      createdBy: true
    }
  })
}

export type FollowupWithRelations = Prisma.PromiseReturnType<
  typeof getFollowupWithRelations
>
