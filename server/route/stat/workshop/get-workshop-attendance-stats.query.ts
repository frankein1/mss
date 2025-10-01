import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
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
  const workshopFilters = prepareWorkshopStatFilters(input)
  return WorkshopAttendeeRepo.prisma.groupBy({
    by: ['attendance'],
    _count: true,
    where: {
      listType: WorkshopAttendeeListType.Main,
      workshop: { structureId: structure.id, ...workshopFilters }
    }
  })
}

export const getWorkshopAttendanceStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
