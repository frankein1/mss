import type { Prisma } from '@prisma/client'
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy,
  getHelpRequestsSchema
} from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { SortOrder } from '~/types/table'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getHelpRequestPermissions } from '~/server/security'
import { HelpRequestRepo } from '~/server/database'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: GetHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.HelpRequestWhereInput = {
    ...prepareHelpRequestFilters(input.filters)
  }

  const orderBy: GetHelpRequestsOrderBy = input.orderBy

  if (orderBy.find(s => !!s.instructorOrganization)) {
    orderBy.unshift({ externalStructure: SortOrder.Desc })
  }

  const permissions = getHelpRequestPermissions({ user, structure })

  const [helpRequests, count] = await Promise.all([
    HelpRequestRepo.findMany(user, {
      where,
      select: prepareGetHelpRequestsPageSelect(permissions),
      take,
      skip,
      orderBy: input.orderBy
    }),
    HelpRequestRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { helpRequests, count, totalPages }
}

export const getHelpRequestsQuery = createQuery({
  inputValidation: getHelpRequestsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
