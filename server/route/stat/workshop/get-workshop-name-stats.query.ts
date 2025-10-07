import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopNameRepo, WorkshopRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { structure, user }
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const workshopFilters = prepareWorkshopStatFilters(input)

  // It's not possible to do a groupBy (on workshops) and retrieve additional fields
  // from a relation (from workshopNames) in a single request,
  // so we have to do 2 parallel requests and merge them in application code
  const [workshops, workshopNames] = await Promise.all([
    WorkshopRepo.prisma.groupBy({
      by: ['workshopNameId'],
      _count: true,
      orderBy: { _count: { workshopNameId: 'desc' } },
      where: { structureId: structure.id, ...workshopFilters }
    }),
    WorkshopNameRepo.findMany(user, {
      select: {
        id: true,
        name: true
      },
      where: {
        structureId: structure.id
      }
    })
  ])

  const workshopNamesById = Object.groupBy(
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
