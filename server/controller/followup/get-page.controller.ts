import type { Prisma } from '@prisma/client'
import type { GetFollowupsInput, FollowupFilterInput } from '~/server/schema'
import { AppContext, invalidError } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'

function prepareFollowupFilters(filters: FollowupFilterInput) {
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.referents) {
    formattedFilters.beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
  }

  return formattedFilters
}

export const getFollowupsHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetFollowupsInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.FollowupWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null
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
            email: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
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
