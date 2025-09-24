import { WorkshopAttendeeListType, type Prisma } from '@prisma/client'
import { WorkshopRepo } from '~/server/database'
import type { GetWorkshopListInput } from '~/server/schema/workshop/getWorkshopList.schema'
import type { SecurityRuleContext } from '~/server/security'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareWorkshopFilters } from './helper'

export const getPage = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetWorkshopListInput
}) => {
  const where: Prisma.WorkshopWhereInput = prepareWorkshopFilters(
    input.filter,
    ctx.structure.id
  )

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

  return { items: formatWorkshops(items), count, totalPages }
}

const getWorkshops = async (
  ctx: SecurityRuleContext,
  args: Prisma.WorkshopFindManyArgs,
  filter: GetWorkshopListInput['filter']
) => {
  return await WorkshopRepo.findMany(ctx.user, {
    select: {
      id: true,
      date: true,
      location: true,
      sessionName: true,
      startTime: true,
      attendeeLimit: true,
      workshopName: {
        select: {
          name: true
        }
      },
      workshopAttendees: {
        select: {
          beneficiaryId: true,
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

function formatWorkshops(workshops: Awaited<ReturnType<typeof getWorkshops>>) {
  return workshops.map(w => {
    const mainAttendees = w.workshopAttendees.filter(
      a => a.listType === WorkshopAttendeeListType.Main
    ).length
    const waitingAttendeees = Math.max(
      0,
      w._count.workshopAttendees - mainAttendees
    )

    return {
      ...w,
      isFull: w.attendeeLimit !== null && mainAttendees >= w.attendeeLimit,
      _count: {
        ...w._count,
        mainAttendees,
        waitingAttendeees
      }
    }
  })
}
