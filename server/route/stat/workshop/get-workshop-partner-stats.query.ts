import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { PartnerOrganizationRepo, WorkshopRepo } from '~/server/database'
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

  const [workshops, partners] = await Promise.all([
    WorkshopRepo.prisma.groupBy({
      by: ['partnerOrganizationId'],
      orderBy: { _count: { partnerOrganizationId: 'desc' } },
      _count: true,
      where: {
        structureId: structure.id,
        ...workshopFilters
      }
    }),
    PartnerOrganizationRepo.findMany(user, {
      select: { id: true, name: true },
      where: {
        structureId: structure.id
      }
    })
  ])

  const partnersById = Object.groupBy(partners, partner => partner.id)

  return workshops.map(({ partnerOrganizationId, _count }) => ({
    _count,
    id: partnerOrganizationId,
    name:
      partnerOrganizationId &&
      partnersById?.[partnerOrganizationId]?.[0] !== undefined
        ? partnersById[partnerOrganizationId][0].name
        : null
  }))
}

export const getWorkshopPartnerStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
