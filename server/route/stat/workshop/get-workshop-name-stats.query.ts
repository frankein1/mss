import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopNameRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { structure, user }
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const { workshopNameId, ...workshopFilters } =
    prepareWorkshopStatFilters(input)

  return WorkshopNameRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: { select: { workshops: { where: workshopFilters } } }
    },
    where: {
      structureId: structure.id,
      id: { in: input.workshopNameIds }
    },
    orderBy: { workshops: { _count: 'desc' } }
  })
}

export const getWorkshopNameStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
