import { createQuery } from '~/server/route'
import {
  adminGetJobResultsSchema,
  AdminGetJobResultsInput
} from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { getTotalPages } from '~/utils/table'
import { AdminService } from '~/server/services'

const adminHandler = async ({
  input
}: {
  ctx: AdminContext
  input: AdminGetJobResultsInput
}) => {
  const { jobs, count } =
    await AdminService.getJobResultsForDataInclusion(input)

  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { jobs, count, totalPages }
}

export const getJobResults = createQuery({
  inputValidation: adminGetJobResultsSchema,
  adminHandler
})
