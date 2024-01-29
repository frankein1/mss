import { prepareFilters, prepareSort } from './helper'
import { getPage as getPageFn } from './queries'
import { GetHelpRequestsInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { HelpRequestRepo } from '~/server/database'

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

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const [items, count] = await Promise.all([
    getPageFn(ctx, { where, take, skip, orderBy }),
    HelpRequestRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}
