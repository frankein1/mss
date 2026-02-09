import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import {
  prepareDateFilters,
  prepareWorkshopStatFilters
} from '~/server/query/stats/helpers'
import { WorkshopAttendeeListType } from '~/prisma/generated/client'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopAttendance(input, ctx)
}

export const getWorkshopAttendance = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const now = new Date().getTime()
  const { date, ...workshopFilters } = prepareWorkshopStatFilters(input)
  const dateFilters = prepareDateFilters(input) ?? {}
  // We only want to include past workshops for attendance stats,
  // but the filter period may clash with this filter. Take the min
  dateFilters.lte = new Date(
    dateFilters?.lte ? Math.min(dateFilters.lte.getTime(), now) : now
  )
  return (
    await WorkshopAttendeeRepo.prisma.groupBy({
      by: ['attendance'],
      _count: true,
      where: {
        listType: WorkshopAttendeeListType.Main,
        workshop: {
          structureId: ctx.structure.id,
          date: dateFilters,
          ...workshopFilters
        }
      },
      orderBy: { _count: { attendance: 'desc' } }
    })
  ).sort((a, b) => b._count - a._count)
}

export const getWorkshopAttendanceStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
