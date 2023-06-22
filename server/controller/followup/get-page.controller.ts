import type { Prisma } from '@prisma/client'
import type { GetFollowupsInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareFollowupFilters } from '~/utils/filters'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'

export const getFollowupsHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.FollowupWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareFollowupFilters(input.filters)
  }

  const [followups, count] = await Promise.all([
    prismaClient.followup.findMany({
      where,
      select: {
        id: true,
        status: true,
        medium: true,
        types: { select: { id: true, name: true } },
        dueDate: true,
        beneficiary: {
          select: {
            id: true,
            fileNumber: true,
            firstName: true,
            birthName: true,
            usualName: true,
            email: true,
            referents: true,
            structureId: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        structureId: true
      },
      take,
      skip,
      orderBy: input.orderBy
    }),
    prismaClient.followup.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { followups, count, totalPages }
}
