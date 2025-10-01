import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { WorkshopStatFilterInput } from '~/server/schema'
import { workshopStatFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { WorkshopRepo } from '~/server/database'
import {
  prepareDateFilters,
  prepareWorkshopStatFilters
} from '~/server/query/stats/helpers'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: WorkshopStatFilterInput
  ctx: ProtectedAppContext
}) => {
  const { date, ...workshopFilters } = prepareWorkshopStatFilters(input)
  const dateFilters = prepareDateFilters(input)
  const now = new Date().getTime()

  const [future, past] = await Promise.all([
    WorkshopRepo.count(user, {
      where: {
        ...workshopFilters,
        date: {
          lte: dateFilters?.lte,
          gte: new Date(Math.max(now, dateFilters?.gte?.getTime() ?? 0))
        },
        structureId: structure.id
      }
    }),
    WorkshopRepo.count(user, {
      where: {
        ...workshopFilters,
        date: {
          lte: new Date(Math.min(now, dateFilters?.lte?.getTime() ?? Infinity)),
          gte: dateFilters?.gte
        },
        structureId: structure.id
      }
    })
  ])
  return {
    future,
    past,
    total: past + future
  }
}

export const getWorkshopCountStatsQuery = createQuery({
  inputValidation: workshopStatFilterSchema,
  securityCheck,
  handler
})
