import type { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { WorkshopRepo } from '~/server/database'
import type { GetWorkshopListInput } from '~/server/schema/workshop/getWorkshopList.schema'
import type { SecurityRuleContext } from '~/server/security'
import { WorkshopPeriodFilter } from '~/types/workshop'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

export const getPage = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetWorkshopListInput
}) => {
  const where: Prisma.WorkshopWhereInput = {
    structureId: ctx.structure.id,
    workshopNameId: { in: input.filter.workshopNameIds },
    ...getDateFilter(input.filter)
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

const getWorkshops = async (
  ctx: SecurityRuleContext,
  args: Prisma.WorkshopFindManyArgs,
  filter: GetWorkshopListInput['filter']
) => {
  return await WorkshopRepo.findMany(ctx.user, {
    include: {
      workshopName: true,
      workshopAttendees: {
        select: {
          attendance: true,
          listType: true
        }
      },
      _count: {
        select: {
          workshopAttendees: true
        }
      }
    },
    where: args.where,
    take: args.take,
    skip: args.skip,
    orderBy: {
      date:
        filter.timeDirection === FilterWorkshopTimeDirection.Past
          ? 'desc'
          : 'asc'
    }
  })
}

function getStartDate(filter: GetWorkshopListInput['filter']) {
  const { timeDirection, fromDate, period } = filter
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  if (timeDirection === FilterWorkshopTimeDirection.Future) {
    if (!fromDate) {
      return todayDate
    }
    // Get max(fromDate, today)
    return fromDate.getTime() > now.valueOf() ? fromDate : todayDate
  }
  switch (period) {
    case WorkshopPeriodFilter.ThisYear:
      return now.startOf('year').toDate()
    case WorkshopPeriodFilter.ThisMonth:
      return now.startOf('month').toDate()
    case WorkshopPeriodFilter.Custom:
      return fromDate
    default:
      return undefined
  }
}

function getEndDate(filter: GetWorkshopListInput['filter']) {
  const { period, timeDirection, toDate } = filter
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  if (timeDirection === FilterWorkshopTimeDirection.Past) {
    if (!toDate) {
      return todayDate
    }
    // Get min(toDate, today)
    return toDate.getTime() < now.valueOf() ? toDate : todayDate
  }
  switch (period) {
    case WorkshopPeriodFilter.ThisYear:
      return now.endOf('year').toDate()
    case WorkshopPeriodFilter.ThisMonth:
      return now.endOf('month').toDate()
    case WorkshopPeriodFilter.Custom:
      return toDate
    default:
      return undefined
  }
}
const getDateFilter = (filter: GetWorkshopListInput['filter']) => {
  const { timeDirection } = filter
  const startDate = getStartDate(filter)
  const endDate = getEndDate(filter)
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  const nowString = now.format('HH:mm')
  if (timeDirection === FilterWorkshopTimeDirection.Future) {
    if (startDate && startDate > todayDate) {
      // Don't worry about startTime
      return { date: { gte: startDate, lte: endDate } }
    }
    return {
      OR: [
        { date: { gt: todayDate, lte: endDate } },
        {
          // Handle startTime when the date is today
          date: { equals: todayDate },
          OR: [{ startTime: { gte: nowString } }, { startTime: null }]
        }
      ]
    }
  }
  if (timeDirection === FilterWorkshopTimeDirection.Past) {
    if (endDate && endDate < todayDate) {
      // Don't worry about startTime
      return { date: { gte: startDate, lte: endDate } }
    }
    return {
      OR: [
        { date: { gte: startDate, lt: todayDate } },
        {
          // Handle startTime when the date is today
          date: { equals: todayDate },
          startTime: { lt: nowString }
        }
      ]
    }
  }

  return { date: { gte: startDate, lte: endDate } }
}
