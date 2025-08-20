import { getPage as getPageFn } from './queries'
import { prepareFilters, prepareSort } from './helper'
import { FollowupRepo } from '~/server/database'
import type { GetFollowupsInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

export async function getPage({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: GetFollowupsInput
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
    FollowupRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}
