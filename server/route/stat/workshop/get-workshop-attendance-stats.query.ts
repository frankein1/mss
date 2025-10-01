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
import { WorkshopAttendeeListType } from '@prisma/client'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { structure }
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const now = new Date().getTime()
  const { date, ...workshopFilters } = prepareWorkshopStatFilters(input)
  const dateFilters = prepareDateFilters(input) ?? {}
  // We only want to include past workshops for attendance stats,
  // but the filter period may clash with this filter. Take the min
  dateFilters.lte = new Date(
    dateFilters?.lte ? Math.min(dateFilters.lte.getTime(), now) : now
  )
  return WorkshopAttendeeRepo.prisma.groupBy({
    by: ['attendance'],
    _count: true,
    where: {
      listType: WorkshopAttendeeListType.Main,
      workshop: {
        structureId: structure.id,
        date: dateFilters,
        ...workshopFilters
      }
    }
  })
}

export const getWorkshopAttendanceStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
