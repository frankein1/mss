import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { WorkshopRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

export const getPage = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetWorkshopsInput
}) => {
  const where = {
    structureId: ctx.structure.id,
    ...getDateFilter(input.filter.passed)
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const [items, count] = await Promise.all([
    getWorkshops(ctx, { where, take, skip }, input.filter.passed),
    WorkshopRepo.count(ctx.user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}

export type GetWorkshopsInput = {
  filter: GetWorkshopsPageFilter
  perPage: number
  page: number
}

type GetWorkshopsPageFilter = {
  passed: boolean
}

const getWorkshops = async (
  ctx: SecurityRuleContext,
  args: Prisma.WorkshopFindManyArgs,
  passed: boolean
) => {
  return await WorkshopRepo.findMany(ctx.user, {
    include: {
      workshopName: true
    },
    where: args.where,
    take: args.take,
    skip: args.skip,
    orderBy: {
      date: passed ? 'desc' : 'asc'
    }
  })
}
const getDateFilter = (passed: boolean) => {
  return passed
    ? {
        date: {
          lte: dayjs().toDate()
        }
      }
    : {
        date: {
          gt: dayjs().toDate()
        }
      }
}
