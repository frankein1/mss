import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopAttendeeRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).stats.view

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopAttendeeCount(input, ctx)
}

export const getWorkshopAttendeeCount = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)
  return WorkshopAttendeeRepo.prisma.groupBy({
    by: ['listType'],
    _count: true,
    where: {
      workshop: { structureId: ctx.structure.id, ...workshopFilters }
    },
    orderBy: { _count: { listType: 'desc' } }
  })
}

export const getWorkshopAttendeeCountStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
