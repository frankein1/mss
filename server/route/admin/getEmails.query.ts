import type { Prisma } from '~/prisma/generated/client'
import { createQuery } from '~/server/route'
import type {
  AdminGetEmailsInput,
  EmailAdminFilterInput
} from '~/server/schema'
import { adminGetEmailsSchema } from '~/server/schema'
import { EmailRepo } from '~/server/database'
import type { AdminContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

const adminHandler = async ({
  input
}: {
  ctx: AdminContext
  input: AdminGetEmailsInput
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  let where = prepareEmailFilters(input.filters)

  if (input.search) {
    where = {
      ...where,
      to: {
        contains: input.search,
        mode: 'insensitive'
      }
    }
  }

  const [emails, count] = await Promise.all([
    EmailRepo.prisma.findMany({
      where,
      select: {
        id: true,
        to: true,
        subject: true,
        status: true,
        sentDate: true,
        retryNumber: true
      },
      orderBy: input.orderBy,
      take,
      skip
    }),
    EmailRepo.prisma.count({
      where
    })
  ])

  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { emails, totalPages }
}

export type AdminEmailsOutput = Awaited<ReturnType<typeof adminHandler>>

function prepareEmailFilters(filters: EmailAdminFilterInput) {
  const formattedFilters: Prisma.EmailWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  return formattedFilters
}

export const getEmails = createQuery({
  inputValidation: adminGetEmailsSchema,
  adminHandler
})
