import { Prisma } from '@prisma/client'
import { getPage as getPageFn } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import { SecurityRuleContext } from '~/server/security'
import { GetBeneficiariesInput } from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { BeneficiaryRepo } from '~/server/database'

export async function getPage({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetBeneficiariesInput
}) {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const [items, count] = await Promise.all([
    getPageFn(ctx, { where, take, skip, orderBy: input.orderBy }),
    BeneficiaryRepo.count(ctx.user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return {
    items,
    count,
    totalPages
  }
}
