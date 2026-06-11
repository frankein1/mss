import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopNameRepo, WorkshopRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import { STATS_NULL_KEY } from '~/utils/constants/stats'
import groupBy from '~/utils/groupBy'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).stats.view

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopNameStats(input, ctx)
}

export const getWorkshopNameStats = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)

  // It's not possible to do a groupBy (on workshops) and retrieve additional fields
  // from a relation (from workshopNames) in a single request,
  // so we have to do 2 parallel requests and merge them in application code
  const [workshops, workshopNames] = await Promise.all([
    WorkshopRepo.prisma.groupBy({
      by: ['workshopNameId'],
      _count: true,
      orderBy: { _count: { workshopNameId: 'desc' } },
      where: { structureId: ctx.structure.id, ...workshopFilters }
    }),
    WorkshopNameRepo.findMany(ctx.user, {
      select: {
        id: true,
        name: true
      },
      where: {
        structureId: ctx.structure.id
      }
    })
  ])

  const workshopNamesById = groupBy(
    workshopNames,
    workshopName => workshopName.id
  )

  return workshops.map(({ workshopNameId, _count }) => ({
    id: workshopNameId,
    _count,
    name: workshopNamesById[workshopNameId]?.[0]?.name ?? STATS_NULL_KEY
  }))
}

export const getWorkshopNameStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
