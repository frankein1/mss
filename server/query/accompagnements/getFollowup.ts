import { Prisma } from '@prisma/client'
import { beneficiarySecurityTargetSelect } from '~/server/query/security'
import { prismaClient } from '~/server/prisma'

const getFollowup = (followupId: string) =>
  prismaClient.followup.findFirst({
    where: {
      id: followupId
    },
    select: {
      createdById: true,
      structureId: true,
      beneficiary: {
        select: {
          ...beneficiarySecurityTargetSelect,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          fileNumber: true,
          documents: {
            select: { key: true, type: true, name: true }
          }
        }
      }
    }
  })

export { getFollowup }

type GetFollowupReturn = Prisma.PromiseReturnType<typeof getFollowup>

export type { GetFollowupReturn }
