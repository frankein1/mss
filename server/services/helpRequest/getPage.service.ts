import { Prisma } from '@prisma/client'
import { prepareHelpRequestFilters } from './helper'
import { getPage as getPageFn } from './queries'
import {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { SortOrder } from '~/types/table'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { HelpRequestRepo } from '~/server/database'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

export async function getPage({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetHelpRequestsInput
}) {
  const { user } = ctx

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

  const [items, count] = await Promise.all([
    getPageFn(ctx, { where, take, skip, orderBy: input.orderBy }),
    HelpRequestRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}
