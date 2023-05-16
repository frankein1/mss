import type { Prisma } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import {
  AccompagnementsQuery,
  getBeneficiarySecurityTarget
} from '~/server/query'
import type {
  AddFollowupInput,
  GetFollowupsInput,
  EditFollowupStatusInput,
  FollowupFilterInput
} from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { canEditBeneficiaryFollowup } from '~/server/query/security/rules'

export const addFollowupHandler = async ({
  input,
  ctx: { user }
}: {
  input: AddFollowupInput
  ctx: AppContext
}) => {
  const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
  if (!target) {
    throw invalidError('Beneficiary not found')
  }
  return prismaClient.$transaction(transaction => {
    return AccompagnementsQuery.addFollowup({ input, transaction, user })
  })
}

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

export const updateFollowupHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: EditFollowupStatusInput
  ctx: AppContext
}) => {
  const target = await prismaClient.followup.findUnique({
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })

  if (
    !target ||
    !canEditBeneficiaryFollowup(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return await prismaClient.followup.update({ where: { id }, data: rest })
}
