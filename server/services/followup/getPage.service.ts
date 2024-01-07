import { getPage as getPageFn } from './queries'
import { prepareFollowupFilters } from './helper'
import { FollowupRepo } from '~/server/database'
import { GetFollowupsInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
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

  const where = prepareFollowupFilters(input.filters)

  const [items, count] = await Promise.all([
    getPageFn(user, { where, take, skip, orderBy: input.orderBy }),
    FollowupRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}
