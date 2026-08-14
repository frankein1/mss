import { createQuery } from '~~/server/route'
import type { AdminGetJobResultsInput } from '~~/server/schema'
import { adminGetJobResultsSchema } from '~~/server/schema'
import type { AdminContext } from '~~/server/trpc'
import { getTotalPages } from '~/utils/table'
import { AdminService } from '~~/server/services'

const adminHandler = async ({
  input
}: {
  ctx: AdminContext
  input: AdminGetJobResultsInput
}) => {
  const { jobs, count } =
    await AdminService.getJobResultsForDataInclusion(input)

  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { jobs, totalPages }
}

export const getJobResults = createQuery({
  inputValidation: adminGetJobResultsSchema,
  adminHandler
})
