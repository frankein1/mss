import type { Prisma } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import type {
  GetHelpRequestsInput,
  EditHelpRequestInput,
  HelpRequestFilterInput
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { canEditBeneficiaryHelpRequest } from '~/server/query/security/rules'

const HELP_REQUEST_SELECT = {
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

function prepareHelpRequestFilters(filters: HelpRequestFilterInput) {
  const formattedFilters: Prisma.HelpRequestWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.followupTypes) {
    formattedFilters.type = { id: { in: filters.followupTypes } }
  }

  if (filters.examinationDate) {
    formattedFilters.examinationDate = filters.examinationDate
  }

  if (filters.handlingDate !== undefined) {
    formattedFilters.handlingDate =
      filters.handlingDate === 'true' ? { not: null } : null
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.externalStructure = filters.externalStructure === 'true'
  }

  if (filters.referents) {
    formattedFilters.beneficiary = {
      referents: { some: { id: { in: filters.referents } } }
    }
  }

  return formattedFilters
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
      select: HELP_REQUEST_SELECT,
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

export const updateHelpRequestHandler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: EditHelpRequestInput
  ctx: AppContext
}) => {
  const target = await prismaClient.helpRequest.findUnique({
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
    !canEditBeneficiaryHelpRequest(user, target.beneficiary, target)
  ) {
    throw forbiddenError()
  }

  return await prismaClient.helpRequest.update({
    where: { id },
    data: rest,
    select: HELP_REQUEST_SELECT
  })
}
