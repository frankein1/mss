import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  JobResultAdminFilterInput,
  adminGetJobResultsSchema,
  AdminGetJobResultsInput
} from '~/server/schema'
import { JobResultRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

const adminHandler = async ({
  input
}: {
  ctx: AdminContext
  input: AdminGetJobResultsInput
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  let where = prepareFilters(input.filters)
  where = prepareSearch(input, where)

  const [jobs, count] = await Promise.all([
    JobResultRepo.prisma.findMany({
      where,
      orderBy: input.orderBy,
      take,
      skip
    }),
    JobResultRepo.prisma.count({ where })
  ])

  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { jobs, totalPages }
}

function prepareFilters(filters: JobResultAdminFilterInput) {
  return (
    filters.status ? { status: filters.status } : {}
  ) as Prisma.JobResultWhereInput
}

function prepareSearch(
  input: AdminGetJobResultsInput,
  where: Prisma.JobResultWhereInput
) {
  return input.name
    ? {
        ...where,
        name: { contains: input.name, mode: 'insensitive' as const }
      }
    : where
}

export const getJobResults = createQuery({
  inputValidation: adminGetJobResultsSchema,
  adminHandler
})
