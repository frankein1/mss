import type { Prisma } from '@prisma/client'
import { WorkshopRepo } from '~/server/database'
import type { GetWorkshopListInput } from '~/server/schema/workshop/getWorkshopList.schema'
import type { SecurityRuleContext } from '~/server/security'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { addCountToWorkshop, prepareWorkshopFilters } from './helper'

export const getPage = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetWorkshopListInput
}) => {
  const where = prepareWorkshopFilters(input.filter, ctx.structure.id)

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

  return { items: items.map(addCountToWorkshop), count, totalPages }
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
