import type { Prisma } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import type {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { prepareHelpRequestFilters } from '~/utils/helpRequest/filters'
import { SortOrder } from '~/types/table'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

export const helpRequestGetPageSelect = {
  id: true,
  status: true,
  type: { select: { id: true, name: true } },
  dueDate: true,
  externalStructure: true,
  examinationDate: true,
  askedAmount: true,
  allocatedAmount: true,
  paymentMethod: true,
  paymentDate: true,
  handlingDate: true,
  financialSupport: true,
  createdById: true,
  beneficiary: {
    select: {
      id: true,
      structureId: true,
      fileNumber: true,
      firstName: true,
      birthName: true,
      usualName: true,
      email: true,
      referents: true
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
  instructorOrganization: {
    select: { name: true }
  }
}

export const getHelpRequestsHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
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

  const orderBy: GetHelpRequestsOrderBy = input.orderBy

  if (orderBy.find(s => !!s.instructorOrganization)) {
    orderBy.unshift({ externalStructure: SortOrder.Desc })
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
