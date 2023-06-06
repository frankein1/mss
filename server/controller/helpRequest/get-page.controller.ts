import type { Prisma } from '@prisma/client'
import { AppContext, invalidError } from '~/server/trpc'
import type { GetHelpRequestsInput } from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareHelpRequestFilters } from '~/utils/helpRequest/filters'

export const helpRequestGetPageSelect = {
  id: true,
  status: true,
  type: { select: { id: true, name: true } },
  dueDate: true,
  externalStructure: true,
  examiningOrganisation: true,
  examinationDate: true,
  askedAmount: true,
  allocatedAmount: true,
  paymentMethod: true,
  paymentDate: true,
  handlingDate: true,
  financialSupport: true,
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
}

export const getHelpRequestsHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetHelpRequestsInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.HelpRequestWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null
    },
    ...prepareHelpRequestFilters(input.filters)
  }

  const [helpRequests, count] = await Promise.all([
    prismaClient.helpRequest.findMany({
      where,
      select: helpRequestGetPageSelect,
      take,
      skip,
      orderBy: input.orderBy
    }),
    prismaClient.helpRequest.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { helpRequests, count, totalPages }
}
