import { Prisma } from '@prisma/client'
import { jobConverter } from '../jobResult/jobConverter'
import {
  JobResultAdminFilterInput,
  AdminGetJobResultsInput
} from '~/server/schema'
import { JobResultRepo } from '~/server/database'
import { takeAndSkipFromPagination } from '~/utils/table'

function prepareFilters(
  filters: JobResultAdminFilterInput
): Prisma.JobResultWhereInput {
  return filters.status ? { status: filters.status } : {}
}

function prepareSearch(
  input: AdminGetJobResultsInput,
  where: Prisma.JobResultWhereInput
) {
  return input.name
    ? {
        ...where,
        name: { contains: 'data-inclusion-structure-import' }
      }
    : where
}

export async function getJobResultsForDataInclusion(
  input: AdminGetJobResultsInput
) {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  let where = prepareFilters(input.filters)
  where = prepareSearch(input, where)

  const [results, count] = await Promise.all([
    JobResultRepo.prisma.findMany({
      where,
      orderBy: input.orderBy,
      take,
      skip
    }),
    JobResultRepo.prisma.count({ where })
  ])

  const jobs = results.map(job => jobConverter(job))

  return { jobs, count }
}
