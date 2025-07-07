import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import z from 'zod'
import { WorkshopRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'
import { FilterWorkshopPeriod } from '~/utils/constants/filters'
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
    ...getDateFilter(input.filter.period)
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const [items, count] = await Promise.all([
    getWorkshops(ctx, { where, take, skip }, input.filter),
    WorkshopRepo.count(ctx.user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}

export type GetWorkshopsInput = {
  filter: WorkshopsPageFilterInput
  perPage: number
  page: number
}

export const workshopFilterSchema = z.object({
  period: z.nativeEnum(FilterWorkshopPeriod).nullish()
})

type WorkshopsPageFilterInput = z.infer<typeof workshopFilterSchema>

const getWorkshops = async (
  ctx: SecurityRuleContext,
  args: Prisma.WorkshopFindManyArgs,
  filter: WorkshopsPageFilterInput
) => {
  return await WorkshopRepo.findMany(ctx.user, {
    include: {
      workshopName: true
    },
    where: args.where,
    take: args.take,
    skip: args.skip,
    orderBy: {
      date: filter.period === FilterWorkshopPeriod.Past ? 'desc' : 'asc'
    }
  })
}
const getDateFilter = (period: FilterWorkshopPeriod | undefined | null) => {
  if (!period) {
    return {}
  }
  return period === FilterWorkshopPeriod.Past
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
