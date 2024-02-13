import { getPage as getPageFn } from './queries'
import { prepareFilters, prepareSort } from './helper'
import { SecurityRuleContext } from '~/server/security'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { FileInstructionPageInput } from '~/server/schema'
import { FileInstructionRepo } from '~/server/database/repository'

export async function getPage({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: FileInstructionPageInput
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
    FileInstructionRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}
