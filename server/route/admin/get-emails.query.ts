import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  AdminGetEmailsInput,
  EmailAdminFilterInput,
  adminGetEmailsSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { EmailRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'

const adminHandler = async ({
  input
}: {
  ctx: AdminContext
  input: AdminGetEmailsInput
}) => {
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

  const emails = await EmailRepo.prisma.findMany({
    where,
    select: {
      id: true,
      to: true,
      subject: true,
      status: true,
      sentDate: true,
      retryNumber: true
    },
    orderBy: input.orderBy
  })

  return { emails }
}

export type AdminEmailsOutput = Prisma.PromiseReturnType<typeof adminHandler>

function prepareEmailFilters(filters: EmailAdminFilterInput) {
  const formattedFilters: Prisma.EmailWhereInput = {}

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  return formattedFilters
}

export const getAdminEmailsQuery = createQuery({
  inputValidation: adminGetEmailsSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
