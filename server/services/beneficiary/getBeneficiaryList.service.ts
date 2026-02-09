import type { Prisma } from '~/prisma/generated/client'
import { prepareBeneficiaryFilters } from './helper'
import type { SecurityRuleContext } from '~/server/security'
import type { GetBeneficiariesInput } from '~/server/schema'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { BeneficiaryRepo } from '~/server/database'
import { getBeneficiaryListQuery } from './getBeneficiaryList.query'

export default async function getBeneficiaryList({
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
    getBeneficiaryListQuery(ctx, { where, take, skip, orderBy: input.orderBy }),
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
