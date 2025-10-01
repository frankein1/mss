import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { PartnerOrganizationRepo } from '~/server/database'
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
  const { partnerOrganizationId, ...workshopFilters } =
    prepareWorkshopStatFilters(input)

  return PartnerOrganizationRepo.findMany(user, {
    select: {
      id: true,
      name: true,
      _count: { select: { workshops: { where: workshopFilters } } }
    },
    where: {
      id: { in: input.partnerOrganizationIds },
      structureId: structure.id,
      // Select partner orgs which have at least one workshop
      workshops: { some: {} }
    },
    orderBy: { workshops: { _count: 'desc' } }
  })
}

export const getWorkshopPartnerStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
