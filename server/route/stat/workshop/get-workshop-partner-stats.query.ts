import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { PartnerOrganizationRepo, WorkshopRepo } from '~/server/database'
import { prepareWorkshopStatFilters } from '~/server/query/stats/helpers'
import groupBy from '~/utils/groupBy'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getWorkshopPartners(input, ctx)
}

export const getWorkshopPartners = async (
  input: WorkshopStatFilterInput,
  ctx: ProtectedAppContext
) => {
  const workshopFilters = prepareWorkshopStatFilters(input)

  // It's not possible to do a groupBy (on workshops) and retrieve additional fields
  // from a relation (from partners) in a single request,
  // so we have to do 2 parallel requests and merge them in application code
  const [workshops, partners] = await Promise.all([
    WorkshopRepo.prisma.groupBy({
      by: ['partnerOrganizationId'],
      orderBy: { _count: { partnerOrganizationId: 'desc' } },
      _count: true,
      where: {
        structureId: ctx.structure.id,
        ...workshopFilters
      }
    }),
    PartnerOrganizationRepo.findMany(ctx.user, {
      select: { id: true, name: true },
      where: {
        structureId: ctx.structure.id
      }
    })
  ])

  const partnersById = groupBy(partners, partner => partner.id)

  return workshops
    .map(({ partnerOrganizationId, _count }) => ({
      _count,
      id: partnerOrganizationId,
      // partnerOrganizationId might be null, so be careful not to access
      // partnersById[partnerOrganizationId] directly, as will fail even with
      // optional chaining.
      name:
        partnerOrganizationId &&
        partnersById[partnerOrganizationId]?.[0] !== undefined
          ? partnersById[partnerOrganizationId][0].name
          : null
    }))
    .sort((a, b) => b._count - a._count)
}

export const getWorkshopPartnerStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
